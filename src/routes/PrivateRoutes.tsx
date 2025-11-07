import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Sidebar from '../components/Sidebar';
import { useTranslation } from 'react-i18next';
import { getDirection } from '../i18n';

const PrivateRoutes = () => {
  const location = useLocation()
  const {currentUser, isLoading} = useAuth()
  const {i18n} = useTranslation()
  const currentDirection = getDirection(i18n.language)

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
      {currentUser.role==='admin'&&
        <Navbar /> 
      }
      <div className={`flex grow min-h-0 ${currentUser.role!='admin'&&(currentDirection==='rtl'?'pr-52':'pl-52')}`}>
        {currentUser.role!='admin'&&
          <Sidebar/>
        }
        <Outlet /> 
      </div>
    </div> 
    : <Navigate to='/login' replace state={{from: location}} />
  )
}
export default PrivateRoutes