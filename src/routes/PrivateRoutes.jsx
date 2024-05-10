import React, { useEffect } from 'react'
import eruda from 'eruda';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';

const PrivateRoutes = () => {
  const location = useLocation()
  const token = Cookies.get('access_token')
  
  
  useEffect(() => {
    eruda.init()
  }, [])

  return (
    token? 
    <> 
      <Navbar token={token} /> 
      <Outlet /> 
    </> 
    : <Navigate to='/login' replace state={{from: location}} />
  )
}
export default PrivateRoutes