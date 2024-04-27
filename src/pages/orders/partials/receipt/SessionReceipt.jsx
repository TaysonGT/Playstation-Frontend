import React, { useRef } from 'react'
import toast from 'react-hot-toast'
import { useReactToPrint } from 'react-to-print'

const SessionReceipt = ({sessionReceipt, setShowInvoice, configs}) => {
    const invoiceRef = useRef()
    const handler = useReactToPrint({
        content: ()=> invoiceRef.current,
        documentTitle: "Invoice",
        onAfterPrint: ()=> toast.success("طباعة ناجحة")
    })

  return (
    <div className='fixed z-[100] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#eee] p-4 rounded-lg'>
        <div className='mb-2 w-full flex justify-between flex-row-reverse'>
            <span onClick={()=>setShowInvoice(false)} className='text-red-400 duration-150 font-bold text-3xl cursor-pointer hover:text-red-500'>X</span>
            <button onClick={handler} className="shadow-large rounded bg-indigo-600 px-6 pb-2 pt-2.5 text-md font-medium  text-white duration-150 ease-in-out hover:bg-indigo-400 hover:text-white">
                طباعة الفاتورة
            </button>
        </div>
        <div className='max-h-[60vh] overflow-y-scroll'>
        <div ref={invoiceRef} className="w-[300px] mx-auto p-4 border rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div>
                <h1 className="text-xl font-bold">{configs?.name}</h1>
                <p>{configs?.phone}</p>
                </div>
                <div>
                <p className="text-sm">التاريخ: {new Date(sessionReceipt?.time_ordered).toLocaleDateString()}</p>
                <p className="text-sm">الوقت: {new Date(sessionReceipt?.time_ordered).toLocaleTimeString()}</p>
                </div>
            </div>
            <div className="flex gap-6 mb-4">
                <div>
                <h1 className="text-sm font-bold">الكاشير</h1>
                <p>{sessionReceipt?.cashier}</p>
                </div>
            </div>
            <div className="mb-4">
                <h2 className="text-lg font-bold mb-2">الطلبات</h2>
                {sessionReceipt&& JSON.parse(sessionReceipt.orders).map((order, index) => (
                <div className="flex justify-between mb-2">
                    <span className='flex-[.45]'>{order.product_id}</span>
                    <span className='flex-[.33]'>{order.quantity}</span>
                    <span>{order.order_cost}ج</span>
                </div>
                ))}
            </div>
            <div className="mb-4">
                <h2 className="text-lg font-bold mb-2">وقت اللعب</h2>
                {sessionReceipt&& JSON.parse(sessionReceipt.orders)?.map((order, index) => (
                <div className="flex justify-between mb-2">
                    <span className='flex-[.45]'>{order.product_id}</span>
                    <span className='flex-[.33]'>{order.quantity}</span>
                    <span>{order.order_cost}ج</span>
                </div>
                ))}
            </div>
            <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                <span className="font-bold">الاجمالي:</span>
                <span>{sessionReceipt?.total}ج</span>
            </div>
        </div>
        </div>
    </div>
  )
}

export default SessionReceipt



