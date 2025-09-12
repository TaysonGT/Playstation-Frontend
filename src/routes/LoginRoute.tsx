import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const LoginRoute = () => {
    const location = useLocation();
    const {currentUser} = useAuth()
    
    if(!currentUser){
        return <>
            <Outlet/>
        </>
    }else{
        return <Navigate to="/"  replace state={{from: location}} />
    }
}

export default LoginRoute