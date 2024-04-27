import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SessionReceipt from '../receipt/SessionReceipt';

const DeviceReceiptTable = ({orders, setShowPopup}) => {
    const [receiptData, setReceiptData] = useState()
    const [showInvoice, setShowInvoice] = useState()

    const  receiptHandler = (e)=>{
        setShowInvoice(true)
    }

    useEffect(()=>{
        receiptData&&setShowInvoice(true)
    }, [receiptData])

    const getReceiptHandler = (e)=>{
        let id = e.target.id;
        axios.get(`/receipts/${id}`, {withCredentials: true})
        .then(({data})=> setReceiptData(data.receipt))
    }

  return (
    <div className="shadow-lg rounded-lg overflow-hidden grow ">
        {showInvoice&& 
            <>
                <SessionReceipt {... {receiptData, setShowInvoice}} />
                <div onClick={()=>setShowInvoice(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout z-[99]'></div>
            </>
        }
        <ul className='w-full bg-white'>
            <li className="flex bg-gray-100 items-center">
                <div className="py-4 px-6 text-right text-gray-600 font-bold uppercase flex-1">اسم الجهاز</div>
                <div className="py-4 px-6 text-right text-gray-600 font-bold uppercase flex-1">وقت البدء</div>
                <div className=" py-4 px-6 text-right text-gray-600 font-bold uppercase flex-1">وقت الانتهاء</div>
                <div className=" py-4 px-6 text-right text-gray-600 font-bold uppercase flex-1">حساب الطلبات</div>
                <div className=" py-4 px-6 text-right text-gray-600 font-bold uppercase flex-1">الاجمالي</div>
            </li>
        </ul>
        <ul className='w-full h-full bg-white overflow-y-scroll'>
            {orders.map((order)=>
            <li className='flex items-stretch w-full'>
                <div className="py-4 px-6 border-b border-gray-200 flex-1 flex items-center bg-white">{new Date(order.time_ordered).toString().slice(0, 25)}</div>
                <div  className="py-4 px-6 border-b border-gray-200 flex-1 flex items-center text-ellipsis overflow-hidden"><button onClick={(e)=>getReceiptHandler(e)} className='p-2 bg-green-500 hover:bg-green-400 duration-100 text-white rounded-md'>عرض الطلبات</button></div>
                <div className="py-4 px-6 border-b border-gray-200 flex-1 flex items-center">{order.cashier}</div>
                <div className="py-4 px-6 border-b border-gray-200 flex-1 flex items-center">{order.total}ج</div>
                </li>
            )} 
        </ul>
    </div>
  )
}

export default DeviceReceiptTable
