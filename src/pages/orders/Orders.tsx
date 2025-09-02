import { useState } from 'react'
import OuterOrders from './partials/OuterOrders'
import DevicesOrders from './partials/DevicesOrders'

const Orders = () => {
  const [selectOrder, setSelectOrder] = useState<'outer'|'device'>('outer')

  return (
    <div className='bg-white min-h-screen' dir='rtl'>
        <div className='fixed right-[80%] translate-x-[50%] mt-32 duration-150 px-4 flex items-center gap-4 text-white select-none cursor-pointer'>
            <span>الفواتير الخارجية</span>
            <div onClick={()=>setSelectOrder(prev=> prev==='outer'? 'device':'outer')} className={`flex duration-100 rounded-2xl p-1 px-1.25 w-16 h-8 cursor-pointer ${selectOrder==='outer'? 'justify-start bg-white/70' : 'justify-end bg-green-300/70'}`}>
                <span className={`rounded-full h-full aspect-square duration-75 ${selectOrder=='outer'?'bg-white': 'bg-green-300'}`}/>
            </div>
            <span>فواتير الأجهزة</span>
        </div>
        { selectOrder==='outer'? 
        <OuterOrders />
            :
        <DevicesOrders /> }
    </div>
  )
}

export default Orders