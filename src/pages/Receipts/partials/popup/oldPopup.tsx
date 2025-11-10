import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IProduct } from '../../../../types'
import toast from 'react-hot-toast'
import Loader from '../../../../components/Loader'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../../../i18n'
import { useConfigs } from '../../../../context/ConfigsContext'

const OrderPopup = ({hide, refetch}:{hide: ()=>void, refetch: ()=>void}) => {
  const [products, setProducts] = useState<IProduct[]>([]) 
  const [orderData, setOrderData] = useState<{product_id:string,quantity:number}[]>([]) 
  const [isLoading, setIsLoading] = useState(true)
  const {i18n, t} = useTranslation()
  const currentDirection = getDirection(i18n.language)
  const {configs} = useConfigs()

  useEffect(()=>{
    axios.get('/products', {withCredentials:true})
      .then(({data})=> {
        setProducts(data.products)
        setIsLoading(false)
      })
  },[])
  
  const inputHandler = (id: string, value: string)=>{
    setOrderData((prev)=> {
      const orders = prev.filter(p=>p.product_id !== id )
      
      if(parseInt(value)===0) return orders;
      
      return [...orders, {product_id : id, quantity: parseInt(value)}]
    })
  }

  const submitHandler = (e:React.FormEvent<HTMLElement>)=>{
    e.preventDefault()
    axios.post('/receipts/outer', {orderData}, {withCredentials: true})
      .then(({data})=> {
        if(!data.success) return toast.error(data.message)
        toast.success(data.message)
        refetch()
        hide()
      })
  }

  return (
    <div dir={currentDirection} className='text-white lg:w-100 w-[90%] bg-[#1b1b1f] py-8 px-6 border-2 border-white rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[150]'>
      <h1 className='text-2xl font-bold text-center font'>{t('receipts.addOrder')}</h1>
      <form action="" className='mt-4'>
        <ul className='text-xs'>
          <li className='bg-[#009879] font-bold text-right flex items-stretch text-nowrap'>
            <div className='p-2 px-4 flex-1'>{t('stock.product')}</div>
            <div className='p-2 flex-1'>{t('tables.quantity')}</div>
            <div className='p-2 flex-1'>{t('tables.price')}</div>
            <div className='p-2 flex-1'>{t('tables.available')}</div>
          </li>
          {isLoading? <div className='grow flex justify-center'><Loader size={40} thickness={10} color='white' /></div>
          :products.length>0? products.map((product, i)=>
            <li key={i} className={'flex border-b text-black text-md font-medium border-[#ddd] items-stretch ' + (i%2===0? 'bg-[#f3f3f3] ' : 'bg-[#e3e3e3] ')+ (i===products.length-1&&' border-b-[4px] border-[#009829]')}>
              <div className='p-2 px-4 flex-1 flex items-center '>{product.name}</div>
              <div className='p-2 flex-1 flex items-center  text-white'><input type="number" onChange={(e)=>inputHandler(product.id, e.target.value)} className="w-[50px] text-center p-1 input border-y-2 border-[#009829] bg-slate-700" defaultValue={0} /></div>
              <div className='p-2 flex-1 flex items-center  gap-1'>{product.price} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.code}</span></div>
              <div className='p-2 flex-1 flex items-center '>{product.stock}</div>
            </li>
          ): <div className='p-4 text-center'>{t('stock.noProducts')}</div>}
        </ul>
        <div className='flex items-stretch gap-4'>
          <button type='submit' onClick={submitHandler} className='bg-[#009879] flex-1 py-2 px-4 w-full rounded-sm mt-4 cursor-pointer hover:bg-[#03b18e] duration-75'>{t('receipts.order')}</button>
          <button type='submit' onClick={hide} className='bg-[#f3f3f3] text-gray-700 flex-1 py-2 px-4 w-full rounded-sm mt-4 cursor-pointer hover:bg-[#e3e3e3] duration-75'>{t('modals.cancel')}</button>
        </div>
      </form>
    </div>
  )
}

export default OrderPopup;