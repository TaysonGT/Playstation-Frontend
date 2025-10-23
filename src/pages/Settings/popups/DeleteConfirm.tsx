import React from 'react'
import { IUser } from '../../../types'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Props{
  user: IUser, 
  onAction: ()=>void, 
  hide: ()=>void
}

const DeleteConfirm:React.FC<Props> = ({user, onAction, hide}) => {
    const deleteHandler = ()=>{
        axios.delete(`/users/${user.id}}`, {withCredentials: true})
        .then(({data})=>{
            if(data.message){
                data.success? toast.success(data.message) : toast.error(data.message)
            }
          }).finally(()=>onAction())
    }
    
    return (
    <div className='fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white shadow-large flex-col flex z-[102] select-none px-6 py-4'>
        <h1 className='text-md font-bold'>هل تريد حذف هذا المستخدم؟</h1>
        <p className='text-red-600 text-center font-bold mb-6 mt-2'>{user?.username}</p>
        <div className='flex justify-between text-white'>
            <button onClick={deleteHandler} className='bg-red-600 hover:bg-red-400 shadow-large rounded px-6 py-3'>حذف</button>
            <button onClick={()=> hide()} className='bg-white hover:bg-zinc-100 shadow-large text-black px-6 py-3 rounded'>الغاء</button>
        </div>
    </div>
  )
}

export default DeleteConfirm