import axios from 'axios'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { IUser } from '../../../types'

interface Props {
  onAction: ()=>void,
  user: IUser
}

const NewUser:React.FC<Props> = ({onAction, user}) => {
        
    const [password, setPassword ] = useState('')
    const [username, setUsername ] = useState('')
    const [admin, setAdmin ] = useState('')
    
    const [prevUsername, setPrevUsername] = useState('')
    const [prevPassword, setPrevPassword] = useState('')
    const [prevAdmin, setPrevAdmin] = useState()
    

    const addHandler = (e:React.MouseEvent<HTMLElement>)=>{
      e.preventDefault();
      axios.put(`/users/${user.id}`, {username, password, admin}, {withCredentials: true})
      .then(({data})=> {
        if(data.message){
          data.success? toast.success(data.message) 
          : toast.error(data.message)
          onAction()
        }
      })
    }
    
    useEffect(() => {
      axios.get(`/users/${user.id}`, {withCredentials:true})
      .then(({data})=>{
        setPrevUsername(data.user.username)
        setPrevPassword(data.user.password)
        setPrevAdmin(data.user.admin)
        if(data.user.admin){
          setAdmin("admin")
        }else{
          setAdmin("employee")
        }
      })
    }, [user])
    
  return (
    <div className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[102] flex items-center justify-center text-black font-medium`}>
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-lg text-center font-bold mb-4">تعديل مستخدم</h2>
        <form className='mt-6'>
          <div className="mb-4">
            <label className="block mb-1">اسم المستخدم:</label>
            <input
              type="text"
              placeholder={prevUsername} 
              onInput={e=> setUsername(e.currentTarget.value)}
              className="border px-3 py-2 w-64 text-md"
            />
          </div>
          <div className="mb-4">
            <label className="block  mb-1">كلمة المرور:</label>
            <input
              type="text"
              placeholder={prevPassword} 
              onInput={e=> setPassword(e.currentTarget.value)}
              className="border px-3 py-2 w-64 text-md"
            />
          </div>
          <div className="mb-4  flex items-center gap-4">
            <label className="block mb-1">الدور:</label>
            <select 
            name="role" 
            onInput={e=> setAdmin(e.currentTarget.value)}
            className="border px-3 py-2 w-full text-md bg-white"
            >
              <option value="admin">ادمن</option>
              <option selected={prevAdmin==false} value="employee">موظف</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button type='submit' onClick={addHandler} className="px-4 py-2 bg-blue-500 hover:bg-indigo-400 duration-150 text-white rounded">تعديل</button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default NewUser