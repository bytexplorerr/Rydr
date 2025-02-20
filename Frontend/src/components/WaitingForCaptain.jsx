import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { FaRupeeSign } from "react-icons/fa";
import { TripInfoContext } from '../store/TripContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { SocketContext } from '../store/SocketContext';

const WaitingForCaptain = ({rideInfo,isOTPverified,setDirections}) => {

  const {tripInfo,setRideConfirmed,setShowChats,pickupCoordinates,setPickupCoordinates,captainCoordinates,setCaptainCoordinates,setDestinationCoordinates} = useContext(TripInfoContext);

  const {setMessages} = useContext(SocketContext);

  const handleRideCancel = async ()=>{
    try {
      const token = document.cookie.split('; ').find((row)=>row.startsWith('token='))?.split('=')[1];
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/rides/cancel-ride`,{
        headers:{
          Authorization:`Bearer ${token}`,
        },
        withCredentials:true
      });

      if(response.status === 200) {
          toast.success('Ride Cancelled Successfully!');
          setRideConfirmed(false);
          setShowChats(false);
          setPickupCoordinates(null);
          setCaptainCoordinates(null);
          setDirections(null);
          setDestinationCoordinates(null);
          setMessages([]);
      } else {
          toast.error('Error in Cancelling the ride, Try Again!');
      }
    } catch(err) {
      toast.error('Error in cancelling the ride, try again!');
    }
  }

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Warning: Your ride will be cancelled if you refresh!";
    };

    const handleUnload = async () => {
      await handleRideCancel();  // Cancel the ride before the page unloads
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  return (
    <section className='my-8'>
      {isOTPverified?<h1 className='text-center text-4xl max-[501px]:text-2xl'>Ride Started</h1> : <h1 className='text-center text-4xl max-[501px]:text-2xl'>Captain is on the way</h1>}
      <main className='w-[500px] bg-gray-950 rounded-2xl m-auto my-6 p-4 shadow-sm shadow-gray-50 max-[501px]:w-full'>
       <div className='flex justify-between border-1 border-[#8136E2] py-2 px-3 items-center rounded-md mb-4 max-[501px]:flex-col max-[501px]:items-start max-[501px]:gap-y-4'>
        <aside className='flex items-center max-[501px]:flex-col max-[501px]:items-start max-[501px]:w-full'>
            <img src={tripInfo?.vehicle || assets.car} width="80px" height="80px" alt='RydrGo Vehicle' className='max-[501px]:mx-auto'/>
           <div className='ml-1 font-medium text-lg'>
            <p className='capitalize'>{rideInfo.captain.fullName.firstName} {rideInfo.captain.fullName.lastName}</p>
            <p>{rideInfo.captain.vehicle.plate}</p>
           </div>
          </aside>
          <aside className='max-[501px]:flex max-[501px]:w-full justify-between px-2 max-[250px]:flex-col py-2'>
            <p className='bg-[#8136E2] py-2 px-4 rounded-sm font-semibold tracking-[5px] text-lg'>{rideInfo.rideInfo.otp}</p>
            <p className='text-lg font-medium mt-1 text-center'>{rideInfo.rideInfo.distance}</p>
          </aside>
          <aside className='bg-[#8136E2] p-2 cursor-pointer rounded-full shadow-sm shadow-gray-50 inline-block' title='Chat' onClick={()=>{setShowChats(true)}}>
            <IoChatboxEllipsesOutline size={24} />
         </aside>
       </div>

       <div>
        <aside className='flex border-1 border-[#8136E2] py-2 px-3 items-center rounded-md mb-4'>
          <img src = {assets.pickup} alt = "pickup location icon"/>
          <p className='ml-1'>{rideInfo.rideInfo.pickup}</p>
        </aside>
        <aside className='flex border-1 border-[#8136E2] py-2 px-3 items-center rounded-md mb-4'>
          <img src = {assets.drop} alt='dropoff location icon'/>
          <p className='ml-1'>{rideInfo.rideInfo.destination}</p>
        </aside>
        <aside className='flex border-1 border-[#8136E2] py-2 px-3 items-center rounded-md mb-4'>
          <FaRupeeSign/> <span className='ml-1'>{rideInfo.rideInfo.fare}</span>
        </aside>
        {!isOTPverified && <aside className='flex justify-center mt-8 mb-4'>
          <button type='button' className='font-bold text-lg bg-red-700 px-4 py-2 rounded-lg cursor-pointer' onClick={handleRideCancel}>Cancel Ride</button>
        </aside>}
       </div>
      </main>
    </section>
  )
}

export default WaitingForCaptain
