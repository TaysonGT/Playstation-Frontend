import React, { useState } from 'react'
import OuterOrders from './partials/OuterOrders'
import DevicesOrders from './partials/DevicesOrders'

const Orders = () => {

    const [selectOrder, setSelectOrder] = useState(false)

  return (
    <div className='bg-white min-h-screen' dir='rtl'>
        <div className='fixed right-[80%] translate-x-[50%] mt-[100px]   duration-150 px-4'>
            
                <button
                    className={`px-4 py-2 rounded duration-150 ${
                    selectOrder ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                    onClick={() => setSelectOrder(!selectOrder)}
                >
                    <span>{selectOrder ? 'الفواتير الخارجية' : 'فواتير الأجهزة'}</span>
                </button>
        </div>
        { !selectOrder? 
        <OuterOrders />
            :
        <DevicesOrders /> }
    </div>
  )
}

export default Orders