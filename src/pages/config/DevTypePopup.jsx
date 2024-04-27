import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const DevTypePopup = ({ setTypePopup, setRefresh, refresh }) => {
    const [name, setName] = useState()
    const [single_price, setSinglePrice] = useState()
    const [multi_price, setMultiPrice] = useState()
    
  const handleAddDevType = (e) => {
    e.preventDefault()
    axios.post('/device-types', {name, single_price, multi_price})
    .then(({data})=> {
        if(data.message){
          data.success? toast.success(data.message) : toast.error(data.message)
        }
    }).catch(err=>(err))
    setRefresh(!refresh)
    setTypePopup(false)
  };

  return (
    <div className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[102] flex items-center justify-center`}>
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-lg font-semibold mb-4">اضافة نوع جهاز</h2>
        <form>
          <div className="mb-4">
            <label className="block font-semibold mb-1">النوع:</label>
            <input
              type="text"
              placeholder='مثلا: PS4, PS5، XBOX'
              onInput={(e) => setName(e.target.value)}
              className="border px-3 py-2 w-64"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">سعر السنجل:</label>
            <input
              type="number"
              onInput={(e) => setSinglePrice(e.target.value)}
              className="border px-3 py-2 w-64"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">سعر الملتي:</label>
            <input
              type="number"
              onInput={(e) => setMultiPrice(e.target.value)}
              className="border px-3 py-2 w-64"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type='button' onClick={()=>setTypePopup(false)} className="px-4 py-2 bg-gray-400 duration-150 hover:bg-gray-300 text-white rounded mr-2">الغاء</button>
            <button type='submit' onClick={handleAddDevType} className="px-4 py-2 bg-blue-500 hover:bg-indigo-400 duration-150 text-white rounded">اضافة</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DevTypePopup