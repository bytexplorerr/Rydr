import React, { useContext, useRef, useState } from 'react'
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { UserDataContext } from '../store/UserContext';

const UserSignup = () => {

    const firstname = useRef(null);
    const lastname = useRef(null);
    const email = useRef(null);
    const password = useRef(null);

    const {setUserToken,setUserName,setRole} = useContext(UserDataContext);

    const [showPassword,setShowPassword] = useState(false);

    const navigate = useNavigate();
    
    const handleSubmit = async (event)=>{

        event.preventDefault();
        
        const newUser = {
            fullName:{
                firstName:firstname.current.value,
                lastName:lastname.current.value
            },
            email:email.current.value,
            password:password.current.value,
        };

        try
        {

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`,newUser,{
                headers: { "Content-Type": "application/json" },
                withCredentials:true,
            });

            if(response.status === 201){
                toast.success('Please Check your Email to confirm your Account!');

                firstname.current.value = '';
                lastname.current.value = '';
                email.current.value = '';
                password.current.value = '';

            } else {
                toast.error('Something went wrong, Try Again!');
            }
        } catch(err){
            toast.error('Something went wrong, Try Again!');
        }
    }

    const handleGoogleSuccess = async (response) => {
        try {
            const { credential } = response; // Fix: Correct property extraction

    
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/google-login`, 
                { credential },  // Fix: Sending correct credential key
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );
    
            if (res.status === 200) {
                toast.success("Login Successful!");
                
                setUserToken(res.data.token);
                setUserName(res.data.user.fullName.firstName);
                setRole("user");
                
                navigate("/ride");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Google Login Failed!");
        }
    };

    const handleGoogleFailure = (error) => {
        console.log("Google Sign-in failed", error);
        toast.error("Google Sign-in failed");
    };

  return (
    <section className='my-16 mx-2 flex justify-center p-4 max-[500px]:p-0 max-[500px]:bg-none' style={{backgroundImage:`url(${assets.map_bg_image})`}}>
        <div className='w-[500px] border-2 border-black p-8 bg-gray-900 rounded-2xl px-8 max-[500px]:w-full max-[500px]:p-2 shadow-2xl'>
            <h1 className='text-center text-3xl font-semibold'>Sign Up</h1>
            <form className='mt-10' onSubmit={handleSubmit}>

                <div className='flex justify-between my-4 max-[460px]:flex-col max-[460px]:gap-y-4'>
                    <div>
                        <h3 className='text-lg after:ml-0.5 after:text-red-500 after:content-["*"]'>Firstname</h3>
                        <input 
                            type = "text" 
                            ref={firstname}
                            placeholder='Raghav' 
                            required
                            className='mt-2 text-white border-1 border-white outline-0 w-[180px] p-2 rounded-lg focus:border-[#8136E2] max-[500px]:w-8/9'
                        />
                    </div>
                    <div>
                        <h3 className='text-lg'>Lastname</h3>
                            <input 
                                type = "text" 
                                ref={lastname}
                                placeholder='Thakkar' 
                                className='mt-2 text-white border-1 border-white outline-0 w-[180px] p-2 rounded-lg focus:border-[#8136E2] max-[500px]:w-8/9'
                            />
                    </div>
                </div>

                <h3 className='text-lg after:ml-0.5 after:text-red-500 after:content-["*"]'>Email</h3>
                <input 
                    type = "email" 
                    placeholder='user@example.com' 
                    required 
                    className='mt-2 text-white border-1 border-white outline-0 w-[400px] p-2 rounded-lg focus:border-[#8136E2] max-[500px]:w-8/9' 
                    ref={email}
                />

                <h3 className='mt-4 text-lg after:ml-0.5 after:text-red-500 after:content-["*"]'>Password</h3>
                <span className='relative'>
                    <input 
                        type = {showPassword?"text":"password"}
                        placeholder='password' 
                        required 
                        className='mt-2 text-white border-1 border-white outline-0 w-[400px] p-2 rounded-lg focus:border-[#8136E2] max-[500px]:w-8/9' 
                        ref={password} 
                    />

                    <span className='absolute right-2 bottom-0.5 cursor-pointer' onClick={()=>setShowPassword(!showPassword)}>
                        {showPassword?<FaEyeSlash />:<FaEye />}
                    </span>
                </span>

                <p className='flex justify-center mt-8'>
                    <button className='font-semibold text-lg block px-16 py-1.5 rounded-xl bg-[#8136E2] cursor-pointer'>Register</button>
                </p>
            </form>

            <div className='p-3 flex items-center mt-2'>
                <p className='h-0.5 w-1/2 border-1 border-white'></p>
                <span className='mx-1'>or</span>
                <p className='h-0.5 w-1/2 border-1 border-white'></p>
            </div>

            <div className='flex justify-center'>
                <GoogleLogin
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
                />
            </div>

            <p className='text-center mt-6'>Already have an Account? <Link to="/login" className='text-blue-500 text-nowrap'>Sign in</Link></p> 
            <p className='mt-28 m-4 text-center'><Link to = "/captain-signup" className='p-2 bg-green-400 rounded-xl text-lg font-semibold max-[300px]:text-sm'>Sign up as a Captain</Link></p>
        </div>
    </section>
  )
}

export default UserSignup