import React, { createContext, useContext, useEffect, useState } from 'react'

export const UserDataContext = createContext();

const UserContext = ({children}) => {

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const Role = localStorage.getItem('role');

    const [userToken,setUserToken] = useState(token);
    const [role,setRole] = useState(Role);
    const [userName,setUserName] = useState(username);
    
    const [selectedNavbarItem,setSelectedNavbarItem] = useState('');
    const [dropDown,setDropDown] = useState(false);

  return (
    <>
        <UserDataContext.Provider value={{userToken,setUserToken,role,setRole,selectedNavbarItem,setSelectedNavbarItem,dropDown,setDropDown,userName,setUserName}}>
            {children}
        </UserDataContext.Provider>
    </>
  )
}

export default UserContext