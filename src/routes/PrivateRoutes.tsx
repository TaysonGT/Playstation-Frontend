import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const PrivateRoutes = () => {
  const location = useLocation()
  const {currentUser} = useAuth()
  
  return (
    currentUser? 
    <div className='flex flex-col h-screen overflow-hidden'> 
      <Navbar /> 
      <div className='grow min-h-0'>
        <Outlet /> 
      </div>
    </div> 
    : <Navigate to='/login' replace state={{from: location}} />
  )
}
export default PrivateRoutes