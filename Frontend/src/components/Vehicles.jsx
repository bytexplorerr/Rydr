import React, { useContext, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { FaRupeeSign } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { FaCircle } from "react-icons/fa6";
import ConfirmRide from './ConfirmRide';
import { TripInfoContext } from '../store/TripContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Vehicles = () => {

    const confirmRideRef = useRef(null);
    const selectVehicleRef = useRef(null);

    const {pickupLocation,dropoffLocation,setShowVehicles,setTripInfo,tripInfo} = useContext(TripInfoContext);

    const handleSelectVehicle = async (vehicleImg,vehicleType) =>{

        const token = document.cookie.split('; ').find((row)=>row.startsWith('token=')).split('=')[1];
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare?pickup=${pickupLocation}&drop=${dropoffLocation}`,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
            withCredentials:true
        });

        if(response.status !== 200) {
            toast.error('Unable to find the price of the trip, Try Again!');
            return;
        }

        const price = response.data[vehicleType];
        setTripInfo({
            pickupLocation,
            dropoffLocation,
            vehicle:vehicleImg,
            price,
            vehicleType
        });

        setTimeout(()=>{
            confirmRideRef.current?.scrollIntoView({behavior:'smooth',block:'start'})
        },100); // Adding a slight delay for smooth UX
    }

  return (
    <div className='my-16' ref={selectVehicleRef}>
        <h1 className='text-4xl font-semibold text-center max-[450px]:text-3xl'>Choose a Vehicle</h1>
        <main className='grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] max-[401px]:grid-cols-1 gap-x-2 gap-y-4 mt-8'>
            <aside 
                className='py-2 px-4 bg-gray-950 inline-block rounded-2xl shadow-sm shadow-gray-200 m-2 justify-center cursor-pointer'
                onClick={()=>handleSelectVehicle(assets.car,'car')}
                >
                <div className='flex justify-center my-2'>
                    <img src={assets.car} alt = "car_image"  
                        width="80px" height="80px"
                    />
                </div>
                <div className='mb-2'>
                    <p className='flex gap-2 items-center justify-center'><span className='font-semibold text-xl'>RydrGo</span> 
                        <span className='flex items-center'><IoPersonSharp className='mr-0.5'/>4</span>
                    </p>
                    <p className='flex items-center text-md font-light justify-center my-0.5'>
                        <span className='mr-0.5'>2 </span> mins away 
                        <FaCircle className='w-[5px] mx-1'/>
                        <span>15:34</span>
                    </p>
                    <p className='font-extralight text-sm text-center my-0.5'>Affordable, compact rides</p>
                </div>

            </aside>

            <aside 
                className='py-2 px-4 bg-gray-950 inline-block rounded-2xl shadow-sm shadow-gray-200 m-2 justify-center cursor-pointer'
                onClick={()=>handleSelectVehicle(assets.bike,'motorcycle')}
            >
                <div className='flex justify-center my-2'>
                    <img src={assets.bike} alt = "bike_image"  
                        width="80px" height="80px"
                    />
                </div>
                <div className='mb-2'>
                    <p className='flex gap-2 items-center justify-center'><span className='font-semibold text-xl'>Moto</span> 
                        <span className='flex items-center'><IoPersonSharp className='mr-0.5'/>1</span>
                    </p>
                    <p className='flex items-center text-md font-light justify-center my-0.5'>
                        <span className='mr-0.5'>2 </span> mins away 
                        <FaCircle className='w-[5px] mx-1'/>
                        <span>15:34</span>
                    </p>
                    <p className='font-extralight text-sm text-center my-0.5'>Affordable, motorcycle rides</p>
                </div>
                
            </aside>

            <aside 
                className='py-2 px-4 bg-gray-950 inline-block rounded-2xl shadow-sm shadow-gray-200 m-2 justify-center cursor-pointer'
                onClick={()=>handleSelectVehicle(assets.auto,'auto')}
            >
                <div className='flex justify-center mt-[-10px]'>
                    <img src={assets.auto} alt = "auto_image"  
                        width="80px" height="80px"
                    />
                </div>
                <div className='mb-2'>
                    <p className='flex gap-2 items-center justify-center'><span className='font-semibold text-xl'>RydrAuto</span> 
                        <span className='flex items-center'><IoPersonSharp className='mr-0.5'/>3</span>
                    </p>
                    <p className='flex items-center text-md font-light justify-center my-0.5'>
                        <span className='mr-0.5'>2 </span> mins away 
                        <FaCircle className='w-[5px] mx-1'/>
                        <span>15:34</span>
                    </p>
                    <p className='font-extralight text-sm text-center my-0.5'>Affordable, auto rides</p>
                </div>
                
            </aside>
        </main>


        <div ref={confirmRideRef}>
            {tripInfo &&  <ConfirmRide />}
        </div>

    </div>
  )
}

export default Vehicles
