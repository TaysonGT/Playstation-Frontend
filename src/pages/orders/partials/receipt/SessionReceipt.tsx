import React, { useRef, useState, useEffect } from 'react'
import { IOrder, IReceipt, ITimeOrder } from '../../../home/types'

interface Props {
  receiptData: IReceipt, 
  hide: ()=>void, 
  configs: {name:string, phone:string}
}

const SessionReceipt:React.FC<Props> = ({receiptData, hide, configs}) => {
    const [totalPlayed, setTotalPlayed] = useState<string>('')
    const [timeOrders, setTimeOrders] = useState<ITimeOrder[]>()
    const [orders, setOrders] = useState<IOrder[]>([])
    const invoiceRef = useRef<HTMLDivElement>(null)

    // const handler = useReactToPrint({
    //     content: ()=> invoiceRef.current,
    //     documentTitle: "Invoice",
    //     onAfterPrint: ()=> toast.success("طباعة ناجحة")
    // })

    const timeConv = ({start, end, secs}:{start?:string, end?:string, secs?: number})=>{
      let time = null
      if(secs){
        time = Math.floor(secs/1000)
      }else if(start&&end){
        time = Math.floor((new Date(end).getTime() - new Date(start).getTime())/ 1000)
      }
      if(!time) return `00:00:00`;

      let hours = Math.floor(time / (60*60))
      let minutes = Math.floor((time / 60) % (60))
      let seconds = time % 60
      
      let strHours = hours.toString()
      let strMinutes = minutes.toString()
      let strSeconds = seconds.toString()
      
      if (hours<10) strHours = `0${hours}`
      if (minutes<10) strMinutes = `0${minutes}`
      if(seconds<10) strSeconds = `0${seconds}`
      return `${strHours}:${strMinutes}:${strSeconds}`
    }
    
    useEffect(() => {
      if(receiptData){
        let totalTime = 0;
        const LTimeOrders:ITimeOrder[] = JSON.parse(receiptData.time_orders)
        LTimeOrders.map((order) => {
          totalTime+= new Date(order.end_at).getTime() - new Date(order.start_at).getTime()
        })
        const convertedTime = timeConv({secs:totalTime})
        setTotalPlayed(convertedTime)
        setTimeOrders(LTimeOrders)
        setOrders(JSON.parse(receiptData.orders))
      }
    }, [receiptData])
    
  return (
    <div className='fixed z-[100] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#eee] p-4 rounded-lg'>
        <div className='mb-2 w-full flex justify-between flex-row-reverse'>
            <span onClick={()=>hide()} className='text-red-400 duration-150 font-bold text-3xl cursor-pointer hover:text-red-500'>x</span>
            <button onClick={()=>console.log('print')} className="shadow-large rounded bg-indigo-600 px-6 pb-2 pt-2.5 text-md font-medium  text-white duration-150 ease-in-out hover:bg-indigo-400 hover:text-white">
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
                <p className="text-sm">التاريخ: {new Date(receiptData?.end_at).toLocaleDateString()}</p>
                <p className="text-sm">الوقت: {new Date(receiptData?.end_at).toLocaleTimeString()}</p>
                </div>
            </div>
            <div className="flex gap-6 mb-4">
                <div>
                <h1 className="text-sm font-bold">الكاشير</h1>
                <p>{receiptData?.cashier}</p>
                </div>
            </div>
            {(receiptData && JSON.parse(receiptData.orders)?.length > 0)&&
            <div className="mb-4">
                <h2 className="text-lg font-bold mb-2">الطلبات</h2>
                {orders.map((order:IOrder, i) => (
                <div key={i} className="flex justify-between mb-2">
                    <span className='flex-[.45]'>{order.product_name}</span>
                    <span className='flex-[.33]'>{order.quantity}</span>
                    <span>{order.cost}<span className='font-noto text-lg font-bold'>ج</span></span>
                </div>
                ))}
            </div>
            }
            {(receiptData && JSON.parse(receiptData.time_orders)?.length > 0)&&
            <div className="mb-4">
                <h2 className="text-lg font-bold mb-2">وقت اللعب</h2>
                {timeOrders?.map((order, i) => (
                <div key={i} className="flex mb-2">
                    <span className='ml-auto w-1/3'>{timeConv({start: order.start_at, end: order.end_at})}</span>
                    <span className='text-center'>{order.play_type.toUpperCase()}</span>
                    <span className='mr-auto text-left w-1/4'>{order.cost}<span className='font-noto text-lg font-bold text-left'>ج</span></span>
                </div>
                ))}
                <div className="flex items-start flex-col mb-2">
                    <span className='font-bold'>اجمالي الوقت</span>
                    <span className='font-medium text-lg mt-1'>{totalPlayed}</span>
                </div>
            </div>
            }
            <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                <span className="font-bold">الاجمالي:</span>
                <span>{receiptData?.total}<span className='font-noto text-lg font-bold'>ج</span></span>
            </div>
        </div>
        </div>
    </div>
  )
}

export default SessionReceipt



