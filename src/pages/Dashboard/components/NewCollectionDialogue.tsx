import { FormEvent, useEffect, useState } from 'react';
import { getDirection } from '../../../i18n';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useConfigs } from '../../../context/ConfigsContext';

const NewCollectionDialogue = ({show, cancel, refresh}:{show:boolean, cancel: ()=>void, refresh: ()=>void}) => {
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);
    const [confirming, setConfirming] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [expectedCash, setExpectedCash] = useState<number>(0)
    const {configs} = useConfigs()

    const [form, setForm] = useState<{
        cash_counted?: number,
        amount_collected?: number,
        cash_over_short?: number,
        float_remaining?: number,
        notes?: string
    }>()

    const inputHandler = (e:FormEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        if(e.currentTarget.name=='cash_counted'){
            setForm({
                ...form,
                cash_over_short:  parseFloat(e.currentTarget.value) - (expectedCash || 0),
                cash_counted: parseFloat(e.currentTarget.value),
            })
        }else if(e.currentTarget.name=='amount_collected'){
            setForm({
                ...form,
                amount_collected: parseFloat(e.currentTarget.value),
                float_remaining: (form?.cash_counted||0) - parseFloat(e.currentTarget.value),
            })
        }else if(e.currentTarget.name=='notes'){
            setForm({
                ...form,
                notes: e.currentTarget.value,
            })
        }
        
    }

    const confirmHandler = (e:React.FormEvent<HTMLElement>)=>{
        e.preventDefault()
        setConfirming(true)
        axios.post('/cash/collections', {
            ...form,
        }, {withCredentials: true})
        .then(({data})=>{
            if(!data.success) return toast.error(data.message);
            toast.success(data.message);
            refresh();
            cancel()
        }).finally(()=>setConfirming(false))
    }

    useEffect(()=>{
        axios.get('/cash/balance')
        .then(({data})=>{
            if(data.success){
                setExpectedCash(data.total)
            }
        }).finally(()=>setIsLoading(false))
    },[])

  return (
    <div dir={currentDirection} className={`fixed top-0 left-0 w-screen h-screen bg-black/30 z-50 duration-200 ${show? 'opacity-100 pointer-events-auto':'opacity-0 pointer-events-none'}`}>
        <div onClick={cancel} className={`h-full w-full`} />
        <div className='fixed left-1/2 top-1/2 -translate-1/2 bg-white rounded-md shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto'>
            <div className='flex justify-between items-center p-4 border-b border-gray-200'>
                <h1 className='text-2xl font-bold'>{t('dashboard.newCollection')}</h1>
                <button onClick={cancel} className='text-gray-500 hover:text-gray-800 text-2xl font-bold'>&times;</button>
            </div>
            <form  onSubmit={confirmHandler} className='px-10 py-6 max-h-[70vh] overflow-y-auto'>
                <div className='flex gap-10 items-center justify-self-center'>
                    <div>
                        <p className='text-gray-700 text-sm'>{t('dashboard.expectedCash')}:</p>
                        {isLoading?
                            <div className="h-5 w-full mt-3 animate-pulse bg-gray-300 rounded-md mb-4"></div>
                            : 
                            <p  className='font-bold text-xl'><span dir='ltr'>{expectedCash}</span> <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.code}</span></p>
                        }
                    </div>
                    <div>
                        <p className='text-gray-700 text-sm'>{t('dashboard.overShort')}:</p>
                        {isLoading?
                            <div className="h-5 w-full mt-3 animate-pulse bg-gray-300 rounded-md mb-4"></div>
                            :
                            <p className={`font-bold text-xl ${(form?.cash_over_short||0)!==0&& ((form?.cash_over_short||0)<0?'text-red-500': 'text-blue-500')}`}><span dir='ltr'>{form?.cash_over_short||0}</span> <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.code}</span></p>
                        }
                    </div>
                    <div>
                        <p className='text-gray-700 text-sm'>{t('dashboard.remaining')}:</p>
                        {isLoading?
                            <div className="h-5 w-full mt-3 animate-pulse bg-gray-300 rounded-md mb-4"></div>
                            :
                            <p className='font-bold text-xl'><span dir='ltr'>{form?.float_remaining||0}</span> <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.code}</span></p>
                        }
                    </div>
                </div>
                <div className='mt-4'>
                    <label className='block mb-2 font-medium'>{t('dashboard.countedCash')}:</label>
                    <input name='cash_counted' type='number' placeholder={t('forms.typeCountedCash')} onChange={inputHandler} className='w-full border border-gray-300 rounded-md p-2' />
                </div>
                <div className='mt-4'>
                    <label className='block mb-2 font-medium'>{t('dashboard.collectedCash')}:</label>
                    <input name='amount_collected' type='number' placeholder={t('forms.typeCollectedAmount')} onChange={inputHandler} className='w-full border border-gray-300 rounded-md p-2' />
                </div>
                <div className='mt-4'>
                    <label className='block mb-2 font-medium'>{t('receipts.notes')}:</label>
                    <textarea name='notes' onChange={inputHandler} placeholder={t('forms.typeNotes')} className='w-full border border-gray-300 rounded-md p-2' rows={4}/>
                </div>
                <div className='flex justify-end mt-4'>
                    <button type='submit' disabled={confirming} className='px-4 py-2 disabled:bg-blue-200 bg-blue-500 hover:bg-indigo-400 duration-150 text-white rounded'>{confirming? t('modals.confirming') : t('modals.confirm')}</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default NewCollectionDialogue