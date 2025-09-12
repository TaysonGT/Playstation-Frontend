import React, { useState } from 'react'
import { IProduct, ProductPayload } from '../../types'

interface Props {
    onCancel: ()=> void,
    onEdit: (id: string, payload: ProductPayload)=> void 
    product: IProduct
}

const EditProductDialogue: React.FC<Props> = ({onEdit, product, onCancel}) => {
    const [form, setForm] = useState<ProductPayload>({}) 

    const inputHandler = (e: React.InputEvent<HTMLInputElement>)=>{
        setForm((prev)=> ({...prev, [e.currentTarget.name]: 
            e.currentTarget.name === "name"? 
                e.currentTarget.value 
                : parseInt(e.currentTarget.value)
        }))
    }
    
  return (
    <div dir='rtl' className='pt-8 px-16 pb-10 bg-white border-2 border-white rounded-lg fixed top-1/2 left-1/2 -translate-1/2 z-[120]'>
      <h1 className='text-3xl font-bold text-black text-center'>تعديل منتج</h1>
        <form action="" className='flex flex-col mt-6'>
            <label className='mt-2'>اسم المنتج</label>
            <input name="name" defaultValue={product?.name} onInput={inputHandler}  className='mt-2 font-bold text-md p-2 border-2 border-gray-400' type="text" />
            <label className=' mt-4'>الكمية</label>
            <input name='quantity' defaultValue={product?.stock} onInput={inputHandler} className='mt-2 font-bold text-md p-2 border-2 border-gray-400' type="number" />
            <label className=' mt-4'>السعر</label>
            <input name='price' defaultValue={product?.price} onInput={inputHandler} className='mt-2 font-bold text-md p-2 border-2 border-gray-400'  type="number" />
            <div className='flex justify-between'>
                <button type='button' onClick={()=>onCancel} className='bg-white border-2 border-black hover:bg-black hover:text-white duration-200 rounded p-3 px-6 mt-10 text-xl font-bold'>الغاء</button>
                <button type="submit" onClick={(e)=> {
                    e.preventDefault()
                    onEdit(product.id, form)
                }} className='text-white bg-indigo-500 hover:bg-indigo-300 duration-200 rounded  p-3 px-6 mt-10 text-xl font-bold'>حفظ</button>
            </div>
        </form>
    </div>
  )
}

export default EditProductDialogue