import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DevTypePopup from './DevTypePopup';
import toast from 'react-hot-toast';

const Config = () => {
  const [configs, setConfigs] = useState([]);

  const [PlaystationName, setPlaystationName] = useState()
  const [phone, setPhone] = useState()

  const [devTypes, setDevTypes] = useState([])
  const [currDevType, setCurrDevType] = useState()
  const [currTypeId, setCurrTypeId] = useState()
  const [typePopup, setTypePopup] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [singlePrice, setSinglePrice] = useState()
  const [multiPrice, setMultiPrice] = useState()
  

  const handleSaveInfo = (e) => {
    e.preventDefault();
    axios.put('/config', {name: PlaystationName, phone})
    .then(({data})=>{
      if(data.message){
        data.success? toast.success(data.message) : toast.error(data.message)
        setRefresh(!refresh)
      }
    })
  };
  
  const handleSaveTypes = (e) => {
    e.preventDefault();
    axios.put(`/device-types/${currDevType.id}`, {singlePrice, multiPrice}, {withCredentials: true})
    .then(({data})=>{
      if(data.message){
        data.success? toast.success(data.message) : toast.error(data.message);
        setRefresh(!refresh)
      }
    })
  };

  useEffect(()=>{
    axios.get('/device-types', {withCredentials: true})
    .then(({data})=> {
      if(data.message){
        toast.error("برجاء إضافة نوع جهاز")
      }else setCurrDevType(data.deviceTypes[0])
    })
  },[refresh])
  
  useEffect(()=>{
    if(currTypeId){
      axios.get(`/device-types/${currTypeId}`, {withCredentials: true})
      .then(({data})=>{
        if(currDevType) setCurrDevType(data.deviceType)
      })
    }

    axios.get('/config', {withCredentials:true})
    .then(({data})=>{
      setConfigs({name: data.nameConfig?.value, phone: data.phoneConfig?.value})
    })

  }, [typePopup, refresh, currTypeId, currDevType])
  
  
  useEffect(()=>{
    axios.get('/device-types', {withCredentials:true})
    .then(({data})=> {
        if(data.deviceTypes){
          setDevTypes(data.deviceTypes)
        }
      })
    }, [refresh])

  
  
  return (
    <div dir='rtl' className="flex flex-col h-screen overflow-hidden pb-10 bg-[#0d47a1] pt-32 lg:px-36 px-10 font-alexandria">
      {typePopup&& <>
        <DevTypePopup {...{setTypePopup, setRefresh, refresh}} />
        <div onClick={(e)=>{e.preventDefault(); setTypePopup(false)}} className='fixed left-0 top-0 w-screen h-screen bg-layout z-[99]'></div>
      </>}
        <h1 className="text-white text-3xl font-bold mb-4">الاعدادات</h1>
      <div className='p-10 flex-grow grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 bg-white rounded-lg shadow-large'>
        <form className='flex flex-col'>
          <h1 className='font-bold text-xl' >بيانات المحل</h1>
            <div className="my-4">
              <label className="block font-semibold mb-1">اسم المحل:</label>
              <input onInput={(e)=> setPlaystationName(e.target.value)} type="text" placeholder={configs?.name} className="border px-2 py-1 w-64" />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">رقم التليفون:</label>
              <input type="tel" placeholder={configs?.phone} onInput={(e)=> setPhone(e.target.value)}  onKeyDown={(e) => {
                  const key = e.key;
                  const isValidInput = /^[0-9]*$/.test(key) || key ==="Backspace" || key === "ArrowRight" || key === "ArrowLeft";
                  if (!isValidInput) {
                    e.preventDefault();
                  }
                }} className="border px-2 py-1 w-64" />
            </div>
            <button type='submit' onClick={handleSaveInfo} className="px-4 py-2 mt-auto bg-blue-500 text-white rounded">تعديل بيانات المحل</button>
          </form>
          <form className='flex flex-col'>
            <div className='flex gap-4 items-start mb-4'>
              <h1 className='font-bold text-xl' >الأسعار</h1>
              <select onInput={e=> setCurrTypeId(e.target.value)} className='select-input p-2 border-2 border-indigo-500 text-indigo-500 outline-none cursor-pointer'>
                {devTypes?.map((devType, i)=> <option key={i} value={devType.id}>{devType.name}</option> )}
              </select>
              <button type='button' onClick={(e)=>{e.preventDefault();  setTypePopup(true)}} className='bg-[#1f1f1f] hover:bg-[#4d4d4d] duration-150 text-white p-2 px-4 rounded'>اضافة نوع جهاز</button>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">سعر الساعة (سنجل):</label>
              <input onInput={e=> setSinglePrice(e.target.value)} type="number" placeholder={currDevType?.single_price} className="border px-2 py-1 w-64"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">سعر الساعة (ملتي):</label>
              <input onInput={e=> setMultiPrice(e.target.value)} type="number" placeholder={currDevType?.multi_price} className="border px-2 py-1 w-64"/>
            </div>
            <button type='submit' onClick={handleSaveTypes} className="px-4 py-2 mt-auto bg-blue-500 text-white rounded">حفظ</button>
          </form>
      </div>
    </div>
  );
};

export default Config;
