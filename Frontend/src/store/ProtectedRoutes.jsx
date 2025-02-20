import React, { useContext } from 'react'
import { UserDataContext } from './UserContext'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {

  const {userToken,setSelectedNavbarItem,setUserToken,setRole,setUserName} = useContext(UserDataContext);

  const token = document.cookie.split('; ').find((row)=>row.startsWith('token='))?.split('=')[1];

  if(!token) {
    setUserToken(null);
    setRole(null);
    setUserName(null);
    setSelectedNavbarItem('');
    return <Navigate to="/login" />;
  }

  return <Outlet />;

}

export default ProtectedRoutes