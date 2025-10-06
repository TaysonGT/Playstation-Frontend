import React, { useState } from 'react'
import NewUser from './NewUser';
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next';
import { getDirection } from '../../i18n';

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newUserPopup, setNewUserPopup] = useState(false)
  const {loginUser, newUser} = useAuth()
  const {t, i18n} = useTranslation()
  const currentDirection = getDirection(i18n.language);

  const handleLogin = async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    await loginUser(username, password)
  }

  return (
    <div className='min-h-screen w-full bg-[url(/src/assets/login-bg.webp)] bg-cover bg-center flex justify-center items-center text-black font-medium'>
        <div dir={currentDirection} className=' mx-auto p-8 bg-white border border-gray-400 rounded-md shadow-md w-[350px]'>
          <h1 className='text-center text-xl mb-4'>{t('login.login')}</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-2 pb-4 w-full mt-6">
            <label>{t('login.username')}</label>
            <input 
              placeholder={t('login.typeUsername')} autoFocus onInput={(e)=>setUsername(e.currentTarget.value)} 
              className=' w-full px-3 py-2 border border-gray-400 placeholder:text-gray-400 rounded-md focus:outline-none focus:border-blue-500 duration-300' type="text" 
              name="username" />
            <label>{t('login.password')}</label>
            <input  placeholder={t('login.typePassword')}
            onInput={(e)=>setPassword(e.currentTarget.value)} className=" w-full px-3 py-2 border border-gray-400 placeholder:text-gray-400 rounded-md
            focus:outline-none focus:border-blue-500 duration-300" type="password"/>
            <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-400 focus:outline-none focus:shadow-outline-blue mt-4 duration-150'>{t('login.login')}</button>
          </form>
          {newUser&& <>
            <p className='text-md font-light'>{t('login.noUsers')}!</p>
            <button onClick={()=> setNewUserPopup(true)} className='cursor-pointer'>{t('login.newUserQuestion')}</button>
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