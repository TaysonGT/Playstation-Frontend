import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface Props {assignUser: (p: any)=>void}

const NewUser:React.FC<Props> = ({assignUser}) => {
    const [password, setPassword ] = useState('')
    const [username, setUsername ] = useState('')

    const addHandler = (e:React.FormEvent<HTMLElement>)=>{
      e.preventDefault();
      let admin = true;
      axios.post('/firstuser', {username, password, admin}, {withCredentials: true})
      .then(({data})=> {
        if(data.success){
          toast.success(data.message)
          assignUser(data)
        }else{
          toast.error(data.message)
        }
      })
    }
    
  return (
    <div className="bg-white rounded-lg p-8 fixed top-1/2 left-1/2 -translate-1/2 z-102">
      <h2 className="text-lg text-center font-bold mb-4">إضافة مستخدم جديد</h2>
      <form className='mt-6'>
        <div className="mb-4">
          <label className="block mb-1">اسم المستخدم:</label>
          <input
            autoFocus
            type="text"
            placeholder='ادخل اسم المستخدم'
            name="username" onInput={e=> setUsername(e.currentTarget.value)}
            className="border-1 border-gray-400 px-3 py-2 w-64 text-md rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">كلمة المرور:</label>
          <input
            type="text"
            placeholder='ادخل كلمة المرور'
            name='password' onInput={e=> setPassword(e.currentTarget.value)}
            className="border-1 border-gray-400 px-3 py-2 w-64 text-md rounded-md"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button type='submit' onClick={addHandler} className="px-4 py-2 bg-blue-500 hover:bg-indigo-400 duration-150 text-white rounded">اضافة</button>
        </div>
      </form>
    </div>
  )
}
export default NewUser