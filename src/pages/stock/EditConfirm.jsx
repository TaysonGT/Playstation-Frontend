import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const EditConfirm = ({editProduct, setEditProduct, setEditConfirm}) => {
    const [done, setDone] = useState(false)
    const [prodName, setProdName] = useState() 
    const [quantity, setQuantity] = useState()
    const [price, setPrice] = useState()
    const [product, setProduct] = useState({})

    const editHandler = (e)=>{
        e.preventDefault()
        axios.put(`/products/${editProduct.id}`, {name: prodName, price, stock: quantity}, {withCredentials: true})
        .then(({data})=>{
            console.log(data)
            if(data.message){
                data.success ? toast.success(data.message) 
                : toast.error(data.message)
            }
            setDone(true)
        })
        .catch(err=>console.log(err))
    }

    const inputHandler = (e)=>{
        if(e.target.name=="name"){
            setProdName(e.target.value)
        }else if (e.target.name == "quantity"){
            setQuantity(e.target.value)
        }else{
            setPrice(e.target.value)
        }
    }

    useEffect(()=>{
        axios.get(`/products/${editProduct.id}`)
        .then(({data})=>setProduct(data.product))
        .catch(err=>err)
    }, [])

    useEffect(()=>{
        if(done){
            setEditConfirm(false)
            setEditProduct(null)
        }
    },[done])

  return (
    <div className='pt-8 px-16 pb-10 bg-white border-2 border-white rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[120]'>
      <h1 className='text-3xl font-bold text-black text-center'>تعديل منتج</h1>
        <form dir="rtl" action="" className='flex flex-col mt-6'>
            <label className='mt-2'>اسم المنتج</label>
            <input name="name" defaultValue={editProduct?.name} onInput={inputHandler}  className='mt-2 font-bold text-md p-2 border-2 border-gray-400' type="text" />
            <label className=' mt-4'>الكمية</label>
            <input name='quantity' defaultValue={editProduct?.stock} onInput={inputHandler} className='mt-2 font-bold text-md p-2 border-2 border-gray-400' type="number" />
            <label className=' mt-4'>السعر</label>
            <input name='price' defaultValue={editProduct?.price} onInput={inputHandler} className='mt-2 font-bold text-md p-2 border-2 border-gray-400'  type="number" />
            <div className='flex justify-between'>
                <button type='button' onClick={(e)=>{setEditConfirm(false); setEditProduct(null)}} className='bg-white border-2 border-black hover:bg-black hover:text-white duration-200 rounded p-3 px-6 mt-10 text-xl font-bold'>الغاء</button>
                <button type="submit" onClick={editHandler} className='text-white bg-indigo-500 hover:bg-indigo-300 duration-200 rounded  p-3 px-6 mt-10 text-xl font-bold'>حفظ</button>
            </div>
        </form>
    </div>
  )
}

export default EditConfirm