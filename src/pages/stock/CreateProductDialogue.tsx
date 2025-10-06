import React, { useState } from 'react'
import { ProductPayload } from '../../types'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../i18n'

interface Props{
  onCancel: ()=> void,
  onCreate: (payload: ProductPayload)=> void
}

const CreateProductDialogue: React.FC<Props> = ({onCancel, onCreate}) => {
    const [form, setForm] = useState<ProductPayload>()
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>)=>{
      setForm((prev)=> ({...prev, [e.target.name]: 
          e.target.name === "name"? 
            e.target.value
            : parseInt(e.target.value)
      }))
    }

  return (
    <div dir={currentDirection} className="fixed left-1/2 top-1/2 -translate-1/2 z-102 bg-white rounded-md p-8">
      <h2 className="text-lg text-center font-bold mb-4">{t('stock.addProduct')}</h2>
      <form className='mt-6'>
        <div className="mb-4">
          <label className="block  mb-1">{t('stock.productName')}:</label>
          <input
            name="name"
            type="text"
            placeholder={t('stock.productExample')}
            onInput={inputHandler}
            className="border px-3 py-2 w-64"
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="block  mb-1">{t('tables.quantity')}:</label>
          <input
            name="stock"
            type="number"
            onInput={inputHandler}
            className="border px-3 py-2 w-64"
          />
        </div>
        <div className="mb-4">
          <label className="block  mb-1">{t('tables.price')}:</label>
          <input
            name="price"
            type="number"
            onInput={inputHandler}
            className="border px-3 py-2 w-64"
          />
        </div>
        <div className='flex gap-2 font-slim text-sm items-stretch mt-6'>
          <button type='button' onClick={()=>onCancel()} className='bg-white flex-1/2 border border-black hover:bg-black hover:text-white duration-200 rounded p-3'>{t('modals.cancel')}</button>
          <button type="submit" onClick={(e)=> {
              e.preventDefault()
              form? onCreate(form) 
              : toast.error('برجاء ملء كل البيانات')
          }} className='text-white flex-1/2 bg-indigo-500 hover:bg-indigo-300 duration-200 rounded p-3'>{t('modals.add')}</button>
        </div>
      </form>
    </div>
  )
}
export default CreateProductDialogue