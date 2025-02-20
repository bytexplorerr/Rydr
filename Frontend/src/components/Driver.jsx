import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Driver = () => {
  return (
    <section className='flex my-16 mx-2 gap-6 justify-center max-[880px]:flex-col max-[880px]:items-center max-[880px]:gap-y-8 items-center'>
        <img src = {assets.driver_image} alt = "Driver Image" width="500px" height="500px" className='max-[880px]:order-2 shadow-sm shadow-gray-200 rounded-2xl'/>
        <div className='w-[600px] max-[880px]:order-1 max-[800px]:justify-start max-[880px]:w-full'>
            <h1 className='text-4xl font-semibold max-[425px]:text-2xl'>Drive when you want, make what you need</h1>
            <p className='my-4 text-xl font-light max-[425px]:text-lg'>Make money on your schedule with rides both. At Rydr we are providing zero pressure rides, redeemable earings and insured rides to captains.</p>
            <div className='flex items-center mt-3 max-[360px]:flex-wrap'>
              <Link to = "/captain-signup" className='bg-[#8136E2] px-2 py-1 mx-2 rounded-2xl font-medium'>Get Started</Link>
              <span className='font-light text-xs'>Already have an account?</span>
              <Link to="/captain-login" className='text-sm font-lighter ml-2 underline text-[#8136E2] text-nowrap'>Sign in</Link>
            </div>
        </div>
    </section>
  )
}

export default Driver