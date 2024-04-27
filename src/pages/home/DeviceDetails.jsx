import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const DeviceDetails = ({setShowDetails, sessions ,device, currentDeviceType, clock, trigger, setTrigger, devices }) => {
  
    const [session, setSession] = useState()
    const [orders, setOrders] = useState()
    const [timeOrders, setTimeOrders] = useState()
    const [total, setTotal] = useState()
    // const [currOrders]

    const [refresh, setRefresh] = useState(false) 

    const [products, setProducts] = useState()
    const [freeDevices, setFreeDevices] = useState([])

    const getTotal= ()=>{
      let final = 0;
      let ordersCost = 0;
      let timeCost = 0;

      orders?.map((order)=>{
        ordersCost += order.cost;
      })
      
      timeOrders?.map((order)=>{
        timeCost += order.cost;
      })

      let time = (Date.now() - new Date(session.start_at).getTime()) / (1000 * 60 * 60)
      session.play_type=="multi" ? timeCost = Math.floor(time * currentDeviceType.multi_price )
      : timeCost = Math.floor(time * currentDeviceType.single_price) 
      
      final += timeCost + ordersCost;
      return {final, ordersCost, timeCost}
    }

    useEffect(()=>{      
      if(session&&orders) {
        setTotal(getTotal()) 
      }
    }, [orders])
    
    useEffect(()=>{
      (sessions && device)&& setSession(sessions.filter((item)=> item.device_id == device.id)[0])
      axios.get(`/products`, {withCredentials:true})
      .then(({data})=> setProducts(data.products))

      session&& axios.get(`/orders/${session.id}`, {withCredentials: true})
      .then(({data})=>{
        setOrders(data.arrangedOrders)
        setTimeOrders(data.timeOrders)
      })

      devices&& setFreeDevices(devices.filter((dev, i )=> dev.status == false))

    },[session, refresh])


  const addOrderHandler = (e)=>{
    e.preventDefault()
    let product_id = document.getElementById('selectProduct').value
    let quantity = document.getElementById('orderQuantity').value
    if(product_id && quantity){
      axios.post(`/orders/${session.id}`, {product_id, quantity},{withCredentials: true})
      .then(({data})=>{
        if(data.message){
          data.success? toast.success(data.message) : toast.error(data.message)
          setRefresh(!refresh)

        }
      })
    }else toast.error("برجاء إدخال كل البيانات")

  }

  const endSessionHandler = (e)=>{
    e.preventDefault()
    axios.delete(`/sessions/${session.id}`, {withCredentials: true})
      .then(({data})=>{
          if(data.message){
              data.success? toast.success(data.message) : toast.error(data.message)
              setTrigger(!trigger)
          }
      })
      .catch(err=>(err))
    }

  return (
    <div dir='rtl' className="text-center grid grid-cols-3 p-8 gap-8 fixed z-[102] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-md rounded-lg " style={{gridAutoRows: '180px auto'}}>
        <div className="flex flex-col">

          <h2 className="text-lg font-semibold text-gray-800">الوقت</h2>

          <div className="flex flex-col justify-center flex-grow ">
            <div className="text-3xl font-bold text-black ">{clock}</div>

            <div className='flex justify-center gap-6 mt-2'>
              <div className='text-md font-medium border-b-4 pb-1 border-gray-600'>{session?.play_type == "single"? "سنجل" : "ملتي" }</div>
              <div className='text-md font-medium border-b-4 pb-1 border-gray-600'>{session?.time_type == "open"? "مفتوح" : "وقت"}</div>
            </div>

          </div>
          
        </div>

        <div className="flex flex-col justify-between ">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">طلب جديد</h2>
          <form>

            <select id='selectProduct'
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            >
              {products?.map((product, index) => (
                <option key={index} value={product.id}>{product.name}</option>
              ))}
            </select>
            <input
              type="number"
              id="orderQuantity"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              placeholder="أدخل الكمية"
            />
            <button
              type='submit'
              onClick={addOrderHandler}
              className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800"
            >
              إضافة
            </button>
          </form>
        </div>
        <div className="flex flex-col justify-between">
          <h2 className="text-lg font-semibold text-gray-800">الحساب</h2>
          <div className='flex justify-center gap-8  py-4'>
            <div>
              <p>الطلبات</p>
              {total?.ordersCost>0? <p> {total.ordersCost}<span className=' font-bold tracking-widest font-noto'>ج</span></p> : <p>--</p>}
            </div>

            <div>
              <p>الوقت</p>
              <p>{total?.timeCost}<span className=' font-bold tracking-widest font-noto'>ج</span></p>
            </div>
          </div>
          <div>
            
            <p className="text-xl font-bold text-blue-700">الاجمالي</p>
            <p className='text-xl font-bold text-blue-700'>{total?.final}<span className=' font-bold tracking-widest font-noto'>ج</span></p>
          </div>
          <button id={session?.id} onClick={endSessionHandler} className='p-2 mt-auto bg-red-700 text-white rounded hover:bg-red-600 duration-150'>إنهاء الوقت</button>
        </div>
        

        <div className="flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">اعدادات الجهاز</h2>
          <p className='mb-2'>تغيير نوع اللعب</p>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
          >
            <option value="single">سنجل</option>
            <option value="multi">ملتي</option>
          </select>
          <p className='mb-2'>نقل الجهاز</p>
          <select
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md"
          >
            {freeDevices?.map((dev, i)=>
              <option key={i} value={dev.id}>{dev.name}</option>
          )}
          
          </select>
          <button
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            تعديل
          </button>
        </div>

        <div className='flex flex-col col-start-1 row-start-1 row-end-2 h-auto'>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">الطلبات</h2>
          {orders?.length>0?
          <ul className='mt-2 overflow-y-scroll'>
            {orders?.map((order, index) => (
              <li key={index} className='flex justify-end px-4'>
                <span className='ml-auto'>{order.quantity}</span>
                <span className='font-semibold'>{order.product}</span>  
                <span className='mr-auto'>{order.cost}ج</span>
              </li>
            ))}
            </ul> : 
            <p className='text-gray-500 mt-6'>لا توجد طلبات على هذا الجهاز...</p>
            }
        </div>
        <div className='col-start-1 row-start-2 row-end-3'>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">اجمالي الوقت</h2>
            {timeOrders?.length>0?
          <ul>
            {orders?.map((order, index) => (
              <li key={index}>{order.product} - Quantity: {order.quantity}</li>
            ))}
            </ul>
            :
            <p className='text-gray-500 mt-6'>لا توجد جلسات أخرى لهذا الجهاز...</p>

            }
        </div>

    </div>
  );
};

export default DeviceDetails;
