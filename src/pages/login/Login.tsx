import Cookies from 'js-cookie'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import NewUser from './NewUser';


const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [newUser, setNewUser] = useState(false)
  const [newUserPopup, setNewUserPopup] = useState(false)
  
  const navigate = useNavigate();

  const assignUser = (data: {token: string, username: string, user_id:string, expDate: Date})=>{
    Cookies.set('access_token', data.token, {expires: new Date(data.expDate), secure: true, path: '/'})
    Cookies.set('username', data.username, {expires: new Date(data.expDate), secure: true, path: '/'})
    Cookies.set('user_id', data.user_id, {expires: new Date(data.expDate), secure: true, path: '/'})
    navigate('/')
  }

  const handleLogin = (e: React.FormEvent<HTMLElement>)=>{
    e.preventDefault();
    let token = Cookies.get('access_token')
    if(!token){
      axios.post('/login', {username, password}, {withCredentials: true})
      .then(({data})=>{
        if(data.success){
          toast.success(data.message)
          assignUser(data)
        }else{
          toast.error(data.message)
        }
      })
    }else{
      toast.error("لقد سجلت دخولك بالفعل!")
      navigate('/')
    }
  }

  useEffect(()=>{
    axios.get('/firstuser')
      .then(({data})=> 
        data.existing? setNewUser(false) : setNewUser(true)
      )
  }, [])


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
              <NewUser {... {assignUser}} />
            </>
            }
          </>}
        </div>
    </div>
  )
}

export default Login