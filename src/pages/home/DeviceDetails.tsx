import axios from 'axios';
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IProduct, IDevice, IOrder, ITimeOrder } from '../../types';
import { useDevices } from '../../context/DeviceContext';
import { fetchOrders } from '../../api/devices';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getDirection } from '../../i18n';
import { useConfigs } from '../../context/ConfigsContext';

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
    const [searchParams, setSearchParams] = useSearchParams()
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);

    const [total, setTotal] = useState<ITotalCost>({overall:0 , ordersCost: 0, timeCost: 0, currentTimeCost: 0})
    const [products, setProducts] = useState<IProduct[]>([])
    const [freeDevices, setFreeDevices] = useState<IDevice[]>([])
    const [selectedPlayType, setSelectedPlayType] = useState<string>(device.session.play_type)
    const [selectedTransfer, setSelectedTransfer] = useState<string|null>()
    
    const [orderProduct, setOrderProduct] = useState<string>()
    const [orderQuantity, setOrderQuantity] = useState<number>(0)

    const {devices, newOrder, endSession, changePlayType, transferSession} = useDevices()

    const {configs} = useConfigs()

    const addOrderHandler = async(e:FormEvent<HTMLFormElement>)=> {
      e.preventDefault();
      if(!orderProduct || !orderQuantity) {
        toast.error("برجاء إدخال كل البيانات")
        return;
      }
      setOrderQuantity(0)
      await newOrder(device.session.id, orderProduct, orderQuantity)
      refetchOrders()
    }

    const transferHandler = async(e:React.MouseEvent<HTMLButtonElement>)=>{
      e.preventDefault()
      if(!selectedTransfer) {
        toast.error("برجاء اختيار جهاز لنقل الجلسة إليه")
        return;
      }
      await transferSession(device.session.id, selectedTransfer)
      searchParams.delete('selected')
      setSearchParams(searchParams)
    }

    const changePlayTypeHandler = async(e: React.MouseEvent<HTMLButtonElement>)=>{
      e.preventDefault()
      await changePlayType(device.session.id, selectedPlayType)
    }

    const refetchOrders = ()=>{
      fetchOrders(device.session.id)
      .then(({data})=> {
        setOrders(data.orders)
        setTimeOrders(data.time_orders)
        setTotal(getTotal(data.orders, data.time_orders))
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
      .then(({data})=> {
        setProducts(data.products)
        setOrderProduct(data.products[0]?.id||undefined)
      })
      
      device.session&& refetchOrders()

      if(devices){
        const free = devices.filter((dev)=> (dev.status === false&&dev.id!==device.id))
        setFreeDevices(free)
        setSelectedTransfer(free[0]?.id || null)
      }

    },[devices])

  return (
    <div dir={currentDirection} className="text-center grid grid-cols-3 p-8 gap-8 fixed z-[102] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-md rounded-lg lg:w-auto w-[90vw]" style={{gridAutoRows: '180px 290px'}}>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800">{t('devices.time')}</h2>
          <div className="flex flex-col justify-end flex-grow ">
            <div className="text-3xl font-bold text-black">{clock}</div>
            <p className="text-xl font-bold mt-4 text-red-600">{total?.currentTimeCost} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></p>
            <div className='flex justify-center gap-6 mt-2'>
              <div className='text-md font-medium border-b-4 pb-1 border-gray-600'>{device.session.play_type === "multi"? t('devices.multi') : t('devices.single') }</div>
              <div className='text-md font-medium border-b-4 pb-1 border-gray-600'>{device.session.time_type === "open"? t('devices.open') : t('devices.time')}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between ">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">{t('devices.addOrder')}</h2>
          <form onSubmit={addOrderHandler}>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              onChange={(e)=> setOrderProduct(e.currentTarget.value)}
            >
              {products?.map((product, index) => (
                <option key={index} value={product.id}>{product.name}</option>
              ))}
            </select>
            <input
              type="number"
              value={orderQuantity>0? orderQuantity: ''}
              onInput={(e)=> setOrderQuantity(parseInt(e.currentTarget.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              placeholder={t('receipts.typeQuantity')}
            />
            <button
              type='submit'
              className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800"
            >
              {t('modals.add')}
            </button>
          </form>
        </div>
        <div className="flex flex-col justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{t('devices.checkout')}</h2>
          <div className='flex flex-col grow items-center justify-center'>
            <div className='flex justify-center gap-8  py-4'>
              <div>
                <p className='font-semibold'>{t('devices.orders')}</p>
                {total?.ordersCost>0? <p> {total.ordersCost} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></p> : <p>--</p>}
              </div>

              <div>
                <p className='font-semibold'>{t('devices.time')}</p>
                <p>{total?.timeCost} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></p>
              </div>
            </div>
            <p className="text-xl font-bold mt-4 text-blue-700">{t('tables.total')}</p>
            <p className='text-xl font-bold text-blue-700'>{total?.overall} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></p>
          </div>
          <button onClick={async(e)=>{
            e.preventDefault();
            await endSession(device.session.id)
            searchParams.delete('selected')
            setSearchParams(searchParams)
          }} className='p-2 mt-auto bg-red-700 text-white rounded hover:bg-red-600 duration-150'>{t('devices.endSession')}</button>
        </div>
        

        <div className="flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">{t('devices.sessionSettings')}</h2>
          <p className='mb-2'>{t('devices.changePlayType')}</p>
          <select
            onChange={(e)=> setSelectedPlayType(e.currentTarget.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
          >
            <option value="single">{t('devices.single')}</option>
            <option value="multi">{t('devices.multi')}</option>
          </select>
          <button
            onClick={changePlayTypeHandler}
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            {t('modals.change')}
          </button>
          <p className='my-2'>{t('devices.transferSession')}</p>
          <select
            onChange={(e)=>{
              setSelectedTransfer(e.currentTarget.value)
            }}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md"
          >
            {freeDevices?.map((dev, i)=>
              <option key={i} value={dev.id}>{t('tables.device')} {dev.name}</option>
          )}
          </select>
          <button
            onClick={transferHandler} 
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            {t('devices.transfer')}
          </button>
        </div>

        <div className='flex flex-col col-start-1 row-start-1 row-end-2 h-auto'>
          <h2 className="text-lg font-semibold text-gray-800">{t('devices.orders')}</h2>
          {orders?.length>0?
          <ul className='mt-4 grow overflow-y-auto shadow-inner bg-gray-100'>
            <li className='flex basis-0 text-xs justify-end pt-2 pb-1 border-b border-gray-200'>
              <div className='flex-1 text-center font-semibold'>{t('tables.quantity')}</div>
              <div className='flex-1 text-center font-semibold'>{t('stock.product')}</div>
              <div className='flex-1 text-center font-semibold'>{t('receipts.cost')}</div>
            </li>
            {orders?.map((order, index) => (
              <li key={index} className='flex basis-0 text-sm justify-end py-1'>
                <div className='flex-1 text-center'>{order.quantity}</div>
                <div className='flex-1 text-center'>{order.product?.name}</div>
                <div className='flex-1 text-center'>{order.cost} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></div>
              </li>
            ))}
            </ul> : 
            <div className='flex flex-col justify-center items-center grow'>
              <p className='text-gray-500 mt-6'>{t('devices.noOrders')}...</p>
            </div>
            }
        </div>
        <div className='flex flex-col col-start-1 row-start-2 row-end-3 h-auto'>
          <h2 className="text-lg font-semibold text-gray-800">{t('devices.totalTime')}</h2>
          {timeOrders?.length>0?
          <ul className='mt-4 overflow-y-auto grow shadow-inner bg-gray-100'>
            <li className='flex basis-0 text-xs justify-end pt-2 pb-1 border-b border-gray-200'>
              <div className='flex-1 text-center font-semibold'>{t('tables.device')}</div> 
              <div className='flex-1 text-center font-semibold'>{t('tables.time')}</div>
              <div className='flex-1 text-center font-semibold'>{t('receipts.cost')}</div>
            </li>
            {timeOrders?.map((order, index) => (
              <li key={index} className='flex basis-0 text-sm justify-end py-1'>
                <span className="flex-1 text-center">{order.device?.name}</span> 
                <span className="flex-1 text-center font-semibold">{order.time}</span>
                <span className="flex-1 text-center">{order.cost} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></span>
              </li>
            ))}
            </ul>
            :
            <div className='flex flex-col justify-center items-center grow'>
              <p className='text-gray-500 mt-6'>{t('devices.noTimeOrders')}...</p>
            </div>

            }
        </div>

    </div>
  );
};

export default DeviceDetails;
