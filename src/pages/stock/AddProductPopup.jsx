import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const AddProductPopup = ({setMessage, setShowPopup, setSuccess}) => {
        
    const [stock, setStock] = useState()
    const [name, setName] = useState()
    const [price, setPrice] = useState()

    const addHandler = (e)=>{
      e.preventDefault();
      axios.post('/products', {stock, name, price}, {withCredentials:true})
      .then(({data})=> {
        if(data.message){
          data.success? toast.success(data.message) : toast.error(data.message)
          setShowPopup(false)
        }
      })
    }
    
  return (
      <div dir='rtl' className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[102] flex items-center justify-center font-medium`}>
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-lg text-center font-bold mb-4">اضافة منتج جديد</h2>
        <form className='mt-6'>
          <div className="mb-4">
            <label className="block  mb-1">اسم المنتج:</label>
            <input
              type="text"
              placeholder='مثلا: Coffee, Moro، Pepsi'
              onInput={(e) => setName(e.target.value)}
              className="border px-3 py-2 w-64"
            />
          </div>
          <div className="mb-4">
            <label className="block  mb-1">الكمية:</label>
            <input
              type="number"
              onInput={(e) => setStock(e.target.value)}
              className="border px-3 py-2 w-64"
            />
          </div>
          <div className="mb-4">
            <label className="block  mb-1">السعر:</label>
            <input
              type="number"
              onInput={(e) => setPrice(e.target.value)}
              className="border px-3 py-2 w-64"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type='submit' onClick={addHandler} className="px-4 py-2 bg-blue-500 hover:bg-indigo-400 duration-150 text-white rounded">اضافة</button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default AddProductPopup