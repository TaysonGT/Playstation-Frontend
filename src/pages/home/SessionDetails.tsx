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
import Loader from '../../components/Loader';
import { MdClose } from 'react-icons/md';
import { getStringTime } from './DeviceCard';

interface Props {
  device: IDevice,
  clock: number,
  hide: ()=>void
}

interface ITotalCost {
  overall: number, 
  ordersCost: number, 
  totalTimeCost: number, 
  currentTimeCost: number,
}

const SessionDetails:React.FC<Props> = ({device, clock, hide}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [orders, setOrders] = useState<IOrder[]>([])
    const [timeOrders, setTimeOrders] = useState<ITimeOrder[]>([])
    const [previousTime, setPreviousTime] = useState(0)
    const [searchParams, setSearchParams] = useSearchParams()
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);

    const [total, setTotal] = useState<ITotalCost>({overall:0 , ordersCost: 0, totalTimeCost: 0, currentTimeCost: 0})
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

    const refetchOrders = async()=>{
      setIsLoading(true)
      await fetchOrders(device.session.id)
      .then(({data})=> {
        setOrders(data.orders)
        setTimeOrders(data.time_orders)
        setTotal(getTotal(data.orders, data.time_orders))
      }).finally(()=>setIsLoading(false))
    }

    const getTotal = (orders: IOrder[], timeOrders: ITimeOrder[]):ITotalCost=>{

      const ordersCost = orders.reduce((total, order)=> total + order.cost,0)

      const previousTimeCost = timeOrders.reduce((total, order)=>total+order.cost,0)
      
      let time = null;
      let currentTimeCost = 0
      if(device.session.time_type === "time" && new Date(device.session.ended_at) < new Date() ) {
        time = (new Date(device.session.ended_at).getTime() - new Date(device.session.started_at).getTime()) / (1000 * 60 * 60);
      } else time = (Date.now() - new Date(device.session.started_at).getTime()) / (1000 * 60 * 60)
      
      device.session.play_type==="multi" ? 
        currentTimeCost = Math.ceil(time * device.type.multi_price )
        : currentTimeCost = Math.ceil(time * device.type.single_price) 
      
      const totalTimeCost = previousTimeCost + currentTimeCost;

      console.log({overall: totalTimeCost + ordersCost, ordersCost, totalTimeCost, currentTimeCost})
      return {overall: totalTimeCost + ordersCost, ordersCost, totalTimeCost, currentTimeCost}
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

    useEffect(()=>{
      setPreviousTime(timeOrders.reduce((total,order)=>total+Math.floor((new Date(order.ended_at).getTime() - new Date(order.started_at).getTime()) / 1000),0))
    },[timeOrders])

  return (
    <div dir={currentDirection} className="text-center fixed flex flex-col z-[102] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-md rounded-lg lg:w-auto w-[90vw]" style={{gridAutoRows: '180px 290px'}}>
      <div className='flex border-b border-gray-500 p-4'>
        <div className='flex-1 flex gap-4 items-center self-start'>
          <div className='rounded-md shadow-hard bg-indigo-700 text-white px-4 py-2 text-nowrap'>
            <p>{t('tables.device')}: <span className='font-bold'>{device.name}</span></p>
          </div>
          <div className='rounded-md shadow-hard bg-fuchsia-700 text-white px-4 py-2 text-nowrap'>
            <p>{t('tables.type')}: <span className='font-bold'>{device.type.name}</span></p>
          </div>
        </div>
        <h1 className='flex-1 font-bold text-2xl text-nowrap px-6 self-center'>{t('devices.sessionDetails')}</h1>
        <div className='flex-1 flex justify-end self-start'>
          <MdClose onClick={hide} className='text-2xl cursor-pointer text-red-500 hover:text-red-600 duration-75'/>
        </div>
      </div>
      {
        isLoading?
        <div className='grow flex justify-center items-center p-20 min-w-100'>
          <Loader size={50} thickness={10}/>
        </div>
        :
      <div className='grid grid-cols-3 gap-8 grow p-8 pt-4'>
        <div className='flex flex-col h-auto border border-[#1b1b1f]'>
          <h2 className="text-lg font-semibold border-b border-[#1b1b1f] shadow-hard text-[#1b1b1f] p-2">{t('devices.orders')}</h2>
          {orders?.length>0?
          <ul className=' grow overflow-y-auto shadow-inner bg-gray-100'>
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
            <div className='flex flex-col justify-center items-center grow px-6'>
              <p className='text-gray-500'>{t('devices.noOrders')}...</p>
            </div>
            }
        </div>
        <div className="flex flex-col border border-[#1b1b1f]">
          <h2 className="text-lg font-semibold border-b border-[#1b1b1f] shadow-hard text-[#1b1b1f] p-2">{t('devices.time')}</h2>
          <div className="flex flex-col justify-end flex-grow p-4">
            <div className={'w-full p-4 text-center text-3xl font-bold bg-[#212121] text-white bg-center bg-cover border-emerald-50 border rounded  ' + (device.session?.time_type === "open"? 'text-red-500' :  'text-green-500')}>{clock? getStringTime(clock): <div className='w-full flex justify-center'><Loader size={30} color='white' thickness={5}/></div>}</div>
            <p className="text-2xl font-bold mt-4 text-indigo-700">{total?.currentTimeCost} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></p>
            <div className='flex justify-center gap-6 mt-4'>
              <div className='text-md font-medium border-b-4 pb-1 border-gray-600'>{device.session.play_type === "multi"? t('devices.multi') : t('devices.single') }</div>
              <div className='text-md font-medium border-b-4 pb-1 border-gray-600'>{device.session.time_type === "open"? t('devices.open') : t('devices.time')}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col border border-[#1b1b1f] justify-between ">
          <h2 className="text-lg font-semibold border-b border-[#1b1b1f] shadow-hard text-[#1b1b1f] p-2">{t('receipts.addOrder')}</h2>
          <form onSubmit={addOrderHandler} className='grow flex flex-col p-4'>
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
              className="w-full bg-gray-700 text-white py-2 px-4 rounded-md mt-auto hover:bg-gray-800"
            >
              {t('modals.add')}
            </button>
          </form>
        </div>

        <div className='flex flex-col border border-[#1b1b1f] h-auto'>
          <h2 className="text-lg font-semibold border-b border-[#1b1b1f] shadow-hard text-[#1b1b1f] p-2">{t('devices.sessions')}</h2>
          {timeOrders?.length>0?
          <>
            <div className='bg-gray-100 overflow-y-auto grow shadow-inner'>
              <table>
                <thead>
                  <tr className='text-xs border-b border-gray-200'>
                    <th className='text-center p-2 font-semibold'>{t('tables.device')}</th> 
                    <th className='text-center p-2 font-semibold'>{t('devices.playType')}</th> 
                    <th className='text-center p-2 font-semibold'>{t('tables.time')}</th>
                    <th className='text-center p-2 font-semibold'>{t('receipts.cost')}</th>
                  </tr>
                </thead>
                <tbody>
                  {timeOrders?.map((order, index) => (
                    <tr key={index} className='text-sm'>
                      <td className="text-center p-2">{order.device?.name}</td> 
                      <td className="text-center p-2 font-semibold">{order.play_type}</td>
                      <td className="text-center p-2 font-semibold">{order.time}</td>
                      <td className="text-center p-2">{order.cost} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='flex items-stretch font-bold border-t'>
              <div className='p-2 text-xs flex items-center'>{t('devices.totalTime')}</div>
              <div className='p-2 text-center grow text-lg bg-[#1b1a29] text-white'>{clock? getStringTime(clock+previousTime): <div className='w-full flex justify-center'><Loader size={30} color='white' thickness={5}/></div>}</div>
            </div>
          </>
            :
          <div className='flex flex-col justify-center items-center grow px-6'>
            <p className='text-gray-500'>{t('devices.noTimeOrders')}...</p>
          </div>
          }
        </div>

        <div className="flex flex-col border border-[#1b1b1f] rounded-sm">
          <h2 className="text-lg font-semibold border-b border-[#1b1b1f] shadow-hard text-[#1b1b1f] p-2">{t('devices.checkout')}</h2>
          <div className='flex flex-col grow items-center justify-center px-4'>
            <div className='flex w-full gap-2'>
              <div className='flex-1 shadow-hard border-[#1b1b1f] border px-3 py-2'>
                <p className='font-semibold'>{t('devices.orders')}</p>
                <p className='text-nowrap'>{total?.ordersCost||0} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></p>
              </div>

              <div className='flex-1 shadow-hard border-[#1b1b1f] border px-3 py-2'>
                <p className='font-semibold'>{t('devices.time')}</p>
                <p className='text-nowrap'>{total?.totalTimeCost||0} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></p>
              </div>
            </div>
            <div className='shadow-hard border-[#1b1b1f] border p-4 mt-4 w-full'>
              <p className="text-xl font-bold text-[#1b1b1f]">{t('tables.total')}</p>
              <p className='text-2xl mt-2 font-bold text-indigo-700'>{total?.overall} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></p>
            </div>
          </div>
          <button onClick={async(e)=>{
            e.preventDefault();
            await endSession(device.session.id)
            searchParams.delete('selected')
            setSearchParams(searchParams)
          }} className='p-2 bg-red-700 mx-4 mb-4 text-white rounded hover:bg-red-600 duration-150'>{t('devices.endSession')}</button>
        </div>
        
        <div className="flex flex-col border border-[#1b1b1f] justify-between">
          <h2 className="text-lg font-semibold border-b border-[#1b1b1f] shadow-hard text-[#1b1b1f] p-2">{t('devices.sessionSettings')}</h2>
          <div className='flex flex-col justify-between gap-6 grow p-4'>
            <div>
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
            </div>
            <div className=''>
              <p className='mb-2'>{t('devices.transferSession')}</p>
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
          </div>
        </div>

      </div>
      }
    </div>
  );
};

export default SessionDetails;
