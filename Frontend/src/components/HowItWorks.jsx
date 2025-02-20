import React from 'react'
import { FaHandPointUp } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { FaRegMap } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";

const HowItWorks = () => {
  return (
    <section className='my-8'>
        <h1 className='text-center text-3xl font-semibold'>How It Works</h1>
        <aside className='mt-8 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 *:flex *:flex-col *:items-center *:border-2 *:border-black *:rounded-2xl *:bg-gray-900 max-[540px]:grid-cols-1 *:shadow-sm *:shadow-gray-200'>
            <div>
                <span className='bg-[#8136E2] inline-block rounded-2xl m-2'><FaHandPointUp className='m-2'/></span>
                <h3 className='text-md font-medium'>Book in just 2 Taps</h3>
                <p className='text-sm font-light p-2'>Instantly book your ride with just two quick taps. Fast, easy, and hassle-free!</p>
            </div>
            <div>
                <span className='bg-[#8136E2] inline-block rounded-2xl m-2'><FaCar className='m-2'/></span>
                <h3 className='text-md font-medium'>Get a Driver</h3>
                <p className='text-sm font-light p-2'>A nearby professional driver will be assigned to you in seconds. Reliable and convenient!</p>
            </div>
            <div>
                <span className='bg-[#8136E2] inline-block rounded-2xl m-2'><FaRegMap className='m-2'/></span>
                <h3 className='text-md font-medium'>Track Your Driver</h3>
                <p className='text-sm font-light p-2'>Stay updated in real time as your driver approaches. No more guessing!</p>
            </div>
            <div>
                <span className='bg-[#8136E2] inline-block rounded-2xl m-2'><IoPersonSharp className='m-2'/></span>
                <h3 className='text-md font-medium'>Arrive Safely</h3>
                <p className='text-sm font-light p-2'>Enjoy a smooth and secure ride to your destination. Safety is our priority!</p>
            </div>
        </aside>
    </section>
  )
}

export default HowItWorks