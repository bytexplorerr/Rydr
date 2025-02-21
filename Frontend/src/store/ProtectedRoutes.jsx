import React, { useContext } from 'react'
import { UserDataContext } from './UserContext'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoutes = () => {

  const {userToken,setSelectedNavbarItem,setUserToken,setRole,setUserName,role,loading} = useContext(UserDataContext);
  const location = useLocation();

  if(loading) {
    return <div>Loading...</div>
  }

  if(!userToken) {
    setUserToken(null);
    setRole(null);
    setUserName(null);
    setSelectedNavbarItem('');

    // If they are trying to access the '/drive' page, redirect to '/captain-login'
    if (location.pathname.startsWith('/drive')) {
      return <Navigate to="/captain-login" />;
    }

    // Otherwise, redirect them to the general login page
    return <Navigate to="/login" />;

  }

  return <Outlet />;

}

export default ProtectedRoutes