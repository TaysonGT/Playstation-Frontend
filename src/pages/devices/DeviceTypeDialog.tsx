import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { getDirection } from '../../i18n';
import { IDeviceType } from '../../types';

interface Props{
  show:boolean, 
  onAction: ()=>void, 
  hide: ()=>void,
  deviceType: IDeviceType|null
  type: 'edit'|'create'
}

const DeviceTypeDialog:React.FC<Props> = ({ show, type, deviceType, onAction, hide }) => {
  const {i18n, t} = useTranslation()
  const currentDirection = getDirection(i18n.language)
  
  const [formData, setFormData] = useState(
    (type==='edit'&&deviceType)?
    {
      name: deviceType.name,
      multi_price: deviceType.multi_price,
      single_price: deviceType.single_price
    }:
    {
      name: '',
      multi_price: 0,
      single_price: 0
    }
  )

  useEffect(()=>{
    if(!show){
      setFormData({
        name: '',
        multi_price: 0,
        single_price: 0
      })
      return
    }
    if(deviceType&&type==='edit'){
      setFormData({
        name: deviceType.name,
        multi_price: deviceType.multi_price,
        single_price: deviceType.single_price
      })
    }
  },[deviceType, show])

  const handleAddDeviceType = (e:React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    if(!formData.multi_price||!formData.single_price||!formData.name){
      toast.error(t('forms.fillAllFields'))
      return
    }
    axios.post('/device-types', formData, {withCredentials: true})
    .then(({data})=> {
        if(data.message){
          data.success? toast.success(data.message) : toast.error(data.message)
        }
    }).catch(err=>console.log(err))
    .finally(()=>onAction())
  };

  
  const handleEditDeviceType = (e:React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    if(!deviceType||type!=='edit'){
      toast.error('Please pick a device type to edit')
      return
    }

    axios.put(`/device-types/${deviceType.id}`, formData, {withCredentials: true})
    .then(({data})=> {
        if(data.message){
          data.success? toast.success(data.message) : toast.error(data.message)
        }
    }).catch(err=>console.log(err))
    .finally(()=>onAction())
  };

  return (
    <div dir={currentDirection} className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-102 flex items-center justify-center ${show?'opacity-100 pointer-events-auto':'opacity-0 pointer-events-none'}`}>
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-lg text-center font-semibold mb-4">{type==='create'?t('deviceTypes.addDeviceType'):t('deviceTypes.editDeviceType')}</h2>

        <form className='mt-6'>
          <div className="mb-4">
            <label className="block font-semibold mb-1">النوع:</label>
            <input
              type="text"
              readOnly={type==='edit'}
              placeholder='مثلا: PS4, PS5، XBOX'
              onChange={(e) => setFormData(prev=>({...prev, name: e.target.value}))}
              className="border px-3 py-2 w-64"
              value={formData.name}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">سعر السنجل:</label>
            <input
              type="number"
              onChange={(e) => setFormData(prev=>({...prev, single_price: parseInt(e.target.value||'0')}))}
              className="border px-3 py-2 w-64"
              value={formData.single_price||''}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">سعر الملتي:</label>
            <input
              type="number"
              onChange={(e) => setFormData(prev=>({...prev, multi_price: parseInt(e.target.value||'0')}))}
              className="border px-3 py-2 w-64"
              value={formData.multi_price||''}
            />
          </div>
          <div className="flex gap-2 ">
            <button type='button' onClick={()=>hide()} className="px-4 py-2 flex-1 cursor-pointer bg-gray-200 duration-150 hover:bg-gray-300 text-gray-700 border border-gray-400 rounded">{t('modals.cancel')}</button>
            <button type='submit' onClick={type==='create'?handleAddDeviceType:handleEditDeviceType} className="px-4 py-2 flex-1 cursor-pointer bg-blue-500 hover:bg-blue-400 duration-150 text-white rounded">{type==='edit'?t('modals.save'):t('modals.add')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceTypeDialog