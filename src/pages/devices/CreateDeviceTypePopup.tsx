import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { getDirection } from '../../i18n';

const CreateDeviceTypePopup = ({ show, onAction, hide }:{show:boolean, onAction: ()=>void, hide: ()=>void}) => {
    const [name, setName] = useState('')
    const [single_price, setSinglePrice] = useState(0)
    const [multi_price, setMultiPrice] = useState(0)
    const {i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language)

  const handleAddDevType = (e:React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    axios.post('/device-types', {name, single_price, multi_price}, {withCredentials: true})
    .then(({data})=> {
        if(data.message){
          data.success? toast.success(data.message) : toast.error(data.message)
        }
    }).catch(err=>console.log(err))
    .finally(()=>onAction())
  };

  return (
    <div dir={currentDirection} className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[102] flex items-center justify-center ${show?'opacity-100 pointer-events-auto':'opacity-0 pointer-events-none'}`}>
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-lg text-center font-semibold mb-4">اضافة نوع جهاز</h2>
        <form className='mt-6'>
          <div className="mb-4">
            <label className="block font-semibold mb-1">النوع:</label>
            <input
              type="text"
              placeholder='مثلا: PS4, PS5، XBOX'
              onInput={(e) => setName(e.currentTarget.value)}
              className="border px-3 py-2 w-64"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">سعر السنجل:</label>
            <input
              type="number"
              onInput={(e) => setSinglePrice(parseInt(e.currentTarget.value))}
              className="border px-3 py-2 w-64"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">سعر الملتي:</label>
            <input
              type="number"
              onInput={(e) => setMultiPrice(parseInt(e.currentTarget.value))}
              className="border px-3 py-2 w-64"
            />
          </div>
          <div className="flex gap-2 ">
            <button type='button' onClick={()=>hide()} className="px-4 py-2 flex-1 cursor-pointer bg-gray-200 duration-150 hover:bg-gray-300 text-gray-700 border border-gray-400 rounded">الغاء</button>
            <button type='submit' onClick={handleAddDevType} className="px-4 py-2 flex-1 cursor-pointer bg-blue-500 hover:bg-blue-400 duration-150 text-white rounded">اضافة</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDeviceTypePopup