import React, { useRef, useState, useEffect } from 'react'
import { IOrder, IReceipt } from '../../../../types'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../../../i18n'
import { useConfigs } from '../../../../context/ConfigsContext'

interface Props {
  receipt: IReceipt, 
  hide: ()=>void, 
}

const SessionReceipt:React.FC<Props> = ({receipt, hide}) => {
    const [totalPlayed, setTotalPlayed] = useState<string>('')
    const invoiceRef = useRef<HTMLDivElement>(null)
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);
    const {configs} = useConfigs()
    
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
      if(receipt){
        let totalTime = 0;
        receipt.time_orders?.map((order) => {
          totalTime+= new Date(order.ended_at).getTime() - new Date(order.started_at).getTime()
        })
        const convertedTime = timeConv({secs:totalTime})
        setTotalPlayed(convertedTime)
      }
    }, [receipt])
    
  return (
    <div dir={currentDirection} className='fixed z-[100] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#fff] p-4 rounded-lg'>
        <div className='mb-2 w-full flex justify-between flex-row-reverse'>
            <span onClick={()=>hide()} className='text-red-400 duration-150 font-bold text-3xl cursor-pointer hover:text-red-500'>x</span>
            <button onClick={()=>console.log('print')} className="shadow-large rounded bg-indigo-600 px-6 pb-2 pt-2.5 text-md font-medium  text-white duration-150 ease-in-out hover:bg-indigo-400 hover:text-white">
                طباعة الفاتورة
            </button>
        </div>
        <div className='max-h-[60vh] overflow-y-auto'>
        <div ref={invoiceRef} className="w-[300px] mx-auto p-4 border rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-base font-bold">{configs?.name}</h1>
                  <p>{configs?.phone}</p>
                </div>
                <div>
                  <p className="text-sm">{t('tables.date')}: {new Date(receipt?.created_at).toLocaleDateString()}</p>
                  <p className="text-sm">{t('tables.time')}: {new Date(receipt?.created_at).toLocaleTimeString()}</p>
                </div>
            </div>
            <div className="flex gap-6 mb-4">
                <div>
                <h1 className="text-sm font-bold">{t('tables.cashier')}</h1>
                <p>{receipt.cashier?.username||'Deleted User'}</p>
                </div>
            </div>
            {(receipt.orders && receipt.orders?.length > 0)&&
            <div className="mb-4">
                <h2 className="font-bold text-sm mb-2">{t('receipts.orders')}</h2>
                <div className="flex w-full mb-2 text-xs font-bold">
                    <span className='flex-1 text-start'>{t('stock.product')}</span>
                    <span className='flex-1 text-center px-2'>{t('tables.quantity')}</span>
                    <span className='flex-1 text-center'>{t('receipts.cost')}</span>
                </div>
                {receipt.orders.map((order:IOrder, i) => (
                <div key={i} className="flex mb-2">
                    <span className='flex-1'>{order.product.name}</span>
                    <span className='flex-1 text-center'>{order.quantity}</span>
                    <span className='flex flex-1 gap-1 justify-end items-center'>{order.cost}<span>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.code}</span></span>
                </div>
                ))}
            </div>
            }
            {(receipt.time_orders && receipt.time_orders?.length > 0)&&
            <div className="mb-4">
                <h2 className="font-bold text-sm mb-2">{t('receipts.playTime')}</h2>
                {receipt.time_orders.map((order, i) => (
                  <div key={i} className="flex mb-4">
                      <span className='ml-auto flex-1'>{timeConv({start: order.started_at, end: order.ended_at})}</span>
                      <span className='text-center flex-1'>{order.play_type.toUpperCase()}</span>
                      <span className='flex justify-end gap-1 flex-1'>{order.cost}<span>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.code}</span></span>
                  </div>
                ))}
                <div className="flex items-start flex-col mb-2">
                    <span className='font-bold'>{t('devices.totalTime')}</span>
                    <span className='font-medium text-lg mt-1'>{totalPlayed}</span>
                </div>
            </div>
            }
            <div className="flex font-bold justify-between pt-2 border-t-2 border-gray-300">
                <span className="">{t('tables.total')}:</span>
                <span className='flex items-center gap-1'>{receipt?.total}<span className=''>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.code}</span></span>
            </div>
        </div>
        </div>
    </div>
  )
}

export default SessionReceipt



