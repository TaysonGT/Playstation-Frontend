import React from 'react'
import { Navigate, Outlet, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../../components/Navbar';

const PrivateRoutes = () => {
  let token = Cookies.get('access_token')

  return (
    token? <><Navbar token={token} /><Outlet /></> : <Navigate to='/auth/login' />
  )
}
export default PrivateRoutes