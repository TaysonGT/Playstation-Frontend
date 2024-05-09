import React, {useState} from 'react'
import toast from 'react-hot-toast'
import axios from 'axios';

const AddDeductionPopup = ({setShowAddDeductionPopup, refresh, setRefresh}) => {
  const [description, setDescription] = useState('')
  const [finances, setFinances] = useState()
  
  const addHandler = (e)=>{
    e.preventDefault()
    axios.post('/finances/deduction', {finances, description},{withCredentials: true})
    .then(({data})=>{
      if(data.message){
        data.success? toast.success(data.message) : toast.error(data.message);
        setRefresh(!refresh)
        setShowAddDeductionPopup(false)
      }
    })
  }
  
  return (
    <div className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[102] flex items-center justify-center text-black font-medium`}>
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-lg text-center font-bold mb-4">  اضافة خصم جديد</h2>
        <form className='mt-6'>
          <div className="mb-4">
            <label className="block mb-1">المبلغ:</label>
            <input
              type="number"
              placeholder="ادخل مبلغ الخصم"
              onInput={e=> setFinances(e.target.value)}
              className="border px-3 py-2 w-64 text-sm line"
            />
          </div>
          <div className="mb-4">
            <label className="block  mb-1">تفاصيل الخصم:</label>
            <textarea
              value={description}
              onChange={e=> setDescription(e.target.value)}
              placeholder='ادخل تفاصيل الخصم'
              className="border px-3 py-2 w-64 text-sm"
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

export default AddDeductionPopup