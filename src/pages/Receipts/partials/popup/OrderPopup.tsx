import React, { useEffect, useState } from 'react'
import { IOrder, IProduct } from '../../../../types'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../../../i18n'
import { useConfigs } from '../../../../context/ConfigsContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { MdClose, MdDelete } from 'react-icons/md'
import Loader from '../../../../components/Loader'

const OrderModal = ({refetch,hide}:{refetch: ()=>void, hide:()=>void}) => {
  const [products, setProducts] = useState<IProduct[]>([]) 
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<IOrder[]>([])
  const {i18n, t} = useTranslation()
  const currentDirection = getDirection(i18n.language)
  const {configs} = useConfigs()
  const [orderProduct, setOrderProduct] = useState('')
  const [orderQuantity, setOrderQuantity] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(()=>{
    axios.get('/products', {withCredentials:true})
      .then(({data})=> {
        setProducts(data.products)
        setOrderProduct(data.products[0]?.id||'')
        setIsLoading(false)
      })
  },[])

  useEffect(()=>{
    if(orders.length===0) return;
    const total = orders.reduce((total, order)=>order.product.price*order.quantity+total,0)
    setTotal(total)
  },[orders])
  
  const submitHandler = (e:React.FormEvent<HTMLElement>)=>{
    e.preventDefault()
    axios.post('/receipts/outer', {orders})
      .then(({data})=> {
        if(!data.success) return toast.error(data.message)
        toast.success(data.message)
        refetch()
        hide()
      })
  }

  const addToOrder = (e: React.FormEvent<HTMLElement>)=>{
    e.preventDefault()
    const product = products.find(p=>p.id===orderProduct)
    if(!product){
        return toast.error('لم يتم اختيار منتج')
    }
    if(!orderQuantity) return toast.error('من فضلك أدخل الكمية المطلوبة')
    const exists = orders.find((o)=>o.product.id===product.id)
    
    const quantity = orderQuantity+(exists?exists.quantity:0)
    const cost = quantity*product.price 

    if(product.stock<quantity){
        return toast.error(`الكمية المتاحة: ${product.stock}`)
    }
    
    setOrders(prev=>{
        if(exists){
            return prev.map((order)=>
            {
                if(order.product.id===exists?.product.id){
                    return {...order, quantity, cost}
                }
                return order
            })
        }
        
        return [...prev, {product, quantity: orderQuantity, cost: product.price*orderQuantity}]
    })
    setOrderQuantity(0)
  }

  const inDecrement = (product_id: string, mode: 'increment'|'decrement')=>{
    setOrders(prev=>{
        const exists = prev.find((o)=>o.product.id===product_id)
        if(!exists){
            toast.error('error')
            return prev
        }

        if(mode=='increment'&&exists.product.stock<(exists.quantity+1)){
            toast.error(`الكمية المتاحة: ${exists.product.stock}`)
            return prev
        }

        return prev.map((order)=>{
            if(order.product.id===exists.product.id){
                const quantity = mode==='increment'? order.quantity+1:  order.quantity-(order.quantity>1? 1:0)
                const cost = quantity*order.product.price;
                return{...order, quantity, cost}
            }
            return order
        })
        
    })
  }

  const removeOrder = (product_id:string)=>{
    setOrders(prev=> prev.filter((order)=>order.product.id!==product_id))
  }

  return (
    <div dir={currentDirection} className='text-white lg:w-200 w-[90%] bg-[#1b1b1f] py-8 px-6 border-2 border-white rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[150]'>
      <div className='flex items-start'>
        <div className='flex-1'/>
        <h1 className='text-2xl font-bold text-center font'>{t('receipts.addOrder')}</h1>
        <div className='flex-1 flex justify-end text-3xl'>
            <MdClose onClick={hide} className='text-red-500 hover:text-red-400 cursor-pointer'/>
        </div>
      </div>
      <div className='flex gap-4 mt-6 items-stretch'>
        {isLoading?
            <div className='flex-1 flex justify-center items-center py-6'>
                <Loader color='white' size={50} thickness={8}/>
            </div>
            :
        <form className='flex-1 flex flex-col' onSubmit={addToOrder}>
            <p className='mt-4 mb-2'>{t('stock.product')}</p>
            <div className='flex gap-2 items-stretch w-full mb-2'>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    onChange={(e)=> setOrderProduct(e.currentTarget.value)}
                >
                    {products?.map((product, index) => (
                    <option className='text-black' key={index} value={product.id}>{product.name}</option>
                    ))}
                </select>
                <div className={`${(products.find(p=>p.id===orderProduct)?.stock||0)>30?'bg-green-200 text-green-800':products.find(p=>p.id===orderProduct)?.stock?'bg-orange-200 text-orange-700':'bg-red-300 text-red-700'} rounded-sm border border-gray-200 flex items-center justify-center px-2 min-w-10`}>{products.find(p=>p.id===orderProduct)?.stock||0}</div>
            </div>
            <input
                type="number"
                value={orderQuantity>0? orderQuantity: ''}
                onInput={(e)=> setOrderQuantity(parseInt(e.currentTarget.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                placeholder={t('receipts.typeQuantity')}
            />
            <button
                type='submit'
                className="w-full bg-gray-700 text-white py-2 px-4 rounded-md mb-4 hover:bg-gray-800"
            >
                {t('modals.add')}
            </button>
            <button type='submit' onClick={submitHandler} className='bg-[#009879] py-2 px-4 w-full rounded-sm mt-auto cursor-pointer hover:bg-[#03b18e] duration-75'>{t('receipts.order')}</button>
        </form>
        }
        <div className='flex-1 rounded-sm text-black'>
            {orders?.length>0?
            <table className='w-full bg-white shadow-soft overflow-y-auto text-sm'>
                <thead className='text-xs'>
                    <tr className='bg-[#009879] text-white'>
                        <th className='p-2'>{t('stock.product')}</th>
                        <th className='py-2 px-4'>{t('tables.available')}</th>
                        <th className='py-2 px-4'>{t('tables.quantity')}</th>
                        <th className='py-2 px-4'>{t('receipts.cost')}</th>
                        <th className='py-2 px-4'>{t('tables.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.map((order, i)=>(
                    <tr key={i} className='not-first:border-t text-center border-gray-200 hover:bg-gray-50'>
                        <td className='p-2'>{order.product.name}</td>
                        <td className='py-2'>{order.product.stock}</td>
                        <td className='py-2'>{order.quantity}</td>
                        <td className='py-2 text-nowrap'>{order.cost.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></td>
                        <td className='py-2 px-4 flex items-center justify-center gap-2'>
                            <button onClick={()=>inDecrement(order.product.id, 'increment')} className='rounded-lg w-6 aspect-square flex items-center justify-center bg-green-500 text-white'><FaAngleUp/></button>
                            <button onClick={()=>inDecrement(order.product.id, 'decrement')} className='rounded-lg w-6 aspect-square flex items-center justify-center bg-red-500 text-white'><FaAngleDown/></button>
                            <button onClick={()=>removeOrder(order.product.id)} className='rounded-lg w-6 aspect-square flex items-center justify-center bg-red-500 text-white'><MdDelete/></button>
                        </td>
                    </tr>
                    ))}
                    <tr className='bg-white hover:bg-gray-50 border-t border-[#009879]'>
                        <td className='px-4 py-2'>
                            {t('tables.total')}
                        </td>
                        <td colSpan={4} className='p-2 text-center'>
                            {total.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            :
            <div className='flex flex-col bg-gray-200 rounded-sm justify-center items-center grow h-full px-6'>
                <p className='text-gray-500'>{t('receipts.noOrders')}...</p>
            </div>
            }
        </div>
      </div>
    </div>
  )
}

export default OrderModal