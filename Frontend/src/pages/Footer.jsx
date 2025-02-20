import React from 'react'
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className='bg-[#8136E2] py-2 mt-16'>
        
        <section className='grid grid-cols-3 text-sm p-2 max-sm:grid-cols-1 max-sm:gap-y-4 '>
            <div className='flex flex-col items-center'>
                <h2 className='text-2xl font-semibold mb-2'>Rydr</h2>
                <p>Your trusted partner in seamless and reliable rides. Safe, fast, and affordable travel at your fingertips.</p>
                <div className='flex justify-evenly w-full *:cursor-pointer *:hover:bg-black my-3 *:bg-gray-800'>
                    <span className='p-1 inline-block rounded-xl' onClick={()=>window.open('https://www.instagram.com/','_blank')}>
                        <FaInstagram/>
                    </span>
                    <span className='p-1 inline-block rounded-xl' onClick={()=>window.open('https://www.facebook.com/','_blank')}>
                        <FaFacebookF/>
                    </span>

                    <span className='p-1 inline-block rounded-xl' onClick={()=>window.open('https://www.linkedin.com/','_blank')}>
                        <FaLinkedinIn/>
                    </span>
                    <span className='p-1 inline-block rounded-xl' onClick={()=>window.open('https://www.youtube.com/','_blank')}>
                        <FaYoutube/>
                    </span>
                </div>
            </div>

            <hr className='hidden mx-4 max-sm:block opacity-30'/>

            <div className='flex flex-col items-center gap-1'>
                <h2 className='text-2xl font-semibold mb-2'>Company</h2>
                <Link to = "/" className='hover:underline'>About US</Link>
                <Link to = "/" className='hover:underline'>Our offerings</Link>
                <Link to = "/" className='hover:underline'>Privacy Policy</Link>
                <Link to = "/" className='hover:underline'>Carrers</Link>
            </div>

            <hr className='hidden mx-4 max-sm:block opacity-30'/>

            <div className='flex flex-col items-center'>
                <h2 className='text-2xl font-semibold mb-2'>Get In Touch</h2>
                <p>+1-212-456-7890</p>
                <p>contact@rydr.com</p>
            </div>
        </section>

        <hr className='my-2 mx-4 opacity-40'/>
        <p className='text-center my-2 text-sm'>Copyright 2025 © - All Rights Reserved.</p>
    </footer>
  )
}

export default Footer