import React, { useState } from 'react'
import { IProduct, ProductPayload } from '../../types'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../i18n'
import toast from 'react-hot-toast'
import { useProducts } from './hooks/useProducts'

interface Props {
    cancel: ()=> void,
    onAction: ()=> void,
    product: IProduct|null
}

const EditProductDialogue: React.FC<Props> = ({product, cancel, onAction}) => {
    const [form, setForm] = useState<ProductPayload>({}) 
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);
    const {update} = useProducts()
    const [isLoading, setIsLoading] = useState(false)

    const inputHandler = (inputName:string, value: string|number)=>{
        setForm((prev)=> ({...prev, [inputName]: value}))
    }
    
  return (
    <div dir={currentDirection} className={`fixed left-1/2 top-1/2 -translate-1/2 z-102 bg-white rounded-md p-8 ${product?'opacity-100 pointer-events-auto':'opacity-0 pointer-events-none'}`}>
      <h1 className="text-lg text-center font-bold mb-4">{t('stock.editProduct')}</h1>
      <form className='mt-6'>
        <div className="mb-4">
          <label className="block  mb-1">{t('stock.productName')}:</label>
          <input
            name="name"
            type="text"
            placeholder={t('stock.productExample')}
            onInput={(e)=>inputHandler('name', e.currentTarget.value)}
            defaultValue={product?.name}
            className="border px-3 py-2 w-64"
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="block  mb-1">{t('tables.quantity')}:</label>
          <input
            name="stock"
            type="number"
            onInput={(e)=>inputHandler('stock', parseInt(e.currentTarget.value))}
            defaultValue={product?.stock}
            className="border px-3 py-2 w-64"
          />
        </div>
        <div className="mb-4">
          <label className="block  mb-1">{t('tables.price')}:</label>
          <input
            name="price"
            type="number"
            onInput={(e)=>inputHandler('stock', parseFloat(e.currentTarget.value))}
            defaultValue={product?.price}
            className="border px-3 py-2 w-64"
          />
        </div>
        <div className='flex gap-2 font-slim text-sm items-stretch mt-6'>
          <button disabled={isLoading} type='button' onClick={cancel} className='bg-white flex-1/2 border border-gray-400 hover:bg-gray-200 duration-200 rounded p-3'>{t('modals.cancel')}</button>
          <button disabled={isLoading} type="submit" onClick={(e)=> {
              e.preventDefault()
              if(!product) return;
              if(!form)return toast.error('برجاء ملء كل البيانات') 
              setIsLoading(true)
              update(product.id, form).then(({data})=>{
                if(data.success) {
                    toast.success(data.message)
                    onAction()
                    return
                } toast.error(data.message)
              }).finally(()=> setIsLoading(false))
          }} className='text-white flex-1/2 bg-indigo-500 hover:bg-indigo-400 duration-200 rounded p-3 disabled:bg-indigo-300'>{isLoading?t('modals.saving'):t('modals.save')}</button>
        </div>
      </form>
    </div>
  )
}

export default EditProductDialogue