import axios from 'axios'
import toast from 'react-hot-toast'
import { IDevice } from '../../types'
import { useTranslation } from 'react-i18next'

const DeleteConfirm = ({device, onAction, hide}:{device:IDevice, onAction: ()=>void, hide: ()=>void}) => {
    const {t} = useTranslation()

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
    <div className='absolute rounded-md left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white w-80 shadow-large flex-col flex z-[102] select-none px-6 py-4 gap-2'>
        <h1 className='font-bold text-wrap'>{t('devices.confirmDeleteDevice')}</h1>
        <p className='mb-2 font-bold text-gray-700 text-start'>{t('devices.deviceName')}: {device.name}</p>
        <div className='flex justify-between text-white'>
            <button onClick={deleteHandler} className='bg-red-600 hover:bg-red-400 shadow-large rounded px-6 py-3'>{t('modals.delete')}</button>
            <button onClick={()=>hide()} className='border border-gray-200 hover:bg-zinc-100 shadow-large text-black px-6 py-3 rounded'>{t('modals.cancel')}</button>
        </div>
    </div>
  )
}

export default DeleteConfirm