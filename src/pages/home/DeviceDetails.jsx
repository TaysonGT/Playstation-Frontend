import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const DeviceDetails = ({setShowDetails, currentSession ,device, currentDeviceType, clock, trigger, setTrigger, devices,refresh, setRefresh, setUnavailableDevices }) => {
  
    const [orders, setOrders] = useState()
    const [timeOrders, setTimeOrders] = useState()
    const [times, setTimes] = useState([{}])

    const [total, setTotal] = useState()

    const [products, setProducts] = useState()
    const [freeDevices, setFreeDevices] = useState([])

    const getTotal= ()=>{
      let final = 0;
      let ordersCost = 0;
      let timeCost = 0;

      orders?.map((order)=>{
        return ordersCost += order.cost;
      })
      
      timeOrders?.map((order)=>{
        return timeCost += order.cost;
      })
      
      let time = null;
      let currentTimeCost = 0
      if(currentSession.time_type === "time" && new Date(currentSession.end_at) < new Date() ) {
        time = (new Date(currentSession.end_at).getTime() - new Date(currentSession.start_at).getTime()) / (1000 * 60 * 60);
      } else time = (Date.now() - new Date(currentSession.start_at).getTime()) / (1000 * 60 * 60)
      currentSession.play_type==="multi" ? currentTimeCost = Math.ceil(time * currentDeviceType.multi_price )
      : currentTimeCost = Math.ceil(time * currentDeviceType.single_price) 
      
      timeCost += currentTimeCost;
      final += timeCost + ordersCost;
      return {final, ordersCost, timeCost, currentTimeCost}
    }

    useEffect(()=>{      
      if(currentSession&&orders&&timeOrders) {
        setTotal(getTotal()) 
      }
    }, [orders, timeOrders, currentSession])
    
    useEffect(()=>{
      axios.get(`/products`, {withCredentials:true})
      .then(({data})=> setProducts(data.products))

      currentSession&& axios.get(`/orders/${currentSession.id}`, {withCredentials: true})
      .then(({data})=>{
        setOrders(data.arrangedOrders)
        setTimeOrders(data.timeOrders)
      })

      devices&& setFreeDevices(devices.filter((dev, i )=> dev.status === false))

    },[currentSession, devices])
    
    useEffect(()=>{
      if(timeOrders){
        let arr = []
        setTimes([])
        timeOrders.map((order)=>{
          let time = Math.floor((new Date(order.end_at).getTime() - new Date(order.start_at).getTime()) /1000)
          const hours = Math.floor(time / (60*60))
          const minutes = Math.floor(time/(60)) % 60
          const seconds = time % 60
  
          let strHours = hours>9? hours : `0${hours}`
          let strMinutes = minutes>9? minutes : `0${minutes}`
          let strSeconds = seconds>9? seconds : `0${seconds}`
  
          let timeString = (`${strHours}:${strMinutes}:${strSeconds}`)
          arr.push({...order, timeString})
        })
        setTimes(arr)
      }
    },[timeOrders])


  const addOrderHandler = (e)=>{
    e.preventDefault()
    let product_id = document.getElementById('selectProduct').value
    let quantity = document.getElementById('orderQuantity').value
    if(product_id && quantity){
      axios.post(`/orders/${currentSession.id}`, {product_id, quantity})
      .then(({data})=>{
        if(data.message){
          data.success? toast.success(data.message) : toast.error(data.message)
        }
      })
    }else toast.error("برجاء إدخال كل البيانات")
  }

  const endSessionHandler = (e)=>{
    e.preventDefault()
    axios.delete(`/sessions/${currentSession.id}`, {withCredentials: true})
      .then(({data})=>{
          if(data.message){
              data.success? toast.success(data.message) : toast.error(data.message)
              setTrigger(!trigger)
          }
      })
      .catch(err=>(err))
    }
    
    const changeDeviceHandler = ()=>{
      let toDevice = document.getElementById('changeDevice').value;
      axios.put(`/sessions/change-device/${currentSession.id}`, {toDevice}, {withCredentials: true})
      .then(({data})=>{
        if(data.message) data.success? toast.success(data.message) : toast.error(data.message);
          setShowDetails(false)
          
          setTrigger(!trigger)
      })
    }
    
    const changePlayTypeHandler = () =>{
      let play_type = document.getElementById('changePlayType').value;
      axios.put(`/sessions/play-type/${currentSession.id}`, {play_type}, {withCredentials: true})
      .then(({data})=>{
        if(data.message) data.success? toast.success(data.message) : toast.error(data.message);
        setTrigger(!trigger)
        setRefresh(true)
        setShowDetails(false)
      })
    }

  return (
    <div dir='rtl' className="text-center grid grid-cols-3 p-8 gap-8 fixed z-[102] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-md rounded-lg " style={{gridAutoRows: '180px 290px'}}>
        <div className="flex flex-col">

          <h2 className="text-lg font-semibold text-gray-800">الوقت</h2>

          <div className="flex flex-col justify-end flex-grow ">
            <div className="text-3xl font-bold text-black">{clock}</div>
            <p className="text-xl font-bold mt-4 text-red-600">{total?.currentTimeCost}<span className='tracking-widest font-noto my-2'>ج</span></p>

            <div className='flex justify-center gap-6 mt-2'>
              <div className='text-md font-medium border-b-4 pb-1 border-gray-600'>{currentSession?.play_type === "multi"? "ملتي" : "سنجل" }</div>
              <div className='text-md font-medium border-b-4 pb-1 border-gray-600'>{currentSession?.time_type === "open"? "مفتوح" : "وقت"}</div>
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
              <p>{total?.timeCost}<span className='font-bold tracking-widest font-noto'>ج</span></p>
            </div>
          </div>
          <div>
            
            <p className="text-xl font-bold text-blue-700">الاجمالي</p>
            <p className='text-xl font-bold text-blue-700'>{total?.final}<span className=' font-bold tracking-widest font-noto'>ج</span></p>
          </div>
          <button id={currentSession?.id} onClick={endSessionHandler} className='p-2 mt-auto bg-red-700 text-white rounded hover:bg-red-600 duration-150'>إنهاء الوقت</button>
        </div>
        

        <div className="flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">اعدادات الجهاز</h2>
          <p className='mb-2'>تغيير نوع اللعب</p>
          <select
            id="changePlayType"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
          >
            <option value="single">سنجل</option>
            <option value="multi">ملتي</option>
          </select>
          <button
            onClick={changePlayTypeHandler} 
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            تغيير
          </button>
          <p className='my-2'>نقل الجهاز</p>
          <select
            id="changeDevice"
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md"
          >
            {freeDevices?.map((dev, i)=>
              <option key={i} value={dev.id}>جهاز {dev.name}</option>
          )}
          
          </select>
          <button
            onClick={changeDeviceHandler} 
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            نقل
          </button>
        </div>

        <div className='flex flex-col col-start-1 row-start-1 row-end-2 h-auto'>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">الطلبات</h2>
          {orders?.length>0?
          <ul className='mt-2 overflow-y-scroll shadow-inner bg-gray-100 mt-2'>
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
        <div className='flex flex-col col-start-1 row-start-2 row-end-3 h-auto'>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">اجمالي الوقت</h2>
            {times?.length>0?
          <ul className='overflow-y-scroll shadow-inner bg-gray-100 mt-2 py-2'>
            {times?.map((order, index) => (
              <li key={index} className="flex flex-end px-4">
                <span className="ml-auto">{order.timeString}</span> 
                <span className="mr-auto">{order.cost}ج</span>
              </li>
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
