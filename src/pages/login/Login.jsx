import Cookies from 'js-cookie'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import NewUser from './NewUser';


const Login = () => {

  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState()
  const [password, setPassword] = useState('')
  const [newUser, setNewUser] = useState(false)
  const [newUserPopup, setNewUserPopup] = useState(false)

  const handleUsername = (e)=>{
    setUsername(e.target.value);
  }
  const handlePassword = (e)=>{
    setPassword(e.target.value);
  }
  
  const navigate = useNavigate();
  const handleLogin = (e)=>{
    e.preventDefault();
    let token = Cookies.get('access_token')
    if(!token){
      axios.post('/login', { username, password}, {withCredentials: true})
      .then(({data})=>{
        if(data.success){
          Cookies.set('access_token', data.token, {expires: new Date(data.expires)})
          Cookies.set('username', data.username, {expires: new Date(data.expires)})
          Cookies.set('user_id', data.user_id, {expires: new Date(data.expires)})
          navigate('/')
        }else{
          toast.error(data.message)
        }
      })
      .catch(err=> toast.error("حدث خطأ"))
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

  useEffect(()=>{
    if (message){
      success? toast.success(message) : toast.error(message)
    }
    setMessage(null) 
  }, [message, success])

  return (
    <div className='min-h-screen w-full bg-indigo-200 bg-cover bg-center flex justify-center items-center text-white font-medium'>
        <div dir='rtl' className=' mx-auto p-8 bg-gray-800 rounded-md shadow-md w-[350px]'>
          <h1 className='text-center text-xl mb-4'>تسجيل الدخول</h1>
          <form className="flex flex-col gap-2 pb-4 w-full mt-6">
            <label>اسم المستخدم</label>
            <input placeholder="ادخل اسم المستخدم" onInput={handleUsername} className=' w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-gray-700 text-white duration-300' type="text"/>
            <label>كلمة المرور</label>
            <input  placeholder="ادخل كلمة المرور" onInput={handlePassword} className=" w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-gray-700 text-white duration-300" type="password"/>
            <button onClick={handleLogin} className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-400 focus:outline-none focus:shadow-outline-blue mt-6 duration-150'>دخول</button>
          </form>
          {newUser&& <>
            <p className='text-md font-thin'>لا يوجد مستخدمين!</p>
            <button onClick={()=> setNewUserPopup(true)}>هل تريد إضافة مستخدم جديد؟</button>
            {newUserPopup && <>
            <div onClick={()=>setNewUserPopup(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout z-[50]'></div>
            <NewUser {... {setNewUserPopup, setMessage, setSuccess, setNewUser}} />
            </>
            }
          </>}
        </div>
    </div>
  )
}

export default Login