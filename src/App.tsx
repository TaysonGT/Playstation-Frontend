import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import PrivateRoutes from './routes/PrivateRoutes'
import LoginRoute from './routes/LoginRoute';

import Login from './pages/login/Login'
import Home from './pages/home/Home';
import Devices from './pages/devices/Devices';
import ReceiptsLayout from './pages/Receipts';
import Stock from './pages/stock/Stock';
import Config from './pages/config/Config';
import { DevicesProvider } from './context/DeviceContext';
import NotFoundPage from './pages/404';
import { AuthProvider } from './context/AuthContext';
import TestPage from './pages/TestPage';
import Dashboard from './pages/Dashboard';
import OuterReceipts from './pages/Receipts/partials/OuterReceipts';
import SessionReceipts from './pages/Receipts/partials/SessionReceipts';

function App() {

  return (
    <>
      <BrowserRouter>
      <Toaster position='top-left' containerStyle={
        { zIndex: 9999, marginTop: '80px', userSelect: "none"} 
      }/>
        <AuthProvider>
        <Routes>
          <Route path='/login' element={<LoginRoute/>}>
            <Route index element={<Login/>}/>
          </Route>
          <Route path='/' element={<PrivateRoutes />}>
            <Route index element={ 
              <DevicesProvider>
                <Home />
              </DevicesProvider>
            }/>
            <Route element={<TestPage /> } path='/test'  />
            <Route element={<Devices /> } path='/devices'  />
            <Route element ={<ReceiptsLayout />} path='/receipts'>
              <Route path='/receipts/outer' element={<OuterReceipts/>}/>
              <Route path='/receipts/sessions' element={<SessionReceipts/>}/>
            </Route>
            <Route element ={<Stock />} path='/stock'  />
            <Route element={<Config />} path='/settings'  />
            <Route element={<Dashboard />} path='/dashboard'  />
          </Route>
          <Route path='*' element={<NotFoundPage/>}/>
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </> 
  )
}

export default App;
