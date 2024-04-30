import React, { useEffect, useState } from 'react'
import axios from 'axios'
import OrderPopup from '../partials/popup/OrderPopup'
import { toast } from 'react-hot-toast';
import OuterReceipts from './tables/OuterReceipts';

const OuterOrders = () => {
    const [orders, setOrders] = useState([]) 
    const [showPopup, setShowPopup] = useState(false)
    const [message, setMessage] = useState()
    const [success, setSuccess] = useState()
    
    useEffect(()=>{
        axios.get('/receipts/outer', {withCredentials:true})
            .then(({data}) => {
                setOrders(data.receipts)    
            })
            .catch(err=> (err))

        if(message){
            success?toast.success(message) : toast.error(message)
            setMessage(null)
        }
    },[message, showPopup, success])


  return (
        <>
        {showPopup&&
         <>
            <OrderPopup {...{ setMessage, setShowPopup, setSuccess}}  />
            <div onClick={()=>setShowPopup(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout z-[100]'></div>
         </>
        }
        <div className='min-h-screen bg-[#0d47a1] pt-32 lg:px-36 px-10'>
            <OuterReceipts {... {receipts: orders , setShowPopup}} />
        </div>
    </>
  )
}

export default OuterOrders