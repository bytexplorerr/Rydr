import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
const Header = () => {
  return (
    <header className="my-4 h-[500px] relative">
        <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${assets.map_image})` }}
        ></div>
        <div className="absolute top-10 left-20 flex justify-between max-lg:left-8 max-md:h-full max-md:items-center max-md:top-0 max-md:left-4 max-md:justify-start">
            <div className='w-1/4 max-md:w-1/2'>
                <h1 className='text-4xl font-bold'>Fast. Safe. Reliable. Ride with Rydr!</h1>
                <p className='mt-8 max-sm:mt-5 text-sm font-light'>Experience comfort, safety, and convenience with Rydr – your trusted ride partner for every journey.</p>
                <Link to = "/" className='flex mt-8 bg-[#8136E2] w-[120px] mx-2 mb-2 justify-center p-2 rounded-2xl font-semibold'>Get Started</Link>
            </div>
            <img src = {assets.header_image} loading='lazy' width="500px" className='mr-10 max-lg:mr-3 max-md:hidden'/> 
        </div>
    </header>

  )
}

export default Header