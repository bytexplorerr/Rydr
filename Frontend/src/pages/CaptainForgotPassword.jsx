import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UserDataContext } from '../store/UserContext';

const CaptainForgotPassword = () => {

    const email = useRef(null);
    const {setUserName,setUserToken,setRole,setDropDown,userToken} = useContext(UserDataContext);
    const navigate = useNavigate();

    const handleSubmit = async(event) => {

        event.preventDefault();

        try {

            if(userToken) {
                const url = `${import.meta.env.VITE_BASE_URL}/captains/logout`;

                const logoutRes = await axios.post(url,{},{
                    headers:{"Content-Type":"application/json"},
                    withCredentials:true
                });

                if(logoutRes.status !== 200) {
                    return;
                }
            }

            if(localStorage.getItem('token')) {
                localStorage.removeItem('token');
            }

            if(localStorage.getItem('username')) {
                localStorage.removeItem('username');
            }

            if(localStorage.getItem('role')) {
                localStorage.removeItem('role');
            }

            setUserName(null);
            setRole(null);
            setUserToken(null);
            setDropDown(false);

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/forgot-password`,{
                emailId:email.current.value
            },{
                headers:{"Content-Type":"application/json"},
                withCredentials:true
            });

            if(response.status === 200) {
                toast.success('Email Sent Sucessfullty, Please check your mail');
                email.current.value = '';
            } else {
                toast.error('Error in sending reset mail, Please Try Again!');
            }
        } catch(err) {
            toast.error('User Not Found!');
        }
    }

  return (
    <section className='my-16 mx-2 flex justify-center p-4 max-[500px]:p-0 max-[500px]:bg-none' style={{backgroundImage:`url(${assets.map_bg_image})`}}>
        <div className='w-[500px] border-2 border-black p-4 bg-gray-900 rounded-2xl px-8 max-[500px]:w-full max-[500px]:p-2 shadow-2xl'>
            <h1 className='text-center text-3xl font-semibold'>Forgot Password</h1>
            <form className='mt-4' onSubmit={handleSubmit}>
                <h3 className='text-lg after:ml-0.5 after:text-red-500 after:content-["*"]'>Email</h3>
                <input 
                    type = "email" 
                    placeholder='user@example.com' 
                    required 
                    className='mt-2 text-white border-1 border-white outline-0 w-[400px] p-2 rounded-lg focus:border-[#8136E2] max-[500px]:w-8/9' 
                    ref={email}
                />
                <p className='flex justify-center mt-8'>
                    <button className='font-semibold text-lg block px-16 py-1.5 rounded-xl bg-[#8136E2] cursor-pointer'>Send Email</button>
                </p>
            </form>

            <p className='flex items-center my-3 justify-center text-sm'>
                Already have an Account? <Link to="/captain-login" className='ml-1 text-nowrap text-[#8136E2] font-semibold'>Login</Link>
            </p>

        </div>
    </section>
  )
}

export default CaptainForgotPassword