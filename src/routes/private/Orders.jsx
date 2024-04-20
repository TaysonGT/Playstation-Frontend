import React, { useEffect, useRef, useState } from 'react'
import OuterOrders from '../../components/OuterOrders'

const Orders = () => {

    const [selectOrder, setSelectOrder] = useState(false)

    const selectOrderHandler = (e)=>{
        e.target.value==1? setSelectOrder(false) : setSelectOrder(true)
    }

  return (
    <div className='pt-28 p-16 bg-indigo-200 min-h-screen' dir='rtl'>
        <div className='w-full flex justify-between px-14 md:w-[60%]'>
            <h1 className='text-3xl font-bold'>الطلبات</h1>
            <select onInput={selectOrderHandler} name="" id="" className='p-2 text-md font-medium border-2 border-black '>
                <option value="1" className='font-bold'>الطلبات الخارجية</option>
                <option value="2" className='font-bold'>طلبات الأجهزة</option>
            </select>
        </div>
        { selectOrder&&
        <OuterOrders />
        }
    </div>
  )
}

export default Orders