import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props{
  currentUser: string, 
  onAction: ()=>void, 
  hide: ()=>void
}

const DeleteConfirm:React.FC<Props> = ({currentUser, onAction, hide}) => {
    
    const [user, setUser] = useState<{username:string, firstname:string, lastname: string}>()
    
    const deleteHandler = ()=>{
        axios.delete(`/users/${currentUser}}`, {withCredentials: true})
        .then(({data})=>{
            if(data.message){
                data.success? toast.success(data.message) : toast.error(data.message)
            }
          }).finally(()=>onAction())
    }
      
    useEffect(()=>{
      currentUser&& axios.get(`/users/${currentUser}`, {withCredentials:true})
      .then(({data})=>{
        setUser(data.user)
      })
    },[currentUser])
    
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