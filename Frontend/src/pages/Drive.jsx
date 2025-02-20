  import React, { useContext, useEffect, useState } from 'react'
  import { UserDataContext } from '../store/UserContext';
  import { SocketContext } from '../store/SocketContext';
  import { assets } from '../assets/assets';
  import { FaRupeeSign } from "react-icons/fa";
  import { IoPerson } from "react-icons/io5";
  import { TripInfoContext } from '../store/TripContext';
  import { toast } from 'react-toastify';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';
import Riding from '../components/Riding';

  const Drive = () => {

    const [rideInformation,setRideInformation] = useState(null);
    const [directions, setDirections] = useState(null);
    const {userToken,role} = useContext(UserDataContext);
    const [distance,setDistance] = useState('0 m');
    const [time,setTime] = useState('0 min');

    const {sendMessage,receiveMessage,removeMessage,setMessages} = useContext(SocketContext);

    const {availableRides,setAvailableRides,setRideConfirmed,rideConfirmed,setTripInfo,setShowChats,pickupCoordinates,setPickupCoordinates,captainCoordinates,setCaptainCoordinates,setDestinationCoordinates} = useContext(TripInfoContext);

    const navigate = useNavigate();

    useEffect(()=>{

      const data = {
        token:userToken,
        userType:role
      };

      sendMessage('join',data);


      // To access the location by the broswer, we can't do it in our 'localhost' or 'local machine'.
      // We need to use the concept of 'port-forwarding'.

      const updateLocation = ()=>{
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position)=>{
            const data = {
              token:userToken,
              userType:role,
              location:{
                ltd:position.coords.latitude,
                lng:position.coords.longitude
              }
            }
            sendMessage('update-captain-location',data);
          });
        }
      }

      // update the location of captain in every 10 seconds
      const locationInterval = setInterval(updateLocation,10000);

      updateLocation();

      return ()=> clearInterval(locationInterval);
    },[userToken,role,sendMessage]);

    useEffect(() => {
      const handleBeforeUnload = (event) => {
        event.preventDefault();
        alert("You are trying to reload the page!");
        event.returnValue = ''; // Required for Chrome
      };
    
      window.onbeforeunload = handleBeforeUnload;
    
      return () => {
        window.onbeforeunload = null; // Cleanup function
      };
    }, []);
    


    useEffect(() => {
      const handleRideCancelled = (data) => {
        toast.error('Ride Cancelled by user!');
        setRideConfirmed(false);
        setShowChats(false);
        setMessages([]);
        setPickupCoordinates(null);
        setCaptainCoordinates(null);
        setDirections(null);
        setDestinationCoordinates(null);

        setDistance('0 m');
        setTime('0 min');

        setAvailableRides((prevRides) => prevRides.filter(ride => ride._id !== data));
      };

      receiveMessage('ride-cancelled', handleRideCancelled);

      return () => {
          removeMessage('ride-cancelled', handleRideCancelled);
      };
  }, []);

  useEffect(()=>{
    const handleRideRequestDeleted = (data)=>{
      setAvailableRides((prevRides)=> prevRides.filter(ride=> ride._id !== data));
    };

    receiveMessage('ride-delete',handleRideRequestDeleted);

    return ()=>{
      removeMessage('ride-delete',handleRideRequestDeleted);
    }
  },[]);

  useEffect(() => {
      const handleNewRide = async (data) => {
        try {
          const token = document.cookie.split('; ').find((row)=>row.startsWith('token='))?.split('=')[1];
          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/distance-from-user`,{pickup:data.pickup},{
            headers:{
              "Authorization":`Bearer ${token}`,
              "Content-Type":"application/json",
            },
            withCredentials:true
          });

          if(response.status === 200) {
            let distance = response.data.distance;
            if(distance < 1000) {
              distance += ' m';
            } else {
              distance = (distance/1000).toFixed(2) + ' Km';
            }
            const updateData = {...data,distance};
            setAvailableRides((prevRides) => [updateData, ...prevRides]);
          }
        } catch(err) {
          console.log(err.message);
        }
      };

      receiveMessage('new-ride', handleNewRide);

      return () => {
          removeMessage('new-ride', handleNewRide);
      };
  }, [setAvailableRides]);

    const handleRideIgnore = (id)=>{
      setAvailableRides((rides) => rides.filter((ride) => ride._id !== id));
    }

    const handleConfirmRide = async (rideInfo)=> {

      try {
        const token = document.cookie.split('; ').find((row)=> row.startsWith('token='))?.split('=')[1];
        if(!token) {
          toast.error('Unauthorized to Confirm the Ride, Login Agian!');
          navigate("/captain-login");
        }
        
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/captain-ride-confirm`,{rideInfo},{
          headers:{
            Authorization:`Bearer ${token}`,
          },
          withCredentials:true
        });

        if(response.status === 200) {
          toast.success('Ride Accepted Successfully!'); 
          setRideConfirmed(true);
          setTripInfo(response.data.ride);
          setRideInformation(rideInfo);
          setCaptainCoordinates(response.data.rideInfo.captainCoorinates);
          setPickupCoordinates(response.data.rideInfo.pickupCoordinates);
        } else {
          toast.error('Error in accepting the ride, try again!');
        }

      } catch(err) {
        console.log(err.message);
        toast.error('Error in accepting the ride, try again!');
      }
    }

    return (
      <section className='min-h-[500px]'>
      {!rideConfirmed ? <section>
        {availableRides.length === 0 && <div className='flex items-center flex-col my-8 font-semibold text-lg'>
                                            <p>No Rides Available Nearby you!</p>
                                            <p className='text-sm'>Please Wait, We are searching rides nearby you...</p>
                                        </div>}
          

        {availableRides.length > 0 && <main>
          <h1 className='text-center text-3xl font-semibold my-8'>New Rides Available!</h1>
            {availableRides.map((rideInfo,index)=>(
                <div className='rounded-2xl bg-gray-950 m-3 shadow-sm shadow-gray-200 px-2 py-4' key={index}>
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
              <section className='my-4 flex justify-center'>
                  <div className='border-1 border-gray-50 rounded-md gap-16 bg-[#8136E2] p-2 font-medium flex shadow-sm shadow-[#8136E2] max-[300px]:flex-col max-[300px]:gap-2'>
                    <p className='flex items-center'> <span className='border-1 rounded-full p-1'><IoPerson  /></span> <span className='ml-1 capitalize'>{rideInfo.user.fullName.firstName} {rideInfo.user.fullName.lastName}</span></p>
                    <p>{rideInfo?.distance || '0 m'}</p>
                  </div>
              </section>
              <section className='flex justify-center items-center my-6 gap-12 *:py-2 *:px-4 font-semibold *:rounded-md *:cursor-pointer max-[300px]:flex-col max-[300px]:gap-3'>
                <button type="button" className='bg-green-500' onClick={()=>handleConfirmRide(rideInfo)}>Confirm</button>
                <button type='button' className='bg-red-500' onClick={()=>handleRideIgnore(rideInfo._id)}>Ignore</button>
              </section>
              </div>
            ))}
        </main>}
      </section> : <Riding rideInfo={rideInformation} directions = {directions} setDirections = {setDirections} distance={distance} setDistance = {setDistance} time={time} setTime = {setTime} />}
      </section>
    )
  }

  export default Drive
