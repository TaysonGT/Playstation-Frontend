import axios from 'axios';
import { useEffect, useState } from 'react';
import OuterReceipt from '../receipt/OuterReceipt'
import { IOrder, IReceipt } from '../../../home/types';
import OrderPopup from '../popup/OrderPopup';
import Loader from '../../../../components/Loader';

const OuterReceipts = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [receiptData, setReceiptData] = useState()
  const [orders, setOrders] = useState<IOrder[]>([])
  const [showInvoice, setShowInvoice] = useState(false)
  const [configs, setConfigs] = useState({name: '', phone: ''})
  const [receipts, setReceips] = useState<IReceipt[]>([]) 
  const [isLoading, setIsLoading] = useState(true) 

  const refetch = async()=>{
    setIsLoading(true)
    await axios.get('/receipts/outer', {withCredentials:true})
    .then(({data}) => {
      setReceips(data.receipts?.reverse())    
    })
    .catch(err=> (err))
    .finally(
      ()=>
      setIsLoading(false)
    )
  }

  useEffect(()=>{
    refetch()
  },[])

  useEffect(()=>{
      receiptData&&setShowInvoice(true)
  }, [configs, receiptData])

  const getReceiptHandler = (id: string)=>{
      axios.get(`/receipts/outer/${id}`, {withCredentials: true})
      .then(({data})=> {
        setReceiptData(data.receipt)
        setOrders(JSON.parse(data.orders))
      })
      
      axios.get('/config', {withCredentials: true})
      .then(({data})=> setConfigs({name: data.nameConfig?.value, phone: data.phoneConfig?.value}))
  }    

  return ( <>
    {(showInvoice&&receiptData)&& 
      <>
          <OuterReceipt {... {receipt: receiptData, orders, hide: ()=>setShowInvoice(false)}} />
          <div onClick={()=>setShowInvoice(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-150 z-[99]'></div>
      </>
    }
    {showPopup&&
      <>
        <OrderPopup {...{ hide: ()=>setShowPopup(false)}}  />
        <div onClick={()=>setShowPopup(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-100 z-[100]'></div>
      </>
    }
    <div className="container mx-auto h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-4 text-white">الفواتير الخارجية</h1>
      <button className='px-4 py-2 self-start hover:bg-green-500 duration-150 bg-green-600 text-white rounded-lg shadow-md' onClick={()=>setShowPopup(true)}>إضافة طلب</button>
      {isLoading? <div className='grow flex justify-center'><Loader size={40} thickness={10} color='white' /></div>
      :
      receipts.length>0?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
      {receipts?.map((receipt, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
            <h2 className="text-xl font-semibold mb-2">{receipt.cashier.username}</h2>
            <p className="text-gray-600">التاريخ: {new Date(receipt.created_at).toLocaleDateString()}</p>
            <p className="text-gray-600">الوقت: {new Date(receipt.created_at).toLocaleTimeString()}</p>
            <p className="text-gray-800 mt-2">الاجمالي:  {receipt.total}ج</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">{receipt.total}</span>
              <button id={receipt.id} onClick={()=>getReceiptHandler(receipt.id)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ">التفاصيل</button>
            </div>
          </div>
        ))}
      </div>
      : <div dir='rtl' className='text-center grow pt-10'>
            <h1 className='text-xl text-gray-200'>لا توجد فواتير خارجية...</h1>
        </div>
      }
    </div>
    </>
  );
};

export default OuterReceipts;
