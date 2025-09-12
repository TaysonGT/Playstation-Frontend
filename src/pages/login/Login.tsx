import React, { useState } from 'react'
import NewUser from './NewUser';
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newUserPopup, setNewUserPopup] = useState(false)
  const {loginUser, newUser} = useAuth()

  const handleLogin = (e: React.FormEvent<HTMLElement>)=>{
    e.preventDefault();
    loginUser(username, password)
  }

  return (
    <div className='min-h-screen w-full bg-[url(/src/assets/login-bg.webp)] bg-cover bg-center flex justify-center items-center text-black font-medium'>
        <div dir='rtl' className=' mx-auto p-8 bg-white border border-gray-400 rounded-md shadow-md w-[350px]'>
          <h1 className='text-center text-xl mb-4'>تسجيل الدخول</h1>
          <form className="flex flex-col gap-2 pb-4 w-full mt-6">
            <label>اسم المستخدم</label>
            <input 
              placeholder="ادخل اسم المستخدم" autoFocus onInput={(e)=>setUsername(e.currentTarget.value)} 
              className=' w-full px-3 py-2 border border-gray-400 placeholder:text-gray-400 rounded-md focus:outline-none focus:border-blue-500 duration-300' type="text" 
              name="username" />
            <label>كلمة المرور</label>
            <input  placeholder="ادخل كلمة المرور"
            onInput={(e)=>setPassword(e.currentTarget.value)} className=" w-full px-3 py-2 border border-gray-400 placeholder:text-gray-400 rounded-md
            focus:outline-none focus:border-blue-500 duration-300" type="password"/>
            <button onClick={handleLogin} className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-400 focus:outline-none focus:shadow-outline-blue mt-6 duration-150'>دخول</button>
          </form>
          {newUser&& <>
            <p className='text-md font-light'>لا يوجد مستخدمين!</p>
            <button onClick={()=> setNewUserPopup(true)} className='cursor-pointer'>هل تريد إضافة مستخدم جديد؟</button>
            {newUserPopup && <>
            <div onClick={()=>setNewUserPopup(false)} className='fixed left-0 top-0 w-screen h-screen bg-black/70 animate-appear duration-500 z-[50]'></div>
              <NewUser/>
            </>
            }
          </>}
        </div>
    </div>
  )
}

export default Login