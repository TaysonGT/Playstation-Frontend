// import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import Sidebar from '../../components/Sidebar'

const ReceiptsLayout = () => {
  const location = useLocation()
  if(location.pathname === '/receipts') return <Navigate to={'/receipts/outer'} />;

  return (
    <div className='h-full py-10 lg:pr-36 px-10 bg-[#0d47a1] relative'>
      <Sidebar/>
      <div className='h-full'>
        <Outlet/>
      </div>
    </div>
  )
}

export default ReceiptsLayout