import React, { useContext, useEffect, useRef, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { TripInfoContext } from '../store/TripContext';
import { IoMdSend } from "react-icons/io";
import { SocketContext } from '../store/SocketContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UserDataContext } from '../store/UserContext';

const Chats = () => {

    const {setShowChats,tripInfo} = useContext(TripInfoContext);
    const {role} = useContext(UserDataContext);
    const [messageText,setMessageText] = useState('');
    const messageRef = useRef(null);
    const scrollToBottomRef = useRef(null); 

    const {messages,setMessages} = useContext(SocketContext);

    const handleInput = (event)=>{
        setMessageText(event.target.value.trim());
    }

    // Auto-scroll to the latest message when messages update
    useEffect(() => {
        scrollToBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleMessage = async ()=>{
        try {
            if(messageText.length === 0) return;

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/chats`,{
                tripInfo,
                role,
                data:messageText,
            },{
                withCredentials:true
            });
            if(response.status === 200) {
                setMessages((prevMessages)=> [...prevMessages,{data:messageText,role}]);
                messageRef.current.value = ''; // clear the input field.
                setMessageText('');
            } else {
                toast.error('Error in sending the message, try again!');
            }
        } catch(err) {
            toast.error('Error in sending the message, try again!');
        }
    }

  return (
    <section className='px-3 py-4 relative h-full w-full flex flex-col'>
        <div className='flex items-center border-b border-b-gray-100 py-4'>
            <RxCross2  size={24} className='cursor-pointer' onClick={()=>setShowChats(false)}/>
            <h1 className='text-3xl m-auto font-semibold'>Chats</h1>
        </div>

        <main className='my-12 flex-1 overflow-y-auto'>
            {messages.map((message,index)=>(
                <div key={index} className={`my-6 flex ${message.role === role ? 'justify-end' : 'justify-start'}`}>
                    <p className={`max-w-[80%] text-white rounded-md shadow-sm shadow-gray-100 p-2 ${message.role == role ? 'bg-[#8136E2]' : 'bg-gray-800'}`}>
                        {message.data}
                    </p>
                </div>
            ))}

            {/* Invisible div to auto-scroll to last message */}
            <div ref={scrollToBottomRef} />

        </main>

        <div className='absolute bottom-5 flex items-center  gap-2 justify-center w-full'>
            <input 
                type='text'
                placeholder='Message'
                ref={messageRef}
                onChange={handleInput}
                className='w-[85%] bg-gray-800 py-1 px-2 outline-0 border-2 focus:border-2 focus:border-[#8136E2] rounded-md'/>
            <span className={`cursor-pointer p-2 rounded-full ${messageText.length > 0 ? 'bg-[#8136E2]' : 'bg-gray-800'}`} onClick={handleMessage}>
                <IoMdSend size={24} 
                />
            </span>
        </div>
    </section>
  )
}

export default Chats
