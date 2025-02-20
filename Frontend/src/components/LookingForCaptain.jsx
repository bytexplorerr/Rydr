import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { TripInfoContext } from '../store/TripContext'
import { FaRupeeSign } from "react-icons/fa";
import Lottie from "lottie-react"
import progressBar from "../assets/lottie_progressbar.json";
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserDataContext } from '../store/UserContext';
import { SocketContext } from '../store/SocketContext';

const LookingForCaptain = () => {

    const {tripInfo,setSearchCaptain,setShowVehicles} = useContext(TripInfoContext);
    const {userToken,role} = useContext(UserDataContext);
    const {sendMessage} = useContext(SocketContext);

    useEffect(()=>{
        const data = {
            token:userToken,
            userType:role,
        }
        sendMessage('join',data);
    },[]);

    const handleCancelRide = async ()=>{
        try{
            const token = document.cookie.split('; ').find((row)=>row.startsWith('token=')).split('=')[1];
            const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/rides/delete-ride`,{
                headers:{
                    Authorization:`Bearer ${token}`,
                },
                withCredentials:true
            });

            if(response.status === 200) {
                toast.success('Ride Cancelled Successfully!');
                setSearchCaptain(false);
                setShowVehicles(false);
            } else {
                toast.error('Error in Cancelling the ride, Try Again!');
            }
        } catch(err) {
            toast.error('Error in Cancelling the ride, Try Again!');
        }
    }

  return (
    <section className='flex justify-center'>
        <main className='bg-gray-950 w-[500px] my-16 shadow-sm shadow-gray-200 rounded-xl p-2 max-[501px]:w-full max-[501px]:mx-0.5'>

            {/* Lottie Animation */}
            <div className='flex justify-center m-2 rounded-2xl h-[8px]'>
                    <Lottie animationData={progressBar} loop={true} />
            </div>

            <h1 className='text-3xl font-semibold text-center my-6'>Looing for Captain</h1>
            <div className='flex justify-center'>
                <img src = {tripInfo.vehicle} width="80px" height="80px" alt='RydrGo Vehicle'/>
            </div>
            <div className='flex gap-2 border-1 border-[#8136E2] rounded-sm p-2 my-4 items-center'>
                <img src = {assets.pickup} alt='pickup_location'/>
                <p className='ml-1'>{tripInfo.pickupLocation}</p>
            </div>
            <div className='flex gap-2 border-1 border-[#8136E2] rounded-sm p-2 my-4 items-center'>
                <img src={assets.drop} alt='drop_location' />
                <p className='ml-1'>{tripInfo.dropoffLocation}</p>
            </div>
            <div className='flex gap-2 border-1 border-[#8136E2] rounded-sm p-2 items-center mb-4'>
                <FaRupeeSign />
                <span>{tripInfo.price}</span>
            </div>

            <div className='flex justify-center my-6'>
                <button className='py-2 px-4 bg-red-600 font-semibold text-lg rounded-md cursor-pointer'
                    onClick={handleCancelRide}
                >Cancel Ride</button>
            </div>
        </main>
    </section>
  )
}

export default LookingForCaptain