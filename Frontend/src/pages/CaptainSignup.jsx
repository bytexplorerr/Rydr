import React, { useContext, useRef, useState } from 'react'
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const CaptainSignup = () => {

    const firstname = useRef(null);
    const lastname = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const VehicleType = useRef(null);
    const VehicleCapacity = useRef(null);
    const vehiclePlateNumber = useRef(null);
    const vehicleColor = useRef(null);

    const [showPassword,setShowPassword] = useState(false);

    const handleSubmit = async (event)=>{

        event.preventDefault();

        lastname.current.value = lastname.current.value || '';
        
        const newCaptain = {
            fullName:{
                firstName:firstname.current.value,
                lastName:lastname.current.value,
            },
            email:email.current.value,
            password:password.current.value,
            vehicle:{
                color:vehicleColor.current.value,
                plate:vehiclePlateNumber.current.value,
                capacity:VehicleCapacity.current.value,
                vehicleType:VehicleType.current.value
            }
        };  

        try {

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`,newCaptain,{
                headers:{"Content-Type":"application/json"},
                withCredentials:true
            });

            if(response.status === 201) {
                toast.success('Please Check your Email to confirm your Account!');

                firstname.current.value = '';
                lastname.current.value = '';
                email.current.value = '';
                password.current.value = '';
                VehicleCapacity.current.value = '';
                vehiclePlateNumber.current.value = '';
                vehicleColor.current.value = '';

            } else {
                toast.error('Something went wrong, Try Again!');
            }

        } catch(err) {
            console.log(err.message);
            toast.error('Something went wrong, Try Again!');
        }
    }

  return (
    <section className='my-16 mx-2 flex justify-center p-4 max-[500px]:p-0 max-[500px]:bg-none' style={{backgroundImage:`url(${assets.map_bg_image})`}}>
        <div className='w-[500px] border-2 border-black p-8 bg-gray-900 rounded-2xl px-8 max-[500px]:w-full max-[500px]:p-2 shadow-2xl'>
            <h1 className='text-center text-3xl font-semibold'>Captain Sign Up</h1>
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

                <div>
                    <h3 className='text-2xl font-semibold mt-8'>Vehicle Information</h3>
                    <div className='pl-3'>
                        <section className='flex justify-between max-[300px]:flex-col'>
                            <aside>
                                <h4 className='mt-4 text-lg after:ml-0.5 after:text-red-500 after:content-["*"]'>Type</h4>
                                <select ref={VehicleType} className='text-white bg-[#8136E2] mt-2 p-1 rounded-md outline-0'>
                                    <option value="motorcycle">Motorcycle</option>
                                    <option value="car">Car</option>
                                    <option value="auto">Auto</option>
                                </select>
                            </aside>
                            <aside>
                                <h4 className='mt-4 text-lg after:ml-0.5 after:text-red-500 after:content-["*"]'>Capaity</h4>
                                <input 
                                    type='number' 
                                    min="1" max="6" defaultValue="1"
                                    ref={VehicleCapacity}
                                    className='outline-0 border-1 border-white focus:border-[#8136E2] p-1 rounded-md mt-2'
                                />
                            </aside>
                        </section>

                        <section className='flex justify-between max-[500px]:flex-col'>
                            <aside>
                                <h4 className='mt-4 text-lg after:ml-0.5 after:text-red-500 after:content-["*"]'>Plate Number</h4>
                                <input type='text' required placeholder='MP 06 0001'
                                    ref={vehiclePlateNumber}
                                    className='outline-0 border-1 border-white focus:border-[#8136E2] p-2 rounded-md mt-2 max-[500px]:w-8/9'
                                />
                            </aside>
                            <aside>
                                <h4 className='mt-4 text-lg after:ml-0.5 after:text-red-500 after:content-["*"]'>Color</h4>
                                <input type='text' required placeholder='Black' 
                                    ref={vehicleColor}
                                    className='outline-0 border-1 border-white focus:border-[#8136E2] p-2 rounded-md mt-2 max-[500px]:w-8/9'
                                />
                            </aside>
                        </section>
                    </div>
                </div>

                <p className='flex justify-center mt-8'>
                    <button className='font-semibold text-lg block px-16 py-1.5 rounded-xl bg-[#8136E2] cursor-pointer'>Register</button>
                </p>
            </form>

            <p className='text-center mt-6'>Already have an Account? <Link to="/captain-login" className='text-blue-500 text-nowrap'>Sign in</Link></p> 
            <p className='mt-28 m-4 text-center'><Link to = "/signup" className='p-2 bg-amber-600 rounded-xl text-lg font-semibold max-[300px]:text-sm'>Sign up as a User</Link></p>
        </div>
    </section>
  )
}

export default CaptainSignup