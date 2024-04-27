import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const DeleteConfirm = ({setDeleteConfirm, deleteId, setDeleteId}) => {
    const [done, setDone] = useState()
    const deleteHandler = ()=>{
        axios.delete(`/products/${deleteId.slice(4)}`, {withCredentials: true})
        .then(({data})=>{
            if(data.message){
                data.success? toast.success(data.message) : toast.error(data.message)
            }
            setDone(true)
        })
    }

    useEffect(()=>{
        if(done){
            setDeleteId(null)
            setDeleteConfirm(false)
        }
        setDone(false)      
    },[done])
  
    return (
    <div className='fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white shadow-large flex-col flex z-[102] select-none px-6 py-4 gap-6'>
        <h1 className='text-md font-bold'>هل تريد حذف هذا المنتج؟</h1>
        <div className='flex justify-between text-white'>
            <button onClick={deleteHandler} className='bg-red-600 hover:bg-red-400 shadow-large rounded px-6 py-3'>حذف</button>
            <button onClick={()=>{ setDeleteConfirm(false); setDeleteId(null) }} className='bg-white hover:bg-zinc-100 shadow-large text-black px-6 py-3 rounded'>الغاء</button>
        </div>
    </div>
  )
}

export default DeleteConfirm