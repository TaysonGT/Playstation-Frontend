import Cookies from 'js-cookie'
import axios from 'axios'
import React, { useState } from 'react'
import {useNavigate } from 'react-router-dom'

const Login = () => {

  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUsername = (e)=>{
    setUsername(e.target.value);
  }
  const handlePassword = (e)=>{
    setPassword(e.target.value);
  }

  
  const navigate = useNavigate();
  const handleLogin = (e)=>{
    e.preventDefault();
    const token = Cookies.get('access_token')? Cookies.get('access_token') : null 
    if(token == null || !token){
      axios.post('https://playstation-backend.onrender.com/login', { username, password}, {withCredentials: true})
      .then(({data})=>{
        if(data.success){
          Cookies.set('access_token', data.token, { expires: new Date(data.expDate) })
          Cookies.set('username', data.username,  { expires: new Date(data.expDate) })
          navigate('/')
        }else{
          alert(data.message)
        }
      })
      .catch(err=> console.log(err))
    }else{
      alert("You're Already Signed in!")
      navigate('/')
    }
  }
  return (
    <div className='min-h-screen w-full bg-[#080710] bg-cover bg-center flex justify-center items-center text-white font-medium'>
        <div dir='rtl' className=' bg-loginForm shadow-loginForm border-[2px] border-loginForm rounded-sm w-[400px] p-10'>
          <h1 className='text-center text-xl mb-4'>تسجيل الدخول</h1>
          <form className="flex flex-col gap-2 pb-4 w-full">
            <label>اسم المستخدم</label>
            <input placeholder="ادخل اسم المستخدم" onInput={handleUsername} className=' bg-loginInput p-2 rounded border-gray-400 border-[1px] focus:outline-indigo-500 focus:shadow-hardInner duration-200  placeholder:font-thin placeholder:text-[#e5e5e5]' type="text"/>
            <label>كلمة المرور</label>
            <input  placeholder="ادخل كلمة المرور" onInput={handlePassword} className=" bg-loginInput p-2  rounded border-gray-400 border-[1px] ] focus:outline-indigo-500 focus:shadow-hardInner duration-200 placeholder:font-thin placeholder:text-[#e5e5e5]" type="password"/>
            <button onClick={handleLogin} className='p-4 bg-[#fff] text-lg font-bold  text-[#080710] hover:bg-transparent hover:text-[#fff] border duration-150 inline-block rounded mt-6 active:shadow-hardInner'>دخول</button>
          </form>  
        </div>
    </div>
  )
}

export default Login