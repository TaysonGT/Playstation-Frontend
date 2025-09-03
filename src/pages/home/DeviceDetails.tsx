import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IDevice, IOrder, ITimeOrder } from './types';
import { IProduct } from '../stock/types';
import { useDevices } from '../../context/DeviceContext';
import { fetchOrders } from '../../api/devices';

interface Props {
  device: IDevice,
  clock: string,
}

interface ITotalCost {
  overall: number, 
  ordersCost: number, 
  timeCost: number, 
  currentTimeCost: number
}

const DeviceDetails:React.FC<Props> = ({device, clock}) => {
    const [orders, setOrders] = useState<IOrder[]>([])
    const [timeOrders, setTimeOrders] = useState<ITimeOrder[]>([])

    const [total, setTotal] = useState<ITotalCost>({overall:0 , ordersCost: 0, timeCost: 0, currentTimeCost: 0})

    const [products, setProducts] = useState<IProduct[]>([])
    const [freeDevices, setFreeDevices] = useState<IDevice[]>([])
    const [selectedPlayType, setSelectedPlayType] = useState<string>(device.session.play_type)
    const [selectedTransfer, setSelectedTransfer] = useState<string|null>()
    
    const [orderProduct, setOrderProduct] = useState<string>()
    const [orderQuantity, setOrderQuantity] = useState<number>(0)

    const {devices, newOrder, endSession, changePlayType, transferSession} = useDevices()

    const refetchOrders = ()=>{
      fetchOrders(device.session.id)
      .then(({data})=> {
        setOrders(data.arrangedOrders)
        setTimeOrders(data.timeOrders)
        setTotal(getTotal(data.arrangedOrders, data.timeOrders))
      })
    }

    const getTotal = (orders: IOrder[], timeOrders: ITimeOrder[]):ITotalCost=>{
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
      if(device.session.time_type === "time" && new Date(device.session.ended_at) < new Date() ) {
        time = (new Date(device.session.ended_at).getTime() - new Date(device.session.started_at).getTime()) / (1000 * 60 * 60);
      } else time = (Date.now() - new Date(device.session.started_at).getTime()) / (1000 * 60 * 60)
      
      device.session.play_type==="multi" ? 
        currentTimeCost = Math.ceil(time * device.type.multi_price )
        : currentTimeCost = Math.ceil(time * device.type.single_price) 
      
      timeCost += currentTimeCost;
      const overall = timeCost + ordersCost;
      return {overall, ordersCost, timeCost, currentTimeCost}
    }

    useEffect(()=>{
      axios.get(`/products`, {withCredentials:true})
      .then(({data})=> setProducts(data.products))
      
      device.session&& refetchOrders()

      if(devices){
        const free = devices.filter((dev)=> (dev.status === false&&dev.id!==device.id))
        setFreeDevices(free)
        setSelectedTransfer(free[0]?.id || null)
      }

    },[devices])

  return (
    <div dir='rtl' className="text-center grid grid-cols-3 p-8 gap-8 fixed z-[102] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-md rounded-lg lg:w-auto w-[90vw]" style={{gridAutoRows: '180px 290px'}}>
        <div className="flex flex-col">

          <h2 className="text-lg font-semibold text-gray-800">الوقت</h2>

          <div className="flex flex-col justify-end flex-grow ">
            <div className="text-3xl font-bold text-black">{clock}</div>
            <p className="text-xl font-bold mt-4 text-red-600">{total?.currentTimeCost}<span className='tracking-widest font-noto my-2'>ج</span></p>

            <div className='flex justify-center gap-6 mt-2'>
              <div className='text-md font-medium border-b-4 pb-1 border-gray-600'>{device.session.play_type === "multi"? "ملتي" : "سنجل" }</div>
              <div className='text-md font-medium border-b-4 pb-1 border-gray-600'>{device.session.time_type === "open"? "مفتوح" : "وقت"}</div>
            </div>

          </div>
          
        </div>

        <div className="flex flex-col justify-between ">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">طلب جديد</h2>
          <form>

            <select id='selectProduct'
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              onSelect={(e)=> setOrderProduct(e.currentTarget.value)}
            >
              {products?.map((product, index) => (
                <option key={index} value={product.id}>{product.name}</option>
              ))}
            </select>
            <input
              type="number"
              onInput={(e)=> setOrderQuantity(parseInt(e.currentTarget.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              placeholder="أدخل الكمية"
            />
            <button
              type='submit'
              onClick={async(e)=> {
                e.preventDefault();
                if(!orderProduct || !orderQuantity) {
                  toast.error("برجاء إدخال كل البيانات")
                  return;
                }
                await newOrder(device.session.id, orderProduct, orderQuantity)
                refetchOrders()
              }}
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
            <p className='text-xl font-bold text-blue-700'>{total?.overall}<span className=' font-bold tracking-widest font-noto'>ج</span></p>
          </div>
          <button onClick={(e)=>{
            e.preventDefault();
            endSession(device.session.id)
          }} className='p-2 mt-auto bg-red-700 text-white rounded hover:bg-red-600 duration-150'>إنهاء الوقت</button>
        </div>
        

        <div className="flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">اعدادات الجهاز</h2>
          <p className='mb-2'>تغيير نوع اللعب</p>
          <select
            onSelect={(e)=> setSelectedPlayType(e.currentTarget.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
          >
            <option value="single">سنجل</option>
            <option value="multi">ملتي</option>
          </select>
          <button
            onClick={(e)=>{
              e.preventDefault()
              changePlayType(device.session.id, selectedPlayType)
            }}
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            تغيير
          </button>
          <p className='my-2'>نقل الجهاز</p>
          <select
            onSelect={(e)=>{
              setSelectedTransfer(e.currentTarget.value)
            }}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md"
          >
            {freeDevices?.map((dev, i)=>
              <option key={i} value={dev.id}>جهاز {dev.name}</option>
          )}
          
          </select>
          <button
            onClick={(e)=>{
              e.preventDefault()
              if(!selectedTransfer) {
                toast.error("برجاء اختيار جهاز لنقل الجلسة إليه")
                return;
              }
              transferSession(device.session.id, selectedTransfer)
            }} 
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            نقل
          </button>
        </div>

        <div className='flex flex-col col-start-1 row-start-1 row-end-2 h-auto'>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">الطلبات</h2>
          {orders?.length>0?
          <ul className='mt-2 overflow-y-scroll shadow-inner bg-gray-100'>
            {orders?.map((order, index) => (
              <li key={index} className='flex justify-end px-4'>
                <span className='ml-auto'>{order.quantity}</span>
                <span className='font-semibold'>{order.product.name}</span>  
                <span className='mr-auto'>{order.cost}ج</span>
              </li>
            ))}
            </ul> : 
            <p className='text-gray-500 mt-6'>لا توجد طلبات على هذا الجهاز...</p>
            }
        </div>
        <div className='flex flex-col col-start-1 row-start-2 row-end-3 h-auto'>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">اجمالي الوقت</h2>
          {timeOrders?.length>0?
          <ul className='overflow-y-scroll shadow-inner bg-gray-100 mt-2 py-2'>
            {timeOrders?.map((order, index) => (
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
