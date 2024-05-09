import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const AddDevicePopup = ({setShowPopup}) => {
  
  const [deviceTypes, setDeviceTypes] = useState()
  const [deviceName, setDeviceName] = useState()
  const [deviceType, setDeviceType] = useState()
  const [allowAdd, setAllowAdd] = useState(true)

  useEffect(()=>{
    axios.get('/device-types', {withCredentials: true})
    .then(({data})=> {
      if(!data.message){
        setDeviceTypes(data.deviceTypes)
        setAllowAdd(true)
      }else {
        allowAdd&& toast.error(data.message)
        setAllowAdd(false)
      }
    })

  }, [allowAdd])

  useEffect(()=>{
    deviceTypes && setDeviceType(deviceTypes.find((type)=> type.id===deviceTypes[0].id).id)
  }, [deviceTypes])

  const addDeviceHandler = (e)=>{
    e.preventDefault()
    if(!(deviceName&&deviceType)){
      toast.error("برجاء ملء بيانات الجهاز")
    }else{
      axios.post('/devices', {name: deviceName, type: deviceType}, {withCredentials: true})
      .then(({data})=>{
        data.success? toast.success(data.message) : toast.error(data.message)
        setShowPopup(false)
      })
    }
  }

  return (
    <div dir='rtl' className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[102] flex items-center justify-center`}>
      <div className="bg-white rounded-lg p-8">
      <h2 className="text-lg font-semibold mb-4">اضافة جهاز</h2>
        <form className='flex flex-col gap-4 text-right'>
          <div>
            <label className='block '>اسم الجهاز</label>
            <input className="p-2 mt-2 border border-gray-300 px-3 py-2 w-64" onInput={(e)=>setDeviceName(e.target.value)} type="text" placeholder='مثلا: PS6 أو 6' />    
          </div>
          <div>
            <label className=' block'>نوع الجهاز</label>
            <select onInput={(e)=> setDeviceType(e.target.value)} className='w-full mt-2 p-2 border border-gray-300'>
              {deviceTypes?.map((type, i)=><option key={i} value={type.id}>{type.name}</option>)}
            </select>  
          </div>
          <button onClick={addDeviceHandler} className='px-4 py-2 bg-blue-500 hover:bg-indigo-400 duration-150 text-white rounded'>إضافة</button>
        </form>
      </div>
    </div>
  )
}

export default AddDevicePopup