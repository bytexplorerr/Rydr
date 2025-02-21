import React, { useState , useEffect, useContext } from 'react'
import {assets} from "../assets/assets" 
import { Link, useNavigate } from 'react-router-dom'
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import axios from "axios"
import { UserDataContext } from '../store/UserContext';

const Navbar = () => {

    const [showNavbar,setShowNavbar] = useState(false); 

    const {userToken,userName,role,setUserToken,setUserName,setRole,selectedNavbarItem,setSelectedNavbarItem,dropDown,setDropDown} = useContext(UserDataContext);

    const navigate = useNavigate();

    // Function to handle window resize
    const handleResize = () => {
        if (window.innerWidth > 768) { // Close menu if screen width is greater than 768px (md breakpoint)
            setShowNavbar(false);
        }
    };

    // Listen for window resize events
    useEffect(() => {
        window.addEventListener("resize", handleResize);

        // the main purpose of removing the event listener is that, when window re-renders then if we are not removing it then each time when component re-renders 
        // then new event listener will be added which leads to memory leaks. so, to deal with this situation...
        // this function works when window re-renders 

        // Cleanup function: Remove event listener when component unmounts

        /*

        In React, unmounting means that a component is removed from the DOM (Document Object Model). This happens when:

        *The component is no longer needed.
        *The user navigates to a different page.
        *The parent component removes the child component.
        
        When a component unmounts, React destroys it, meaning:
        *The component's state and event listeners are removed.
        *The component stops rendering.
        *The useEffect cleanup function (if present) runs before the component is destroyed.

        */
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleOnClick = (item)=>{
        setSelectedNavbarItem(item);
    }

    const handleOnClickOnMobile = (item)=>{
        setShowNavbar(false);
        setSelectedNavbarItem(item);
    }

    const handleLogout = async ()=>{

        try{

            let url;
            if(role === "user") {
                url = `${import.meta.env.VITE_BASE_URL}/users/logout`;
            } else {
                url = `${import.meta.env.VITE_BASE_URL}/captains/logout`
            }

            const response = await axios.post(url,{},{
                withCredentials: true
            });

           if(response.status === 200){
            setDropDown(false);
            toast.success('Logout Successfully!');

            setUserName(null);
            setUserToken(null);
            setRole(null);
            setShowNavbar(false);

            setSelectedNavbarItem("Home");
            navigate("/");
           } else {
            console.log(response.data.message);
            toast.error('Somthing went wrong, Try Adain!');
           }

        } catch(err) {
            toast.error('Somthing went wrong, Try Adain!');
        }

    };

    const getProfile = ()=>{
        setDropDown(false);
        setShowNavbar(false);
        setSelectedNavbarItem('');
        navigate("/profile");
    }


  return (
    <nav className='flex items-center justify-between font-semibold text-lg relative'>
        <div onClick={()=>setSelectedNavbarItem("Home")}>
            <Link to = "/">
                <img src = {assets.logo} width="110px" height = "110px" alt = "logo"/>
            </Link>
        </div>

        <div className='hidden max-md:block cursor-pointer z-20' onClick={() => setShowNavbar(prev => !prev)}>
            {showNavbar ? <IoMdClose className='w-[30px] h-[30px]' /> : <FaBars className='w-[30px] h-[30px]' />}
        </div>


        {/* Desktop Navigation */}
        <div className='flex text-xl max-md:hidden max-lg:flex gap-10'>
            <Link to="/" onClick={()=>handleOnClick("Home")}
            className={`${selectedNavbarItem==="Home"?"underline":"no-underline"} underline-offset-4 decoration-[#8136E2]`}
            >Home</Link>
            <Link to="/ride" onClick={()=>handleOnClick("Ride")}
            className={`${selectedNavbarItem==="Ride"?"underline":"no-underline"} underline-offset-4 decoration-[#8136E2]`}
            >Ride</Link>
            <Link to="/drive" onClick={()=>handleOnClick("Drive")}
            className={`${selectedNavbarItem==="Drive"?"underline":"no-underline"} underline-offset-4 decoration-[#8136E2]`}
            >Drive</Link>
            <Link to="/about" onClick={()=>handleOnClick("About")}
            className={`${selectedNavbarItem==="About"?"underline":"no-underline"} underline-offset-4 decoration-[#8136E2]`}
            >About</Link>
            <Link to="/contact-us" onClick={()=>handleOnClick("Contact US")}
            className={`${selectedNavbarItem==="Contact US"?"underline":"no-underline"} underline-offset-4 decoration-[#8136E2]`}
            >Contact Us</Link>
        </div>

        {/* Mobile Menu - Covers Half the Page */}
        <div className={`fixed top-0 right-0 h-full w-1/2 bg-[#8136E2] shadow-lg transition-transform duration-300 ${showNavbar ? "translate-x-0" : "translate-x-full"} max-md:z-10`}>
            <div className={`flex flex-col items-center gap-6 pt-10`}>
                <Link to="/" onClick={()=>handleOnClickOnMobile("Home")}
                className={`${selectedNavbarItem==="Home"?"underline":"no-underline"} underline-offset-4`}
                >Home</Link>
                <Link to="/ride" onClick={()=>handleOnClickOnMobile("Ride")}
                className={`${selectedNavbarItem==="Ride"?"underline":"no-underline"} underline-offset-4`}
                >Ride</Link>
                <Link to="/drive" onClick={()=>handleOnClickOnMobile("Drive")}
                className={`${selectedNavbarItem==="Drive"?"underline":"no-underline"} underline-offset-4`}
                >Drive</Link>
                <Link to="/about" onClick={()=>handleOnClickOnMobile("About")}
                className={`${selectedNavbarItem==="About"?"underline":"no-underline"} underline-offset-4`}
                >About</Link>
                <Link to="/contact-us" onClick={()=>handleOnClickOnMobile("Contact Us")}
                className={`${selectedNavbarItem==="Contact Us"?"underline":"no-underline"} underline-offset-4`}
                >Contact Us</Link>
                
                {!userToken && <Link to = "/login" onClick={()=>handleOnClickOnMobile("")} 
                            className='bg-black w-[100px] h-[40px] flex justify-center items-center rounded-2xl cursor-pointer'>
                                Login
                            </Link>
                }

                {userToken && <div className='flex items-center py-1 px-1.5 bg-black rounded-md cursor-pointer' onClick={()=>{setDropDown(prev => !prev)}}>
                                <p className='mr-1'>{userName}</p> 
                                <IoIosArrowDown />
                            </div>
                }

                {dropDown && <div className='mt-[-20px] bg-gray-900 py-4 px-3 rounded-xl cursor-pointer *:cursor-pointer *:hover:bg-[#8136E2] *:rounded-sm z-20 md:hidden'>
                            <aside className='flex gap-x-3 gap-y-4 items-center' onClick={getProfile}>
                                <FaUserCircle />
                                <p>Profile</p>
                            </aside>
                            <p className='border-1 border-[#8136E2] my-2'></p>
                            <aside className='flex gap-x-3 gap-y-4 items-center' onClick={handleLogout}>
                                <IoLogOutOutline />
                                <p>Logout</p>
                            </aside>
                        </div>
                }


            </div>
        </div>

        <div className='bg-[#8136E2] rounded-lg max-md:hidden cursor-pointer'>
            {
                !userToken && <Link to="/login" className='inline-block py-2 px-3 cursor-pointer' onClick={()=>setSelectedNavbarItem("")}>Login</Link>
            }

            {
                userToken && <div className='flex items-center py-1 px-1.5' onClick={()=>{setDropDown(prev => !prev)}}>
                                <p className='mr-1'>{userName}</p> 
                                <IoIosArrowDown />
                            </div>
            }
        </div>

        {
            dropDown && <div className='absolute right-0 top-12 bg-gray-900 py-4 px-3 rounded-xl cursor-pointer *:cursor-pointer *:hover:bg-[#8136E2] *:rounded-sm z-20 max-md:hidden'>
                        <aside className='flex gap-x-3 gap-y-4 items-center' onClick={getProfile}>
                            <FaUserCircle />
                            <p>Profile</p>
                        </aside>
                        <p className='border-1 border-[#8136E2] my-2'></p>
                        <aside className='flex gap-x-3 gap-y-4 items-center' onClick={handleLogout}>
                            <IoLogOutOutline />
                            <p>Logout</p>
                        </aside>
                    </div>
        }
    </nav>
  )
}

export default Navbar