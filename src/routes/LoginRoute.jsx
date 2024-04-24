import Cookies from 'js-cookie';
import { Navigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

const LoginRoute = ({children}) => {
    const location = useLocation();
    let token = Cookies.get('access_token')


    if(!token){
        return <>
            <Navbar token={token} />
            {children}
        </>
    }else{
        console.log("You're Signed in")
        return <Navigate to="/"  replace state={{from: location}} />
    }
}

export default LoginRoute