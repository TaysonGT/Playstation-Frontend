import Cookies from 'js-cookie';
import { Navigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar';

const LoginRoute = ({children}) => {
    const location = useLocation();
    let token = Cookies.get('access_token')


    if(!token){
        return <>
            <Navbar token={token} />
            {children}
        </>
    }else{
        return <Navigate to="/"  replace state={{from: location}} />
    }
}

export default LoginRoute