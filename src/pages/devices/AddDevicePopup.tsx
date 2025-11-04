import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { IDeviceType } from '../../types'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../i18n'

const AddDevicePopup = ({onAction, deviceTypes}:{onAction:()=>void, deviceTypes: IDeviceType[]}) => {
  const [deviceName, setDeviceName] = useState('')
  const [deviceType, setDeviceType] = useState<string|null>(deviceTypes.find((type)=> type.id===deviceTypes[0].id)?.id||null)
  const {t, i18n} = useTranslation()
  const currentDirection = getDirection(i18n.language);

  const addDeviceHandler = (e: React.MouseEvent<HTMLElement>)=>{
    e.preventDefault()
    if(!(deviceName&&deviceType)){
      toast.error("برجاء ملء بيانات الجهاز")
    }else{
      axios.post('/devices', {name: deviceName, type: deviceType}, {withCredentials: true})
      .then(({data})=>{
        if(!data.success) return toast.error(data.message);
        toast.success(data.message)
        onAction()
      })
    }
  }

  return (
    <div dir={currentDirection} className="bg-white rounded-lg p-8 fixed top-1/2 left-1/2 -translate-1/2 z-[102]">
      <h2 className="text-lg font-semibold mb-4">{t('devices.addDevice')}</h2>
      <form className='flex flex-col gap-4 text-right'>
        <div>
          <label className='block '>{t('devices.deviceName')}</label>
          <input className="p-2 mt-2 border border-gray-300 px-3 py-2 w-64" autoFocus onInput={(e)=>setDeviceName(e.currentTarget.value)} type="text" placeholder='مثلا: PS6 أو 6' />    
        </div>
        <div>
          <label className=' block'>{t('devices.deviceType')}</label>
          <select onInput={(e)=> setDeviceType(e.currentTarget.value)} className='w-full mt-2 p-2 border border-gray-300'>
            {deviceTypes?.map((type, i)=><option key={i} value={type.id}>{type.name}</option>)}
          </select>  
        </div>
        <button onClick={addDeviceHandler} className='px-4 py-2 bg-blue-500 hover:bg-indigo-400 duration-150 text-white rounded'>{t('modals.add')}</button>
      </form>
    </div>
  )
}

export default AddDevicePopup