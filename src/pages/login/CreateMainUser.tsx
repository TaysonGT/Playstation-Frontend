import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'

const CreateMainUser:React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const {t} = useTranslation()
  const {firstLogin} = useAuth()

  const addHandler = (e:React.SubmitEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setLoading(true)
    firstLogin({username, password, confirmPassword})
    .finally(()=>setLoading(false))
  }
    
  return (
    <div className="bg-white rounded-lg p-8 fixed top-1/2 left-1/2 -translate-1/2 z-102">
      <h2 className="text-lg text-center font-bold mb-4">{t('login.createMainUser')}</h2>
      <form className='mt-6' onSubmit={addHandler}>
        <div className="mb-4">
          <label className="block mb-1">{t('login.username')}:</label>
          <input
            autoFocus
            type="text"
            placeholder={t('login.typeUsername')}
            name="username" onInput={e=> setUsername(e.currentTarget.value)}
            className="border border-gray-400 px-3 py-2 w-75 text-md rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">{t('login.password')}:</label>
          <input
            type="password"
            placeholder={t('login.typePassword')}
            name='password' onInput={e=> setPassword(e.currentTarget.value)}
            className="border border-gray-400 px-3 py-2 w-75 text-md rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">{t('login.confirmPassword')}:</label>
          <input
            type="password"
            placeholder={t('login.typePasswordConfirm')}
            name='password' onInput={e=> setConfirmPassword(e.currentTarget.value)}
            className="border border-gray-400 px-3 py-2 w-75 text-md rounded-md"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button type='submit' className="px-4 py-2 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 duration-150 text-white rounded" disabled={loading}>{loading?t('modals.adding') :t('modals.add')}</button>
        </div>
      </form>
    </div>
  )
}
export default CreateMainUser
