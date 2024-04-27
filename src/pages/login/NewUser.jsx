import axios from 'axios'
import React, { useState } from 'react'

const NewUser = ({setNewUserPopup, setSuccess, setMessage, setNewUser}) => {
        
    const [password, setPassword ] = useState()
    const [username, setUsername ] = useState()

    const inputHandler = (e)=>{
        if(e.target.name == "username"){
          setUsername(e.target.value) 
        }else if(e.target.name == "password"){
          setPassword(e.target.value)
        }
    }

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
    <div className='rounded-lg pt-8 px-16 h-[450px] w-[450px] flex justify-center flex-col pb-10 bg-[#1b1b1f] text-black border-2 border-white  fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[50]'>
      <h1 className='text-3xl font-bold text-white text-center'>إضافة مستخدم</h1>
        <form dir="rtl" action="" className='flex flex-col mt-6'>
            <label className='text-white mt-2'>اسم المستخدم</label>
            <input name="username" onInput={inputHandler}  className='mt-2 font-bold text-md p-2' type="text" />
            <label className='text-white mt-4'>كلمة السر</label>
            <input name='password' onInput={inputHandler} className='mt-2 font-bold text-md p-2' type="text" />
            <button onClick={addHandler} className='bg-white hover:bg-indigo-200 duration-200 rounded p-3 mt-10 text-xl font-bold'>إضافة</button>
        </form>
    </div>
  )
}
export default NewUser