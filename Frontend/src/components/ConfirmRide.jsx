import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets';
import { FaRupeeSign } from "react-icons/fa";
import { TripInfoContext } from '../store/TripContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ConfirmRide = () => {

    const {tripInfo,setShowVehicles,setSearchCaptain} = useContext(TripInfoContext);
    
    const confirmRide = async ()=>{

        try {
            const tripRequestInfo = {
                pickup:tripInfo.pickupLocation,
                drop:tripInfo.dropoffLocation,
                vehicleType:tripInfo.vehicleType
            }

            const token = document.cookie.split('; ').find((row)=>row.startsWith('token=')).split('=')[1];
    
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`,tripRequestInfo,{
                headers:{
                    Authorization:`Bearer ${token}`,
                },
                withCredentials:true,
            });
    
            if(response.status === 201) {
                toast.success('Ride Request Sent Sucessfully, Please wait for Captain!');
                setShowVehicles(false);
                setSearchCaptain(true);
            } else {
                toast.error('Error in creating a ride, Please try again!');
            }
        } catch(err) {
            toast.error('Error in creating a ride, Please try again!');
        }
    }

  return (
    <section className='flex justify-center'>
        <main className='bg-gray-950 w-[500px] my-16 shadow-sm shadow-gray-200 rounded-xl p-2 max-[501px]:w-full max-[501px]:mx-0.5'>
            <h1 className='text-3xl font-semibold text-center my-3'>Confirm Ride</h1>
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
            <div className='flex gap-2 border-1 border-[#8136E2] rounded-sm p-2 items-center'>
                <FaRupeeSign />
                <span>{tripInfo.price}</span>
            </div>
            <div className='flex justify-center my-6'>
                <button 
                    type='button' 
                    className='py-2 bg-[#8136E2] px-4 rounded-xl font-semibold cursor-pointer'
                    onClick={confirmRide}
                >Confirm</button>
            </div>
        </main>
    </section>
  )
}

export default ConfirmRide
