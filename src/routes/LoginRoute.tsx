import Cookies from 'js-cookie';
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {useState, useEffect} from 'react'

const LoginRoute = () => {
    const location = useLocation();
    const [token, setToken] = useState(Cookies.get('access_token'))
  
    useEffect(() => {
      setToken(Cookies.get('access_token'))
    }, [])
    
    if(!token){
        return <>
            <Outlet/>
        </>
    }else{
        return <Navigate to="/"  replace state={{from: location}} />
    }
}

export default LoginRoute