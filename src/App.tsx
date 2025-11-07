import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import PrivateRoutes from './routes/PrivateRoutes'
import LoginRoute from './routes/LoginRoute';

import Login from './pages/login/Login'
import Home from './pages/home/Home';
import Devices from './pages/devices/Devices';
import Stock from './pages/stock/Stock';
import { DevicesProvider } from './context/DeviceContext';
import NotFoundPage from './pages/404';
import { AuthProvider } from './context/AuthContext';
import TestPage from './pages/TestPage';
import SettingsPage from './pages/Settings';
import { ConfigsProvider } from './context/ConfigsContext';
import DashboardPage from './pages/Dashboard';
import CashReviewPage from './pages/CashReview';
import ReceiptsPage from './pages/Receipts';

function App() {

  return (
    <>
      <BrowserRouter>
      <Toaster position='top-left' containerStyle={
        { zIndex: 9999, marginTop: '80px', userSelect: "none"} 
      }/>
        <AuthProvider>
        <ConfigsProvider>
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
            <Route path='/receipts' element={<ReceiptsPage/>}/>
            <Route element ={<Stock />} path='/stock'  />
            <Route element={<SettingsPage />} path='/settings'  />
            <Route path='/dashboard'>
              <Route index element={<DashboardPage />}/>
              <Route element ={<CashReviewPage />} path='/dashboard/cash-review'  />
            </Route>
          </Route>
          <Route path='*' element={<NotFoundPage/>}/>
        </Routes>
        </ConfigsProvider>
        </AuthProvider>
      </BrowserRouter>
    </> 
  )
}

export default App;
