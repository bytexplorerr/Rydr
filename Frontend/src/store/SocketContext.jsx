import { createContext, useContext, useEffect, useState } from "react";
import io from 'socket.io-client';
import { UserDataContext } from "./UserContext";
import { assets } from "../assets/assets";
import TripContext, { TripInfoContext } from "./TripContext";

export const SocketContext = createContext({});

const socket = io(`${import.meta.env.VITE_BASE_URL}`);

const SocketProvider = ({children})=>{

    const [messages,setMessages] = useState([]);

    const {role} = useContext(UserDataContext);
    const {showChats} = useContext(TripInfoContext);

    const sendMessage = (eventName,message)=>{
        socket.emit(eventName,message);
    };

    const receiveMessage = (eventName,callback)=>{
        socket.off(eventName);
        socket.on(eventName,(data)=>{
            callback(data);
        });  
    }

    const removeMessage = (eventName, callback) => {
        socket.off(eventName, callback);
    };


    useEffect(()=>{

        if(role === null) return;

        let roleSent='user';
        if(role === 'captain') {
            roleSent = 'user';
        } else {
            roleSent = 'captain';
        }

        const handleNewChat = (data)=>{
            setMessages((prevMessages)=> [...prevMessages,{data,role:roleSent}]);

           if(!showChats) {
             // to notify the user about message when chat section is not opened.
             const audio = new Audio(assets.notification_sound);
             audio.play().catch((err)=> console.log('Error in playing the sound : ', err));
           }
        }

        receiveMessage('received-chat',handleNewChat);

        return ()=>{
            removeMessage('received-chat',handleNewChat);
        }
    },[role]);


    useEffect(()=>{
        //Basic Connection Logic
        socket.on('connect',()=>{
            console.log('Connected to sever!');
        });

        socket.on('disconnect',()=>{
            console.log('Disconnected from the server!');
        });

        return ()=>{
            socket.off('connect');
            socket.off('disconnect');
        }
        
    },[]);

    return (
        <SocketContext.Provider value={{sendMessage,receiveMessage,removeMessage,messages,setMessages}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;