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
import { DevicesProvider } from './context/DeviceContext';

function App() {

  return (
    <>
      <BrowserRouter>
      <Toaster position='top-left' containerStyle={
        { zIndex: 9999, marginTop: '80px', userSelect: "none"} 
      }/>
        {/* <DevicesProvider> */}
        <Routes>
          <Route path='/login' element={<LoginRoute/>}>
            <Route path='/login' element={<Login/>}/>
          </Route>
          <Route path='/' element={<PrivateRoutes />}>
            <Route index element={ 
              <DevicesProvider>
                <Home />
              </DevicesProvider>
            }/>
            <Route element={<Devices /> } path='/devices'  />
            <Route element ={<Orders />} path='/orders'  />
            <Route element ={<Stock />} path='/stock'  />
            <Route element={<Config />} path='/settings'  />
            <Route element={<Revenue />} path='/revenue'  />
          </Route>
        </Routes>
        {/* </DevicesProvider> */}
      </BrowserRouter>
    </> 
  )
}

export default App;
