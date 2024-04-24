import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const AddDevicePopup = ({setShowPopup}) => {
  
  const [deviceTypes, setDeviceTypes] = useState()
  const [deviceName, setDeviceName] = useState()
  const [deviceType, setDeviceType] = useState()
  const [currDevType, setCurrDevType] = useState()

  useEffect(()=>{
    axios.get('/device-types', {withCredentials: true})
    .then(({data})=> {
      setDeviceTypes(data.deviceTypes)
      setDeviceType(data.deviceTypes[0].id)
    })
  }, [])

  useEffect(()=>{
    deviceTypes && setDeviceType(deviceTypes.find((type)=> type.id==currDevType))
    console.log(deviceTypes, currDevType, deviceName)
  }, [currDevType])

  const addDeviceHandler = (e)=>{
    e.preventDefault()
    if(!(deviceName&&deviceType)){
      toast.error("برجاء ملء بيانات الجهاز")
    }else 
    axios.post('/devices', {name: deviceName, type: deviceType}, {withCredentials: true})
    .then(({data})=>{
      data.success? toast.success(data.message) : toast.error(data.message)
      console.log(data)
    })
    setShowPopup(false)
  }

  return (
    <div className='pt-8 px-16 pb-10 bg-[#1b1b1f] border-2 border-white rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[100]'>
      <h1 className='text-3xl font-bold text-white text-center'>إضافة جهاز</h1>
        <form className='flex flex-col gap-4 mt-6 text-right'>
          <div>
            <label className='block text-white'>اسم الجهاز</label>
            <input className="p-2 mt-2" onInput={(e)=>setDeviceName(e.target.value)} type="text" />    
          </div>
          <div>
            <label className='text-white block'>نوع الجهاز</label>
            <select onInput={(e)=> setCurrDevType(e.target.value)} className='w-full mt-2 p-2'>
              {deviceTypes?.map((type, i)=><option key={i} value={type.id}>{type.name}</option>)}
            </select>  
          </div>
          <button onClick={addDeviceHandler} className='bg-white hover:bg-indigo-200 duration-200 rounded p-3 mt-8 text-xl font-bold'>إضافة</button>
        </form>
    </div>
  )
}

export default AddDevicePopup