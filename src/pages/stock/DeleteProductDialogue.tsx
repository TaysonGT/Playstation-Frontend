import React from 'react'
import { IProduct } from '../../types'

interface Props{
    product: IProduct,
    onDelete: (id: string)=> void,
    onCancel: ()=> void
}

const DeleteProductDialogue:React.FC<Props> = ({onDelete, product, onCancel}) => {
    return (
    <div dir='rtl' className='fixed left-1/2 top-1/2 -translate-1/2 bg-white shadow-large flex-col flex z-[102] select-none px-6 py-4 gap-6'>
        <h1 className='text-md font-bold'>هل تريد حذف هذا المنتج؟</h1>
        <div className='flex justify-between text-white'>
            <button onClick={()=> onDelete(product.id)} className='bg-red-600 hover:bg-red-400 shadow-large rounded px-6 py-3'>حذف</button>
            <button onClick={onCancel} className='bg-white hover:bg-zinc-100 shadow-large text-black px-6 py-3 rounded'>الغاء</button>
        </div>
    </div>
  )
}

export default DeleteProductDialogue