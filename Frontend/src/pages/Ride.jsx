import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import GetRide from "../components/GetRide";
import Vehicles from "../components/Vehicles";
import TripContext, { TripInfoContext } from "../store/TripContext";
import LookingForCaptain from "../components/LookingForCaptain";
import axios from "axios";
import { UserDataContext } from "../store/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import WaitingForCaptain from "../components/WaitingForCaptain";
import { SocketContext } from "../store/SocketContext";
import Chats from "../components/Chats";
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { FaRoad } from "react-icons/fa";
import { LuTimer } from "react-icons/lu";


const containerStyle = { width: "100%", height: "500px" };

const Ride = () => {

  const {showVehicles,serachCaptain,rideConfirmed,setSearchCaptain,setRideConfirmed,showChats,setShowChats,setTripInfo,tripInfo,pickupCoordinates,setPickupCoordinates,captainCoordinates,setCaptainCoordinates,destinationCoordinates,setDestinationCoordinates,setPickupLocation,setDropoffLocation} = useContext(TripInfoContext);
  const {receiveMessage,removeMessage} = useContext(SocketContext);
  const vehicleFocusRef = useRef(null);
  const [scrollTriggers,setScrollTriggers] = useState(false);
  const {userToken} = useContext(UserDataContext);
  const [rideInfo,setRideInfo] = useState(null);
  const navigate = useNavigate();
  const [directions, setDirections] = useState(null);
  const [isOTPverified,setOTPVerified] = useState(false);

  const [distance,setDistance] = useState('0 m');
  const [time,setTime] = useState('0 min');

  const {setMessages} = useContext(SocketContext);

  // Function to fetch directions
  const getDirections = (origin, destination) => {

    if (!window.google || !window.google.maps || !window.google.maps.DirectionsService) {
      console.error("Google Maps API is not loaded yet.");
      return;
    }

    if (!origin || !destination) return;

    const directionService = new window.google.maps.DirectionsService();
    directionService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
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


  useEffect(()=>{
     if(showVehicles && vehicleFocusRef.current) {
        setTimeout(()=>{
          vehicleFocusRef.current?.scrollIntoView({behavior:'smooth',block:'start'})
      },200); 
     }
  },[scrollTriggers,showVehicles]);

  useEffect(()=>{
      const handleRideConfirmed = (data)=>{
        console.log(data);
        setSearchCaptain(false);
        setRideConfirmed(true);
        setRideInfo(data);
        setTripInfo(data);
        setCaptainCoordinates(data.captainCoorinates);
        setPickupCoordinates(data.pickupCoordinates);
        toast.success('Captain is on the way!');

        if (window.google && window.google.maps && window.google.maps.DirectionsService) {
          getDirections(captainCoordinates,pickupCoordinates);
      } else {
          console.warn("Google Maps API is not loaded yet.");
      }
      };
  
      receiveMessage('ride-confirmed',handleRideConfirmed);
  
      return ()=>{
        removeMessage('ride-confirmed',handleRideConfirmed);
      }
    },[]);

    useEffect(()=>{

      const handleRideCancel = (data)=>{
        toast.error('Ride cancelled by captain!');
        setRideConfirmed(false);
        setRideInfo(null);
        setTripInfo(null);
        setShowChats(false);
        setPickupCoordinates(null);
        setCaptainCoordinates(null);
        setDestinationCoordinates(null);
        setDirections(null);
        setDistance('0 m');
        setTime('0 min');
        setMessages([]);
      }

      receiveMessage('captain-ride-cancelled',handleRideCancel);

      return ()=>{
        removeMessage('captain-ride-cancelled',handleRideCancel);
      }
    },[]);

  useEffect(()=>{

    const handleRideStarted = (data)=>{
      toast.success('Ride Started!');
      setDestinationCoordinates(data.destinationCoordinates);
      setOTPVerified(true);

      getDirections(captainCoordinates,data.destinationCoordinates);
    }

    receiveMessage('ride-started',handleRideStarted);

    return ()=>{
      removeMessage('ride-started',handleRideStarted);
    }

  },[]);


  useEffect(()=>{

    const handleFinishRide = (data)=>{
      setCaptainCoordinates(null);
      setDestinationCoordinates(null);
      setPickupCoordinates(null);
      setDirections(null);
      setMessages([]);
      setOTPVerified(false);
      setRideConfirmed(false);
      setRideInfo(null);
      setTripInfo(null);
      setShowChats(false);

      setPickupLocation('');
      setDropoffLocation('');

      toast.success('Ride Completed!');
    }

    receiveMessage('ride-completed',handleFinishRide);

    return ()=>{
      removeMessage('ride-completed',handleFinishRide);
    }

  },[]);

  // Listen for Captain's Real-Time Location Updates via WebSockets
  useEffect(() => {
    const updateCaptainLocation = (data) => {
      setCaptainCoordinates(data);
    };

    receiveMessage("updated-captain-location", updateCaptainLocation);

    return () => {
      removeMessage("updated-captain-location", updateCaptainLocation);
    };
  }, []);

  // Update route when captain moves
  useEffect(() => {
    if (rideConfirmed && !isOTPverified) {
      getDirections(captainCoordinates, pickupCoordinates);
    } else if (isOTPverified) {
      getDirections(captainCoordinates, destinationCoordinates);
    }
  }, [captainCoordinates, pickupCoordinates, destinationCoordinates, isOTPverified]);


  const fetchDistanceAndTime = async () => {
    try {
        if (!captainCoordinates || !pickupCoordinates) return;

        const destination = isOTPverified
            ? `${destinationCoordinates.lat},${destinationCoordinates.lng}`
            : `${pickupCoordinates.lat},${pickupCoordinates.lng}`;


        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time-user`, {
            params:{
            origin: `${captainCoordinates.lat},${captainCoordinates.lng}`,
            destination: destination,
        },  withCredentials: true,
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
    <section className="relative">
      
      {!rideConfirmed && <section className="flex my-8 gap-2 justify-between max-md:flex-col max-md:items-center">
        <GetRide setScrollTriggers={setScrollTriggers}
        />
        {/* Map Section */}
        <div className="w-[70%] max-md:w-full max-md:mx-1 max-md:my-4">
          <img src={assets.map_image} alt="map_image" className="rounded-sm min-h-[500px]" />
        </div>
      </section>}


      {!rideConfirmed && <div ref={vehicleFocusRef}>
        {showVehicles &&  <Vehicles />}
      </div>}

      {!rideConfirmed && serachCaptain && <LookingForCaptain />}

      {rideConfirmed && <WaitingForCaptain rideInfo = {rideInfo} isOTPverified={isOTPverified} setDirections = {setDirections} />}

      {/* Google Map for Tracking */}
      {rideConfirmed && (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
          <GoogleMap mapContainerStyle={containerStyle} center={captainCoordinates} zoom={14}>
          {captainCoordinates && (
                <Marker 
                    position={captainCoordinates} 
                    icon={{ 
                        url: "https://maps.google.com/mapfiles/kml/shapes/arrow.png", 
                        scaledSize: window.google?.maps?.Size ? new window.google.maps.Size(50, 50) : undefined
                    }} 
                />
          )}
          {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </LoadScript>
      )}

      {rideConfirmed && (
        <div className='bg-[#8136E2] p-2 text-2xl text-white text-center mx-2 my-6 flex flex-col justify-center items-center gap-y-2'>
            <p className='inline-flex items-center gap-2'> <FaRoad size={24}  /> {distance}</p>
            <p className='inline-flex items-center gap-2'> <LuTimer size={24} />{time}</p>
        </div>
      )}

      {showChats && <section className="absolute right-1 top-2 z-50 h-full w-1/2 max-[600px]:w-full bg-gray-950 shadow-sm shadow-gray-100 rounded-2xl overflow-y-scroll"><Chats/></section>}

    </section>

  );
};

export default Ride;
