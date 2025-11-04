import React, { useState } from 'react'
import { IProduct } from '../../types'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../i18n'
import { useProducts } from './hooks/useProducts'
import toast from 'react-hot-toast'

interface Props{
    product: IProduct,
    cancel: ()=> void,
    onAction: ()=> void,
}

const DeleteProductDialogue:React.FC<Props> = ({product, cancel, onAction}) => {
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);
    const {remove} = useProducts()
    const [isLoading, setIsLoading] = useState(false)

    return (
    <div dir={currentDirection} className='fixed left-1/2 top-1/2 -translate-1/2 bg-white shadow-large flex-col flex z-[102] select-none p-6 rounded-sm'>
        <h1 className='font-bold'>{t('modals.confirmDeleteProduct')}</h1>
        <h1 className='font-bold text-center text-xl text-indigo-600 mt-4'>{product.name}</h1>
        <div className='flex text-sm gap-6 text-white mt-6'>
            <button disabled={isLoading} onClick={()=>{
                setIsLoading(true)
                remove(product.id)
                .then(({data})=>{
                    if(data.success){
                        toast.success(data.message)
                        onAction()
                        return
                    }
                    toast.error(data.message)
                }).finally(()=> setIsLoading(false))}
            } className='flex-1 bg-red-600 hover:bg-red-400 shadow-large rounded px-6 py-3 disabled:bg-red-300'>{isLoading?t('modals.deleting'):t('modals.delete')}</button>
            <button disabled={isLoading} onClick={cancel} className='flex-1 border border-gray-400 hover:bg-zinc-100 shadow-large text-black px-6 py-3 rounded'>{t('modals.cancel')}</button>
        </div>
    </div>
  )
}

export default DeleteProductDialogue