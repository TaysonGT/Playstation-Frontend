import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'

const NewUser:React.FC = () => {
    const [password, setPassword ] = useState('')
    const [username, setUsername ] = useState('')
    const {t} = useTranslation()
    const {firstLogin} = useAuth()

    const addHandler = (e:React.FormEvent<HTMLElement>)=>{
      e.preventDefault();
      firstLogin(username, password)
    }
    
  return (
    <div className="bg-white rounded-lg p-8 fixed top-1/2 left-1/2 -translate-1/2 z-102">
      <h2 className="text-lg text-center font-bold mb-4">{t('login.addNewUser')}</h2>
      <form className='mt-6'>
        <div className="mb-4">
          <label className="block mb-1">{t('login.username')}:</label>
          <input
            autoFocus
            type="text"
            placeholder={t('login.typeUsername')}
            name="username" onInput={e=> setUsername(e.currentTarget.value)}
            className="border-1 border-gray-400 px-3 py-2 w-64 text-md rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">{t('login.password')}:</label>
          <input
            type="text"
            placeholder={t('login.typePassword')}
            name='password' onInput={e=> setPassword(e.currentTarget.value)}
            className="border-1 border-gray-400 px-3 py-2 w-64 text-md rounded-md"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button type='submit' onClick={addHandler} className="px-4 py-2 bg-blue-500 hover:bg-indigo-400 duration-150 text-white rounded">{t('modals.add')}</button>
        </div>
      </form>
    </div>
  )
}
export default NewUser