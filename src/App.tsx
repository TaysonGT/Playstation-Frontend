import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import PrivateRoutes from './routes/PrivateRoutes'
import LoginRoute from './routes/LoginRoute';

import Login from './pages/login/Login'
import Home from './pages/home/Home';
import Devices from './pages/devices/Devices';
import ReceiptsLayout from './pages/Receipts';
import Stock from './pages/stock/Stock';
import { DevicesProvider } from './context/DeviceContext';
import NotFoundPage from './pages/404';
import { AuthProvider } from './context/AuthContext';
import TestPage from './pages/TestPage';
import Dashboard from './pages/Dashboard';
import OuterReceipts from './pages/Receipts/partials/OuterReceipts';
import SessionReceipts from './pages/Receipts/partials/SessionReceipts';
import SettingsPage from './pages/Settings';
import { ConfigsProvider } from './context/ConfigsContext';
import GraphPage from './pages/Dashboard/graphs';
import CashReviewPage from './pages/CashReview';

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
            <Route element ={<ReceiptsLayout />} path='/receipts'>
              <Route path='/receipts/outer' element={<OuterReceipts/>}/>
              <Route path='/receipts/sessions' element={<SessionReceipts/>}/>
            </Route>
            <Route element ={<Stock />} path='/stock'  />
            <Route element={<Dashboard />} path='/dashboard'  />
            <Route element={<SettingsPage />} path='/settings'  />
            <Route path='/reports'>
              <Route index element={<GraphPage />}/>
              <Route element ={<CashReviewPage />} path='/reports/cash-review'  />
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
