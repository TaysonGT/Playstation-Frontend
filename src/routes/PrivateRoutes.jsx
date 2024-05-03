import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';

const PrivateRoutes = () => {
  let token = useState(Cookies.get("access_token"))

  return (
    token? <><Navbar token={token} /><Outlet /></> : <Navigate to='/auth/login' />
  )
}
export default PrivateRoutes