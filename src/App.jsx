import React, {useEffect} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import PrivateRoutes from './routes/PrivateRoutes'
import LoginRoute from './routes/LoginRoute';

import Login from './pages/login/Login'
import Home from './pages/home/Home';
import Devices from './pages/devices/Devices';
import Orders from './pages/orders/Orders';
import Stock from './pages/stock/Stock';
import Config from './pages/config/Config';
import Revenue from './pages/revenue/Revenue';

function App() {

  return (
    <>
      <BrowserRouter>
      <Toaster position='top-left' containerStyle={
        { zIndex: 15, marginTop: '80px', userSelect: "none"} 
      }/>
        <Routes>
          <Route path='/login' element={<LoginRoute children={<Login />} />} />
          <Route path='/' element={<PrivateRoutes />}>
            <Route index element={<Home />} path='/' exact />
            <Route element={<Devices /> } path='/devices'  />
            <Route element ={<Orders />} path='/orders'  />
            <Route element ={<Stock />} path='/stock'  />
            <Route element={<Config />} path='/settings'  />
            <Route element={<Revenue />} path='/revenue'  />
          </Route>
        </Routes>
      </BrowserRouter>
    </> 
  )
}

export default App;
