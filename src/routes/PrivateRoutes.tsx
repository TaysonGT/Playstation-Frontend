import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const PrivateRoutes = () => {
  const location = useLocation()
  const {currentUser, isLoading} = useAuth()

  if(isLoading){
    return (
      <div className='h-screen w-screen flex flex-col gap-6 justify-center items-center'>
        <Loader size={60} thickness={10}/>
        <p className='text-xl'>Please wait...</p>
      </div>
    )
  }
  
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