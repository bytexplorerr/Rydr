import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const CaptainResetPassword = () => {

    const newPassword = useRef(null);
    const confirmPassword = useRef(null);

    const navigate = useNavigate();
    const  location = useLocation();

    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("verificationToken");

    useEffect(()=>{

        const verifyUserToken = async ()=>{

            if(!token) {
                navigate("/");
            }

            try {

                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/verify-reset-token/${token}`);

                if(response.status !== 200) {
                    navigate("/");
                }

            } catch(err) {
                navigate("/");
            }
        }

        verifyUserToken();

    },[token,navigate]);

    const handleSubmit = async (event)=> {

        event.preventDefault();

        if(newPassword.current.value !== confirmPassword.current.value) {
            toast.error('Both Password should be same!');
            return;
        }
        
        try {

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/reset-password`,{
                token,
                newPassword:newPassword.current.value
            });

            if(response.status === 200) {
                toast.success('Password Changed Succesfully! Please Login.');

                newPassword.current.value = '';
                confirmPassword.current.value = '';

                queryParams.delete("verificationToken");
                navigate({ pathname: "/captain-login", search: queryParams.toString() }, { replace: true }); 
            } else {
                toast.error('Error in changing the password!');
            }

        } catch(err) {
            toast.error('Error in changing the password!');
        }
    }

    return (
        <section className='my-16 mx-2 flex justify-center p-4 max-[500px]:p-0 max-[500px]:bg-none' style={{backgroundImage:`url(${assets.map_bg_image})`}}>
            <div className='w-[500px] border-2 border-black p-4 bg-gray-900 rounded-2xl px-8 max-[500px]:w-full max-[500px]:p-2 shadow-2xl'>
                <h1 className='text-center text-3xl font-semibold'>Reset Password</h1>
                <form className='mt-4' onSubmit={handleSubmit}>
                    <h3 className='text-lg after:ml-0.5 after:text-red-500 after:content-["*"]'>New Password</h3>
                    
                    <span className='relative'>
                        <input 
                            type = {showPassword?"text":"password"}
                            placeholder='password' 
                            required 
                            className='mt-2 text-white border-1 border-white outline-0 w-[400px] p-2 rounded-lg focus:border-[#8136E2] max-[500px]:w-8/9' 
                            ref={newPassword} 
                        />

                        <span className='absolute right-2 bottom-0.5 cursor-pointer' onClick={()=>setShowPassword(!showPassword)}>
                            {showPassword?<FaEyeSlash />:<FaEye />}
                        </span>
                    </span>

                    <h3 className='mt-4 text-lg after:ml-0.5 after:text-red-500 after:content-["*"]'>Confirm Password</h3>
                    <span className='relative'>
                        <input 
                            type = {showConfirmPassword?"text":"password"}
                            placeholder='password' 
                            required 
                            className='mt-2 text-white border-1 border-white outline-0 w-[400px] p-2 rounded-lg focus:border-[#8136E2] max-[500px]:w-8/9' 
                            ref={confirmPassword} 
                        />

                        <span className='absolute right-2 bottom-0.5 cursor-pointer' onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword?<FaEyeSlash />:<FaEye />}
                        </span>
                    </span>

                    <p className='flex justify-center mt-8'>
                        <button className='font-semibold text-lg block px-16 py-1.5 rounded-xl bg-[#8136E2] cursor-pointer'>Change Password</button>
                    </p>
                </form>
    
                <p className='flex items-center my-3 justify-center text-sm'>
                    Already have an Account? <Link to="/login" className='ml-1 text-nowrap text-[#8136E2] font-semibold'>Login</Link>
                </p>
    
            </div>
        </section>
    )
}

export default CaptainResetPassword
