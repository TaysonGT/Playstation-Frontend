import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';

const PrivateRoutes = () => {
  const location = useLocation()
  const token = Cookies.get('access_token')
  
  return (
    token? 
    <div className='flex flex-col h-screen overflow-hidden'> 
      <Navbar token={token} /> 
      <div className='grow min-h-0'>
        <Outlet /> 
      </div>
    </div> 
    : <Navigate to='/login' replace state={{from: location}} />
  )
}
export default PrivateRoutes