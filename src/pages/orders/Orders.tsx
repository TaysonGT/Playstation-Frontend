import { useState } from 'react'
import DevicesOrders from './partials/DevicesOrders'
import OuterReceipts from './partials/tables/OuterReceipts'

const Orders = () => {
  const [selectOrder, setSelectOrder] = useState<'outer'|'device'>('outer')

  return (
    <div className='h-full py-6 lg:px-36 px-10 bg-[#0d47a1] flex flex-col' dir='rtl'>
        <div className='duration-150 px-4 mb-4 flex items-center justify-end gap-4 text-white select-none cursor-pointer'>
            <span>الفواتير الخارجية</span>
            <div onClick={()=>setSelectOrder(prev=> prev==='outer'? 'device':'outer')} className={`flex duration-100 rounded-2xl p-1 px-1.25 w-16 h-8 cursor-pointer ${selectOrder==='outer'? 'justify-start bg-white/70' : 'justify-end bg-green-300/70'}`}>
                <span className={`rounded-full h-full aspect-square duration-75 ${selectOrder=='outer'?'bg-white': 'bg-green-300'}`}/>
            </div>
            <span>فواتير الأجهزة</span>
        </div>
        <div className='grow min-h-0'>
        { selectOrder==='outer'? 
          <OuterReceipts />
              :
          <DevicesOrders /> 
        }
      </div>
    </div>
  )
}

export default Orders