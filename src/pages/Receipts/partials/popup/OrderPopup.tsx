import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IProduct } from '../../../../types'
import toast from 'react-hot-toast'
import Loader from '../../../../components/Loader'

const OrderPopup = ({hide, refetch}:{hide: ()=>void, refetch: ()=>void}) => {
  const [products, setProducts] = useState<IProduct[]>([]) 
  const [orderData, setOrderData] = useState<{product_id:string,quantity:number}[]>([]) 
  const [isLoading, setIsLoading] = useState(true)

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
    <div className='text-white py-8 px-6 bg-[#1b1b1f] border-2 border-white rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[150]'>
      <h1 className='text-2xl font-bold text-center font'>طلب جديد</h1>
      <form action="" className='mt-4'>
        <div className='text-xs rounded-md '>
          <ul className=''>
            <li className='bg-[#009879] font-bold text-right flex items-stretch text-nowrap'>
              <div className='px-[15px] py-[12px] flex-2/5'>اسم المنتج</div>
              <div className='px-[15px] py-[12px] flex-1/5'>الكمية</div>
              <div className='px-[15px] py-[12px] flex-1/5'>السعر</div>
              <div className='px-[15px] py-[12px] flex-1/5'>المتاح</div>
            </li>
          </ul>
          <ul className='text-black'>
          {isLoading? <div className='grow flex justify-center'><Loader size={40} thickness={10} color='white' /></div>
          :products.length>0? products.map((product, i)=>
            <li key={i} className={'flex border-b text-md font-medium border-[#ddd] items-stretch ' + (i%2===0? 'bg-[#f3f3f3] ' : 'bg-[#e3e3e3] ')+ (i===products.length-1&&' border-b-[4px] border-[#009829]')}>
              <div className='px-[15px] py-[12px] flex flex-2/5 items-center'>{product.name}</div>
              <div className='px-[15px] py-[12px] flex-1/5 flex items-center text-white'><input type="number" onChange={(e)=>inputHandler(product.id, e.target.value)} className="w-[50px] text-center p-1 input border-y-2 border-[#009829] bg-slate-700" defaultValue={0} /></div>
              <div className='px-[15px] py-[12px] flex-1/5 flex items-center'>{product.price}</div>
              <div className='px-[15px] py-[12px] flex-1/5 flex items-center'>{product.stock}</div>
            </li>
          ): <div className='p-4 text-center'>لا يوجد منتجات</div>}
          </ul>
        </div>
        <button type='submit' onClick={submitHandler} className='bg-[#009879] py-2 px-4 rounded-sm mt-4 cursor-pointer'>طلب</button>
      </form>
    </div>
  )
}

export default OrderPopup;