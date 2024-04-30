import axios from 'axios'
import React, { useState } from 'react'

const NewUser = ({setNewUserPopup, setSuccess, setMessage, setNewUser}) => {
        
    const [password, setPassword ] = useState()
    const [username, setUsername ] = useState()

    const addHandler = (e)=>{
      e.preventDefault();
      let admin = true;
      axios.post('/firstuser', {username, password, admin}, {withCredentials: true})
      .then(({data})=> {
        if(data.message){
          setSuccess(data.success)
          setMessage(data.message)
          setNewUserPopup(false)
          data.success&& setNewUser(false) 
        }
      })
    }
    
  return (
    <div className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[102] flex items-center justify-center text-black`}>
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-lg font-bold mb-4">اضافة مستخدم جديد</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-1">اسم المستخدم:</label>
            <input
              type="text"
              placeholder='ادخل اسم المستخدم'
              name="username" onInput={e=> setUsername(e.target.value)}
              className="border px-3 py-2 w-64 text-md"
            />
          </div>
          <div className="mb-4">
            <label className="block  mb-1">كلمة المرور:</label>
            <input
              type="text"
              placeholder='ادخل كلمة المرور'
              name='password' onInput={e=> setPassword(e.target.value)}
              className="border px-3 py-2 w-64 text-md"
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
export default NewUser