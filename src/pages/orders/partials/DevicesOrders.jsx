import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'
import DeviceReceiptTable from './tables/DeviceReceiptTable'
import { MoonLoader } from 'react-spinners'



const DevicesOrders = () => {
    const [receipts, setReceipts] = useState()
    const [products, setProducts] = useState([]) 
    const [showPopup, setShowPopup] = useState(false)
    

    useEffect(()=>{
    axios.get('/products', {withCredentials: true})
      .then(({data})=> {
          setProducts(data.products)
      })
    axios.get('/receipts/session', {withCredentials:true})
    .then(({data})=> {
          setReceipts(data.timeReceipts?.reverse())
      })
    }, [])

  return (<>
    <div className='min-h-screen bg-[#0d47a1] pt-32 pb-10 lg:px-36 px-10'>
        <h1 className="text-3xl font-bold mb-4 text-white">فواتير الأجهزة</h1>
        {!receipts? <div className='mt-16 flex justify-center items-center'><MoonLoader color='white' /></div>
        :
        <DeviceReceiptTable {... {receipts, setShowPopup, products}} />
        }
    </div>
      </>
    )
}

export default DevicesOrders