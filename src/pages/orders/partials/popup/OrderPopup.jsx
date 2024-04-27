import axios from 'axios'
import React, { useEffect, useState } from 'react'

const OrderPopup = ({setMessage, setSuccess, setShowPopup}) => {
  const [products, setProducts] = useState([]) 
  const [orderData, setOrderData] = useState([])
  const [inputs, setInputs] = useState([]) 

  useEffect(()=>{
    axios.get('/products', {withCredentials:true})
      .then(({data})=> {
        setProducts(data.products)
      })
  },[])

  let orders = []
  
  const inputHandler = (e)=>{
    setInputs([... document.querySelectorAll('.input')])
    setOrderData([])
    if(inputs.length>0){
      inputs.map((item)=> item.value>0&&orders.push({product_id : item.id, quantity: parseInt(item.value)}))
    }else{
      orders.push({product_id : e.target.id, quantity: parseInt(e.target.value)})
    }
    setOrderData(orders)
    
    orders = []
  }

  const submitHandler = (e)=>{
    e.preventDefault()
    axios.post('/receipts', {orderData}, {withCredentials: true})
      .then(({data})=> {
          setSuccess(data.success)
          setMessage(data.message)
          setShowPopup(false)
      })
  }

  return (
    <div className='text-white py-8 px-6 bg-[#1b1b1f] border-2 border-white rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[150]'>
      <h1 className='text-2xl font-bold text-center font'>طلب جديد</h1>
      <form action="" className='mt-4'>
        <table className='w-full border-collapse text-[.9rem] min-w-[400px] rounded-md overflow-hidden'>
          <thead className=''>
            <tr className='bg-[#009879] font-bold text-right'>
              <th className='px-[15px] py-[12px]'>اسم المنتج</th>
              <th className='px-[15px] py-[12px]'>الكمية</th>
              <th className='px-[15px] py-[12px]'>السعر</th>
              <th className='px-[15px] py-[12px]'>المتاح</th>
            </tr>
          </thead>
          <tbody className='text-black'>
        {products.map((product, i)=>
          <tr key={i} className={'border-b text-md font-medium border-[#ddd] ' + (i%2==0? 'bg-[#f3f3f3] ' : 'bg-[#e3e3e3] ')+ (i==products.length-1&&' border-b-[4px] border-[#009829]')}>
            <td className='px-[15px] py-[12px]'>{product.name}</td>
            <td className='px-[15px] py-[12px] text-white'><input type="number" id={product.name} onInput={(e)=>inputHandler(e)} className="w-[50px] text-center p-1 input border-y-2 border-[#009829] bg-slate-700 text-wh ite" defaultValue={0} /></td>
            <td className='px-[15px] py-[12px]'>{product.price}</td>
            <td className='px-[15px] py-[12px]'>{product.stock}</td>
          </tr>
          )}
          </tbody>
        </table>
        <button type='submit' onClick={submitHandler} className='bg-[#009879] py-2 px-4 rounded-sm mt-4'>طلب</button>
      </form>
    </div>
  )
}

export default OrderPopup;