import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SessionReceipt from '../receipt/SessionReceipt';

const DeviceReceiptTable = ({receipts, setShowPopup, products}) => {
    const [receiptData, setReceiptData] = useState()
    const [showInvoice, setShowInvoice] = useState()
    const [configs, setConfigs] = useState([])

    useEffect(()=>{
        axios.get('/config', {withCredentials: true})
          .then(({data})=> setConfigs({name: data.nameConfig?.value, phone: data.phoneConfig?.value}))
    }, [])
    
    useEffect(()=>{
      (receiptData&&configs)&& setShowInvoice(true)
    }, [configs, receiptData])

    const getReceiptHandler = (e)=>{
        let id = e.target.id;
        axios.get(`/receipts/session/${id}`, {withCredentials: true})
        .then(({data})=> {
          setReceiptData(data.timeReceipt)
          console.log(data)
          console.log(e.target)
        })
    }

  return (
    <div className="shadow-lg rounded-lg overflow-hidden grow ">
        {showInvoice&& 
            <>
                <SessionReceipt {... {receiptData, setShowInvoice, configs, products}} />
                <div onClick={()=>setShowInvoice(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout z-[99]'></div>
            </>
        }
        <ul className='w-full bg-white'>
            <li className="flex bg-gray-100 items-center">
                <div className="py-4 px-6 text-right text-gray-600 font-bold uppercase flex-1">اسم الجهاز</div>
                <div className=" py-4 px-6 text-right text-gray-600 font-bold uppercase flex-1">وقت الانتهاء</div>
                <div className=" py-4 px-6 text-right text-gray-600 font-bold uppercase flex-1">حساب الطلبات</div>
                <div className=" py-4 px-6 text-right text-gray-600 font-bold uppercase flex-1">الاجمالي</div>
            </li>
        </ul>
        <ul className='w-full h-full bg-white overflow-y-scroll'>
            {receipts?.map((receipt, i)=>
            <li key={i} className='flex items-stretch w-full'>
                <div className="py-4 px-6 border-b border-gray-200 flex-1 flex items-center bg-white">{receipt.device_name}</div>
                <div className="py-4 px-6 border-b border-gray-200 flex-1 flex items-center bg-white">{new Date(receipt.end_at).toString()}</div>
                <div className="py-4 px-6 border-b border-gray-200 flex-1 flex items-center">{receipt.orders_cost}</div>
                <div className="py-4 px-6 border-b border-gray-200 flex-1 flex items-center">{receipt.total}ج</div>
                <div className="py-4 px-6 border-b border-gray-200 flex-1 flex items-center text-ellipsis overflow-hidden"><button onClick={(e)=>getReceiptHandler(e)}  id={receipt.id} className='p-2 bg-green-500 hover:bg-green-400 duration-100 text-white rounded-md'>عرض الطلبات</button></div>
                </li>
            )} 
        </ul>
    </div>
  )
}

export default DeviceReceiptTable
