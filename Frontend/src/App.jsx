import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';  // Importing GoogleOAuthProvider
import Navbar from './pages/Navbar'
import Footer from './pages/Footer'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import UserLogin from './pages/UserLogin'
import CaptainLogin from './pages/CaptainLogin'
import UserSignup from './pages/UserSignup'
import CaptainSignup from './pages/CaptainSignup'
import { ToastContainer } from 'react-toastify';
import Profile from './pages/Profile'
import Ride from './pages/Ride'
import Drive from './pages/Drive'
import ProtectedRoutes from "./store/ProtectedRoutes"
import UserForgotPassword from './pages/UserForgotPassword'
import CaptainForgotPassword from './pages/CaptainForgotPassword'
import UserResetPassword from './pages/UserResetPassword'
import CaptainResetPassword from './pages/CaptainResetPassword'

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>  {/* Wrap your app with GoogleOAuthProvider */}
      <div className='text-white bg-black w-screen'>
        <div className='pt-3 w-6/7 m-auto max-lg:w-screen max-lg:px-3'>
            <ToastContainer />
            <Navbar />
            <Routes>
              <Route path='/' element={<Home/>}></Route>
              <Route path='/login' element={<UserLogin/>}></Route>
              <Route path='/captain-login' element={<CaptainLogin />}></Route>
              <Route path='/signup' element={<UserSignup />}></Route>
              <Route path='/captain-signup' element={<CaptainSignup />}></Route>
              <Route element={<ProtectedRoutes />}>
                <Route path='/ride' element={<Ride />}></Route>
                <Route path='/drive' element={<Drive />}></Route>
              </Route>
              <Route path='/forgot-password' element={<UserForgotPassword />}></Route>
              <Route path='/reset-password' element={<UserResetPassword />}></Route>
              <Route path='/captain-forgot-password' element={<CaptainForgotPassword />}></Route>
              <Route path='/captain-reset-password' element={<CaptainResetPassword />}></Route>
              <Route path='/*' element={<Home />}></Route>
            </Routes>
            <Footer />
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
