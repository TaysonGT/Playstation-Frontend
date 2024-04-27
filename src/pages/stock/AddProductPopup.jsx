import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const AddProductPopup = ({setMessage, setShowPopup, setSuccess}) => {
        
    const [stock, setStock ] = useState()
    const [name, setName ] = useState()
    const [price, setPrice ] = useState()

    const inputHandler = (e)=>{
        if(e.target.name == "name"){
          setName(e.target.value) 
        }else if(e.target.name == "quantity"){
          setStock(e.target.value)
        }else{
          setPrice(e.target.value)
        }
    }

    const addHandler = (e)=>{
      e.preventDefault();
      axios.post('/products', {stock, name, price})
      .then(({data})=> {
        if(data.message){
          data.success? toast.success(data.message) : toast.error(data.message)
          setShowPopup(false)
        }
      })
    }
    
  return (
    <div className='pt-8 px-16 pb-10 bg-[#1b1b1f] border-2 border-white rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[120]'>
      <h1 className='text-3xl font-bold text-white text-center'>إضافة منتج</h1>
        <form dir="rtl" action="" className='flex flex-col mt-6'>
            <label className='text-white mt-2'>اسم المنتج</label>
            <input name="name" onInput={inputHandler}  className='mt-2 font-bold text-md p-2' type="text" />
            <label className='text-white mt-4'>الكمية</label>
            <input name='quantity' onInput={inputHandler} className='mt-2 font-bold text-md p-2' type="number" />
            <label className='text-white mt-4'>السعر</label>
            <input name='price' onInput={inputHandler} className='mt-2 font-bold text-md p-2'  type="number" />
            <button onClick={addHandler} className='bg-white hover:bg-indigo-200 duration-200 rounded p-3 mt-10 text-xl font-bold'>إضافة</button>
        </form>
    </div>
  )
}
export default AddProductPopup