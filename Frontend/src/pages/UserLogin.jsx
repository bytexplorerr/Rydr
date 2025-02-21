import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { UserDataContext } from '../store/UserContext'
import { GoogleLogin } from '@react-oauth/google';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const UserLogin = () => {

    const email = useRef(null);
    const password = useRef(null);

    const {setUserToken,setRole,setUserName,setSelectedNavbarItem} = useContext(UserDataContext);
    const [showPassword,setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleSubmit = async (event)=>{

        event.preventDefault();
        
        const user = {
            email:email.current.value,
            password:password.current.value
        };

        try{

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`,user,{
                headers: { "Content-Type": "application/json" },
                withCredentials:true,
            });

            if(response.status === 200){
                toast.success('Login Successfully!');

                setUserToken(response.data.token);
                setUserName(response.data.user.fullName.firstName);
                setRole('user');

                email.current.value = '';
                password.current.value = '';

                setSelectedNavbarItem("Ride");
                navigate('/ride');
                
            } else {
                toast.error(response.data.message);
            }
        } catch(err){
            toast.error('User Not Found!'); 
        }
    }

    useEffect(()=>{

        let isMounted = true; // Prevents state updates after unmount

        const verifyToken = async ()=>{
            const queryParams = new URLSearchParams(location.search);
            const token = queryParams.get("verificationToken");

            if(!token) return;

            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/verify-token/${token}`,{
                    withCredentials:true,
                });
    
                if(response.status === 200 && isMounted) {
                    toast.success('Email Verified Succesfully! Please Log in.');

                    // Remove the token from the URL after successful verification
                    queryParams.delete("verificationToken");
                    navigate({ pathname: "/login", search: queryParams.toString() }, { replace: true });
                } else if(isMounted) {
                    toast.error('Verification failed, please try again.');
                }
            } catch(err){
                if(isMounted) {
                    toast.error('Error in verifying the user, Please Try Again!');
                }
            }
        }

        verifyToken();

        return () =>  {
            isMounted = false;
        }

    },[location.search,navigate]);

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
        <div className='w-[500px] border-2 border-black p-4 bg-gray-900 rounded-2xl px-8 max-[500px]:w-full max-[500px]:p-2 shadow-2xl'>
            <h1 className='text-center text-3xl font-semibold'>Sign in</h1>
            <form className='mt-4' onSubmit={handleSubmit}>
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
                    <button className='font-semibold text-lg block px-16 py-1.5 rounded-xl bg-[#8136E2] cursor-pointer'>Login</button>
                </p>
            </form>

            <Link to="/forgot-password" className='underline text-sm flex justify-center my-2 hover:text-[#8136E2]'>Forgot Password ?</Link>

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


            <p className='text-center mt-6'>New here? <Link to="/signup" className='text-blue-500 text-nowrap'>Create new Account</Link></p> 
            <p className='mt-28 m-4 text-center'><Link to = "/captain-login" className='p-2 bg-green-400 rounded-xl text-lg font-semibold max-[300px]:text-sm'>Sign in as a Captain</Link></p>
        </div>
    </section>
  )
}

export default UserLogin