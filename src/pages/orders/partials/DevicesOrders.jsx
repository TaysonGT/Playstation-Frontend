import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'
import DeviceReceiptTable from './tables/DeviceReceiptTable'



const DevicesOrders = () => {
    
    const [orders, setOrders] = useState([]) 
    const [showPopup, setShowPopup] = useState(false)
    

    useEffect(()=>{
    axios.get('/orders', {withCredentials: true})
        .then(({data})=> {
            setOrders(data.orders)
        })
    }, [])

  return (<>
    <div className='min-h-screen bg-[#0d47a1] pt-32 pb-10 px-36'>
        <h1 className="text-3xl font-bold mb-4 text-white">فواتير الأجهزة</h1>
        <DeviceReceiptTable {... {orders, setShowPopup}} />
    </div>
      </>
    )
}

export default DevicesOrders