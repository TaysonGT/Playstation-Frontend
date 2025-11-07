import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { useTranslation } from 'react-i18next';

const LoginRoute = () => {
    const location = useLocation();
    const {currentUser, isLoading} = useAuth()
    const {t} = useTranslation()
    
    if(isLoading){
        return (
            <div className='h-screen w-screen flex flex-col gap-6 justify-center items-center'>
            <Loader size={60} thickness={10}/>
            <p className='text-xl'>{t('routing.pleaseWait')}...</p>
            </div>
        )
    }

    if(!currentUser){
        return <>
            <Outlet/>
        </>
    }else{
        return <Navigate to="/"  replace state={{from: location}} />
    }
}

export default LoginRoute