import React, { useEffect, useState } from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './routes/safe/Login'
import PrivateRoutes from './routes/main/PrivateRoutes'
import Home from './routes/private/Home';
import LoginRoute from './routes/main/LoginRoute';
import Cookies from 'js-cookie';
import Devices from './routes/private/Devices';
import Orders from './routes/private/Orders';


function App() {
  const [token, setToken] = useState(Cookies.get('access_token'))

  const presenceCookie = Cookies.get("access_token")
  
  useEffect(()=>{
    if (token !== presenceCookie ) {
      setToken(presenceCookie);
    }
  }, [])
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/auth/login' element={<LoginRoute children={<Login />} />} />
          <Route element={<PrivateRoutes />}>
            <Route element={<Home />} path='/' exact />
            <Route element={<Devices /> } path='/devices' exact />
            <Route element={<Orders />} path='/orders' exact />
          </Route>
          </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App;
