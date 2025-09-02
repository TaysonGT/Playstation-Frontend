import React, { useState } from 'react'
import { ProductPayload } from './types'
import toast from 'react-hot-toast'

interface Props{
  onCancel: ()=> void,
  onCreate: (payload: ProductPayload)=> void
}

const CreateProductDialogue: React.FC<Props> = ({onCancel, onCreate}) => {
    const [form, setForm] = useState<ProductPayload>()

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>)=>{
      setForm((prev)=> ({...prev, [e.target.name]: 
          e.target.name === "name"? 
            e.target.value
            : parseInt(e.target.value)
      }))
    }

  return (
    <div dir='rtl' className="fixed left-1/2 top-1/2 -translate-1/2 z-102 bg-white rounded-md p-8">
      <h2 className="text-lg text-center font-bold mb-4">اضافة منتج جديد</h2>
      <form className='mt-6'>
        <div className="mb-4">
          <label className="block  mb-1">اسم المنتج:</label>
          <input
            name="name"
            type="text"
            placeholder='مثلا: Coffee, Moro، Pepsi'
            onInput={inputHandler}
            className="border px-3 py-2 w-64"
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="block  mb-1">الكمية:</label>
          <input
            name="stock"
            type="number"
            onInput={inputHandler}
            className="border px-3 py-2 w-64"
          />
        </div>
        <div className="mb-4">
          <label className="block  mb-1">السعر:</label>
          <input
            name="price"
            type="number"
            onInput={inputHandler}
            className="border px-3 py-2 w-64"
          />
        </div>
        <div className='flex gap-2 font-slim text-sm items-stretch mt-6'>
          <button type='button' onClick={()=>onCancel()} className='bg-white flex-1/2 border border-black hover:bg-black hover:text-white duration-200 rounded p-3'>الغاء</button>
          <button type="submit" onClick={(e)=> {
              e.preventDefault()
              form? onCreate(form) 
              : toast.error('برجاء ملء كل البيانات')
          }} className='text-white flex-1/2 bg-indigo-500 hover:bg-indigo-300 duration-200 rounded p-3'>إضافة</button>
        </div>
      </form>
    </div>
  )
}
export default CreateProductDialogue