import axios from 'axios'
import toast from 'react-hot-toast'
import { IDevice } from '../../types'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../i18n'

const DeleteConfirm = ({device, onAction, hide}:{device:IDevice, onAction: ()=>void, hide: ()=>void}) => {
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);

    const deleteHandler = ()=>{
        axios.delete(`/devices/${device.id}`, {withCredentials: true})
        .then(({data})=>{
            if(data.message){
                data.success? toast.success(data.message) : toast.error(data.message)
                onAction()
            }
        })
    }
  
    return (
    <div dir={currentDirection} className='absolute rounded-md left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white w-80 shadow-large flex-col flex z-[102] select-none p-6 gap-2'>
        <h1 className='font-bold text-wrap'>{t('modals.confirmDeleteDevice')}</h1>
        <p className='mb-2 font-bold text-gray-700 text-start'>{t('devices.deviceName')}: {device.name}</p>
        <div className='flex gap-6 text-white'>
            <button onClick={deleteHandler} className='bg-red-600 flex-1 hover:bg-red-400 shadow-large rounded px-6 py-3'>{t('modals.delete')}</button>
            <button onClick={()=>hide()} className='flex-1 border border-gray-300 hover:bg-zinc-100 shadow-large text-black px-6 py-3 rounded'>{t('modals.cancel')}</button>
        </div>
    </div>
  )
}

export default DeleteConfirm