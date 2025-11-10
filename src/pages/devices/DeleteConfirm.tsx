import axios from 'axios'
import toast from 'react-hot-toast'
import { IDevice, IDeviceType } from '../../types'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../i18n'
import React from 'react'

interface Props {
    device:IDevice|null, 
    deviceType: IDeviceType|null, 
    onAction: ()=>void, 
    hide: ()=>void, 
    mode:'device'|'type'
    show: boolean
}

const DeleteConfirm: React.FC<Props> = ({device, deviceType, onAction, hide, mode='device', show}) => {
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);

    const deleteDeviceHandler = ()=>{
        if(!device) return;
        axios.delete(`/devices/${device.id}`, {withCredentials: true})
        .then(({data})=>{
            if(data.message){
                data.success? toast.success(data.message) : toast.error(data.message)
                onAction()
            }
        })
    }

    const deleteTypeHandler = ()=>{
        if(!deviceType) return;
        axios.delete(`/device-types/${deviceType.id}`, {withCredentials: true})
        .then(({data})=>{
            if(data.message){
                data.success? toast.success(data.message) : toast.error(data.message)
                onAction()
            }
        })
    }
  
    return (
    <div dir={currentDirection} className={`absolute rounded-md left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white w-80 shadow-large flex-col flex z-[102] select-none p-6 gap-2 ${show?'opacity-100 pointer-events-auto':'opacity-0 pointer-events-none'}`}>
        {mode==='device'?
            <>
            <h1 className='font-bold text-wrap'>{t('modals.confirmDeleteDevice')}</h1>
            <p className='mb-2 font-bold text-gray-700 text-start'>{t('devices.deviceName')}: {device?.name}</p>
            </>
        :
            <>
            <h1 className='font-bold text-wrap'>{t('modals.confirmDeleteDeviceType')}</h1>
            <p className='mb-2 font-bold text-gray-700 text-start'>{t('devices.deviceType')}: {deviceType?.name}</p>
            </>
        }
        <div className='flex gap-6 text-white'>
            <button onClick={()=>mode==='device'?deleteDeviceHandler():deleteTypeHandler()} className='bg-red-600 flex-1 hover:bg-red-400 shadow-large rounded px-6 py-3'>{t('modals.delete')}</button>
            <button onClick={()=>hide()} className='flex-1 border border-gray-300 hover:bg-zinc-100 shadow-large text-black px-6 py-3 rounded'>{t('modals.cancel')}</button>
        </div>
    </div>
  )
}

export default DeleteConfirm