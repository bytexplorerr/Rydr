import React, { useContext, useEffect, useRef, useState } from 'react'
import { TripInfoContext } from '../store/TripContext'
import { assets } from '../assets/assets';
import { FaRupeeSign } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { toast } from 'react-toastify';
import axios from 'axios';
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import Chats from './Chats';
import { SocketContext } from '../store/SocketContext';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { FaRoad } from "react-icons/fa";
import { LuTimer } from "react-icons/lu";

const containerStyle = {width:'100%',height:'500px'};

const Riding = ({rideInfo,directions,setDirections,distance,setDistance,time,setTime}) => {

    const {tripInfo,setRideConfirmed,setShowChats,showChats,setPickupCoordinates,setCaptainCoordinates,pickupCoordinates,captainCoordinates,destinationCoordinates,setDestinationCoordinates,setTripInfo} = useContext(TripInfoContext);
    const [isOTPverified,setOTPVerified] = useState(false);
    const otpRef = useRef(null);


     // Fetch captain's real-time location
     useEffect(() => {
        if ("geolocation" in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const newCaptainCoordinates = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setCaptainCoordinates(newCaptainCoordinates);

                    try {
                        await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/update-captain-location`,{rideId:rideInfo._id,location:newCaptainCoordinates},{
                            withCredentials:true,
                        });
                    } catch(err) {
                        console.log(err.message);
                    }
                },
                (error) => {
                    console.error("Error fetching location:", error);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 5000,
                    timeout: 10000
                }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            toast.error("Geolocation is not supported by this browser.");
        }
    }, []);


    const {setMessages} = useContext(SocketContext);

    const handleCancelRide = async ()=>{
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/captain-cancel-ride`,{rideId:rideInfo._id,},{
                withCredentials:true,
            });

            if(response.status == 200) {
                toast.success('Ride Cancelled successfully!');
                setRideConfirmed(false);
                setShowChats(false); 
                setCaptainCoordinates(null);
                setPickupCoordinates(null);
                setDirections(null);
                setDestinationCoordinates(null);
                setMessages([]);
            } else {
                toast.error('Error in cancelling the ride!');
            }
        } catch(err) {
            console.log(err.message);
            toast.error('Error in cancelling the ride, try again!');
        }
    }

    // Function to fetch directions
    const getDirections = (origin, destination) => {

        if (!window.google || !window.google.maps || !window.google.maps.DirectionsService) {
            console.error("Google Maps API is not loaded yet.");
            return;
        }
    
        if (!origin || !destination) {
            console.error("Origin or Destination is missing.");
            return;
        }

        const directionService = new window.google.maps.DirectionsService();
        
        directionService.route(
        {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
            provideRouteAlternatives:true,
        },
        (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            } else {
            console.error("Error fetching directions", status);
            }
        }
        );
    };


    const handleConfirmOTP = async ()=>{
        try {
            if(otpRef.current.value === '') return;

            const otp = otpRef.current.value;
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/verify-otp`,{
                rideId:rideInfo._id,
                otp,
            },{
                withCredentials:true,
            });
            
            if(response.status === 200) {
                toast.success('OTP verified sucessfully!');
                setOTPVerified(true);
                setDestinationCoordinates(response.data.ride.destinationCoordinates);
                otpRef.current.value = '';
            } else {
                toast.error('Error in verify the OTP, try agian!');
            }
            
        } catch(err) {
            toast.error('Error in verify the OTP, try agian!');
        }
    }


    useEffect(()=>{
        if (window.google && window.google.maps && window.google.maps.DirectionsService) {
            if (!isOTPverified) {
                getDirections(captainCoordinates, pickupCoordinates);
            } else {
                getDirections(captainCoordinates, destinationCoordinates);
            }
        } else {
            console.warn("Google Maps API is not loaded yet.");
        }
    },[isOTPverified,captainCoordinates,pickupCoordinates,destinationCoordinates]);


    const handleFinishRide = async ()=>{
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/rides/ride-completed?rideId=${rideInfo._id}`,{
                withCredentials:true,
            });

            if(response.status === 200) {
                setPickupCoordinates(null);
                setDestinationCoordinates(null);
                setCaptainCoordinates(null);
                setDirections(null);
                setRideConfirmed(false);
                setOTPVerified(false);
                setMessages([]);
                setShowChats(false);
                setTripInfo(null);

                setDistance('0 m');
                setTime('0 min');

                toast.success('Ride Finished sucessfully!');
            } else {
                toast.error('Error in finishing the ride, try again!');
            }
        } catch(err) {
            toast.error('Error in finishing the ride, try again!');
        }
    }

    const fetchDistanceAndTime = async () => {
        try {
            if (!captainCoordinates || !pickupCoordinates) return;
    
            const destination = isOTPverified
                ? `${destinationCoordinates.lat},${destinationCoordinates.lng}`
                : `${pickupCoordinates.lat},${pickupCoordinates.lng}`;
    
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time-captain`, {
                params:{
                origin: `${captainCoordinates.lat},${captainCoordinates.lng}`,
                destination: destination,
            }, withCredentials: true,
            });
    
            if (response.status === 200 && response.data) {

                const { distance, duration } = response.data;
    
                // Set distance in meters or kilometers
                setDistance(distance.value >= 1000
                    ? `${(distance.value / 1000).toFixed(2)} km`
                    : `${distance.value} m`);
    
                // Set duration in minutes (round up for accuracy)
                setTime(`${Math.ceil(duration.value / 60)} min`);
            }
        } catch (err) {
            console.error("Error fetching distance and time:", err.message);
        }
    };

    // Auto Update Distance & Time Every 10 Seconds
    useEffect(() => {
    fetchDistanceAndTime();
    const interval = setInterval(fetchDistanceAndTime, 10000); // Update every 10s

    return () => clearInterval(interval); // Cleanup on unmount
}, [isOTPverified,pickupCoordinates]);


  return (
    <section>
        <p className='text-center text-4xl font-semibold my-8'>On the way</p>
        <div className='rounded-2xl bg-gray-950 m-3 shadow-sm shadow-gray-200 px-2 py-4'>
            <section className='*:border-1 *:border-[#8136E2] *:rounded-sm flex *:flex *:items-center *:p-1 *:m-1 *:gap-2 justify-between max-md:flex-col *:w-full *:gap-y-8'>
            <aside className='w-4/10'>
                <img src = {assets.pickup} alt = "pickup_image" />
                <p className='ml-1'>{rideInfo.pickup}</p>
            </aside>
            <aside className='w-4/10'>
                <img src = {assets.drop} alt = "dropoff_image" />
                <p className='ml-1'>{rideInfo.destination}</p>
            </aside>
            <aside className='w-1/9'>
                <FaRupeeSign />
                <span className='ml-0.5'>{rideInfo.fare}</span>
            </aside>
            </section>
            <section className='my-4 flex justify-center items-center gap-2'>
                <div className='border-1 border-gray-50 rounded-md gap-16 bg-[#8136E2] p-2 font-medium flex items-center shadow-sm shadow-[#8136E2] max-[300px]:flex-col max-[300px]:gap-2'>
                <p className='flex items-center'> <span className='border-1 rounded-full p-1'><IoPerson  /></span> <span className='ml-1 capitalize'>{rideInfo.user.fullName.firstName} {rideInfo.user.fullName.lastName}</span></p>
                <p>{rideInfo?.distance || '0 m'}</p>
                </div>
                <div className='bg-[#8136E2] p-2 cursor-pointer rounded-full shadow-sm shadow-gray-50' title='Chat' onClick={()=>{setShowChats(true)}}>
                    <IoChatboxEllipsesOutline size={24} />
                </div>
            </section>

            {!isOTPverified && <div className='m-6 flex gap-4 items-center max-[370px]:flex-col max-[37px]:justify-center'>
                <input
                    type='text' placeholder='Enter OTP'
                    ref={otpRef}
                    className='mt-2 text-white border-1 border-white outline-0 w-[120px] p-2 rounded-lg focus:border-[#8136E2]'
                />
                <button className='bg-green-500 px-2 py-1 rounded-lg font-semibold cursor-pointer' onClick={handleConfirmOTP}>Confirm OTP</button>
            </div>}
            {!isOTPverified && <section className='flex justify-center items-center my-8 gap-12 *:py-2 *:px-4 font-semibold *:rounded-md *:cursor-pointer max-[300px]:flex-col max-[300px]:gap-3'>
                <button type='button' className='bg-red-500 font-bold text-xl flex items-center' onClick={handleCancelRide}>Cancel Ride</button>
            </section>}
            
            {isOTPverified && <section className='flex justify-center items-center my-8 gap-12 *:py-2 *:px-4 font-semibold *:rounded-md *:cursor-pointer max-[300px]:flex-col max-[300px]:gap-3' onClick={handleFinishRide}>
                <button type='button' className='bg-green-500 font-bold text-xl flex items-center'>Finish Ride</button>
            </section>}

        </div>

         {/* Show Google Map when OTP is verified */}
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={captainCoordinates} zoom={14}>
                {directions && <DirectionsRenderer directions={directions}/>} 
                {/* Captain's Marker with an Arrow */}
                {captainCoordinates && (
                <Marker 
                    position={captainCoordinates} 
                    icon={{ 
                        url: "https://maps.google.com/mapfiles/kml/shapes/arrow.png", 
                        scaledSize: window.google?.maps?.Size ? new window.google.maps.Size(50, 50) : undefined
                    }} 
                />
            )}
            </GoogleMap>
        </LoadScript>

        <div className='bg-[#8136E2] p-2 text-2xl text-white text-center mx-2 my-6 flex flex-col justify-center items-center gap-y-2'>
            <p className='inline-flex items-center gap-2'> <FaRoad size={24}  /> {distance}</p>
            <p className='inline-flex items-center gap-2'> <LuTimer size={24} />{time}</p>
        </div>

        {showChats && <section className="absolute right-1 top-2 z-50 h-full w-1/2 max-[600px]:w-full bg-gray-950 shadow-sm shadow-gray-100 rounded-2xl overflow-y-scroll"><Chats/></section>}
    </section>
  )
}

export default Riding