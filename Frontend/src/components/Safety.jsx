import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Safety = () => {
  return (
    <section className='flex justify-center gap-2 max-md:flex-col my-12'>
        <div className='w-[35%] max-md:w-full'>
            <h1 className='text-4xl font-semibold text-center my-3'>Safety For All</h1>
            <p className='font-lighter mt-2 mx-2'>At Rydr, the well-being of our customer is above everything else. We are
                constantly in pursuit of enhancing our safety measures to ensure every Rydr ride is a pleasant and comfortable experience.
            </p>
            <Link to="/" className='inline-block bg-[#8136E2] py-2 px-3 mt-6 ml-4 rounded-2xl font-semibold'>Know More</Link>
        </div>
        <img src={assets.safety} alt='Saftetu Image' className='w-[60%] rounded-2xl max-md:w-[90%] max-md:m-auto max-md:my-6 shadow-sm shadow-gray-200'/>
    </section>
  )
}

export default Safety