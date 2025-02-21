import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios';

export const UserDataContext = createContext();

const UserContext = ({children}) => {

    const [userToken,setUserToken] = useState(null);
    const [role,setRole] = useState(null);
    const [userName,setUserName] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [selectedNavbarItem,setSelectedNavbarItem] = useState('');
    const [dropDown,setDropDown] = useState(false);

    const verify = async () => {
      try {
          // Fetch user profile
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/user-profile`, {
              withCredentials: true,
          });

          if (response.status === 200) {
              setRole('user');
              setUserName(response.data.user.fullName.firstName);
              setUserToken(response.data.token);
              return;
          }
      } catch (err) {
          console.log("User profile not found, checking captain profile...");
      }

      try {
          // Fetch captain profile
          const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/captain-profile`, {
              withCredentials: true
          });
          
          if (res.status === 200) {
              setRole('captain');
              setUserName(res.data.captain.fullName.firstName);
              setUserToken(res.data.token);
              return;
          }
      } catch (err) {
          console.log("Captain profile not found, user is not logged in.");
      }

      // If both requests fail, reset state
      setRole(null);
      setUserName(null);
      setUserToken(null);
  };

  useEffect(() => {
      const fetchUserData = async ()=>{
        await verify();
        setLoading(false);
      }
      fetchUserData();
  }, []);

  return (
    <>
        <UserDataContext.Provider value={{userToken,setUserToken,role,setRole,selectedNavbarItem,setSelectedNavbarItem,dropDown,setDropDown,userName,setUserName,loading}}>
            {children}
        </UserDataContext.Provider>
    </>
  )
}

export default UserContext