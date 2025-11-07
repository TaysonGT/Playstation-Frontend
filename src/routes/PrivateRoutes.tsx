import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Sidebar from '../components/Sidebar';
import { useTranslation } from 'react-i18next';
import { getDirection } from '../i18n';

const PrivateRoutes = ({roles}:{roles:string[]}) => {
  const location = useLocation()
  const {currentUser, isLoading} = useAuth()
  const {i18n, t} = useTranslation()
  const currentDirection = getDirection(i18n.language)

  if(isLoading){
    return (
      <div className='h-screen w-screen flex flex-col gap-6 justify-center items-center'>
        <Loader size={60} thickness={10}/>
        <p className='text-xl'>{t('routing.pleaseWait')}...</p>
      </div>
    )
  }
  
  if(!currentUser) return <Navigate to='/login' replace state={{from: location}} />
  
  const isAuthorized = roles.includes(currentUser.role)

  if(!isAuthorized) return (
    <div className='w-screen h-screen flex flex-col justify-center items-center text-6xl text-red-500'>
      <h1 className='font-bold'>{t('routing.unauthorized')}!</h1>
      <p className='text-xl'>{t('routing.noAccess')}!</p>
      <Link to={'/'} className='text-base py-2 px-4 text-white bg-blue-500 font-semibold hover:bg-blue-300 duration-100 rounded-sm mt-6'>{t('routing.redirectHome')}</Link>
    </div>
  )

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <div className={`flex grow min-h-0 ${currentDirection==='rtl'?'pr-55':'pl-55'}`}>
        <Sidebar/>
        <Outlet /> 
      </div>
    </div>
  )
}
export default PrivateRoutes