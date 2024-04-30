import axios from 'axios';
import React, { useEffect, useState } from 'react';
import OuterReceipt from '../receipt/OuterReceipt'

const OuterReceipts = ({ receipts,setShowPopup }) => {

  const [receiptData, setReceiptData] = useState()
  const [showInvoice, setShowInvoice] = useState()
  const [configs, setConfigs] = useState()


  useEffect(()=>{
      receiptData&&setShowInvoice(true)
  }, [configs, receiptData])

  const getReceiptHandler = (e)=>{
      let id = e.target.id;
      axios.get(`/receipts/outer/${id}`, {withCredentials: true})
      .then(({data})=> setReceiptData(data.receipt))
      
      axios.get('/config', {withCredentials: true})
      .then(({data})=> setConfigs({name: data.nameConfig.value, phone: data.phoneConfig.value}))
  }    

  return ( <>
    {showInvoice&& 
      <>
          <OuterReceipt {... {receiptData, setShowInvoice, configs}} />
          <div onClick={()=>setShowInvoice(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout z-[99]'></div>
      </>
    }
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-white">الفواتير الخارجية</h1>
      <button className='bg-indigo-600 rounded hover:bg-indigo-500 duration-150 text-white px-4 py-2' onClick={()=>setShowPopup(true)}>إضافة طلب</button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {receipts?.map((receipt, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
            <h2 className="text-xl font-semibold mb-2">{receipt.cashier}</h2>
            <p className="text-gray-600">التاريخ: {new Date(receipt.time_ordered).toLocaleDateString()}</p>
            <p className="text-gray-600">الوقت: {new Date(receipt.time_ordered).toLocaleTimeString()}</p>
            <p className="text-gray-800 mt-2">الاجمالي:  {receipt.total}ج</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">{receipt.totalAmount}</span>
              <button id={receipt.id} onClick={(e)=>getReceiptHandler(e)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ">التفاصيل</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default OuterReceipts;
