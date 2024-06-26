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
        })
    }

  return (
    <div className="shadow-lg rounded-lg overflow-hidden grow ">
        {showInvoice&& 
            <>
                <SessionReceipt {... {receiptData, setShowInvoice, configs, products}} />
                <div onClick={()=>setShowInvoice(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-150 z-[99]'></div>
            </>
        }
        <ul className='w-full bg-white'>
            <li className="flex bg-gray-100 items-center">
                <div className=" py-4   text-gray-600 font-bold uppercase flex-1 items-center text-center ">وقت الانتهاء</div>
                <div className="py-4   text-gray-600 font-bold uppercase flex-[.5] items-center text-center ">الجهاز</div>
                <div className=" py-4   text-gray-600 font-bold uppercase flex-1 items-center text-center ">حساب الطلبات</div>
                <div className=" py-4   text-gray-600 font-bold uppercase flex-1 items-center text-center ">الاجمالي</div>
                <div className=" py-4   text-gray-600 font-bold uppercase flex-1 items-center justify-center "></div>
            </li>
        </ul>
        <ul className='w-full h-full bg-white overflow-y-scroll'>
        {receipts?.map((receipt, i)=>
            <li key={i} className='flex items-stretch w-full'>
                <div className="py-4  border-b border-gray-200 flex-1 flex items-center justify-center flex-col bg-white">
                  <div>{new Date(receipt.end_at).toLocaleDateString()}</div>
                  <div>{new Date(receipt.end_at).toLocaleTimeString()}</div>
                </div>
                <div className="py-4 border-b border-gray-200 text-lg flex-[.5] flex items-center justify-center bg-white font-bold">{receipt.device_name}</div>
                <div className="py-4  border-b border-gray-200 flex-1 flex items-center justify-center">{parseInt(receipt.orders_cost)>0? (receipt.orders_cost + "ج"): "--"}</div>
                <div className="py-4  border-b border-gray-200 flex-1 flex items-center justify-center">{receipt.total}ج</div>
                <div className="py-4  border-b border-gray-200 flex-1 flex items-center justify-center  text-ellipsis overflow-hidden"><button onClick={(e)=>getReceiptHandler(e)}  id={receipt.id} className='p-2 bg-green-500 hover:bg-green-400 duration-100 text-white rounded-md'>عرض الطلبات</button></div>
                </li>
            )} 
        </ul>
    </div>
  )
}

export default DeviceReceiptTable
