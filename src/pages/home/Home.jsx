import axios from 'axios'
import Device from './Device'
import { useState, useEffect } from 'react'
import DeviceDetails from './DeviceDetails'


const Home = () => {
    
    const [devices, setDevices] = useState()    
    const [sessions, setSessions] = useState()    
    const [deviceTypes, setDeviceTypes] = useState()

    const [availableDevices, setAvailableDevices] = useState()
    const [unavailableDevices, setUnavailableDevices] = useState()
    const [trigger, setTrigger] = useState(false)
    const [refresh, setRefresh] = useState(false)

    useEffect(()=>{
        axios.get('/devices', {withCredentials: true})
            .then(({data})=> {
                setDevices(data.devices.sort((a, b) => a.name - b.name))
            })
        axios.get('/device-types', {withCredentials:true})
        .then(({data})=> setDeviceTypes(data.deviceTypes))
        
    }, [trigger, sessions])
    
    useEffect(()=>{
      axios.get('/sessions', {withCredentials:true})
        .then(({data})=>{
            setSessions(data.sessions)
        })
    },[trigger])
    
    useEffect(()=>{
      if(devices) {
        if(refresh){
          setAvailableDevices([])
          setUnavailableDevices([])
          setRefresh(false)
        }
        setTimeout(()=>{
          setAvailableDevices(devices.filter((device)=> device.status == false ))
          setUnavailableDevices(devices.filter((device)=> device.status == true))
        },500)
      }
    },[devices, sessions])


  return (
    <div dir="rtl" className='min-h-screen w-full select-none bg-[#f5f5f5] pb-16 '>
        
        {devices?.length<1 && <div dir='rtl' className='text-center pt-40'>
            <h1 className='text-3xl font-bold text-indigo-700'>لا توجد أجهزة</h1>
            <p className='text-lg font-bold mt-4 text-indigo-900'>برجاء إضافة أجهزة جديدة ...</p>
        </div>}
        {availableDevices?.length>0&&
        <div className='w-[85%] mx-auto flex flex-col items-center pt-32'>
            <h1 className='text-3xl font-bold text-[#37474f] inline-block'>الأجهزة المتاحة</h1>
            <div className='flex w-full flex-wrap justify-center  gap-6 mt-8'>
                {availableDevices?.map((device)=>{
                return(
                <Device key={device.id} {...{device, setTrigger, trigger, deviceTypes,devices}} />)
                })}
                
            </div>
        </div>
        }
        {unavailableDevices?.length>0&&
        <div className={'w-[85%] mx-auto  flex flex-col items-center ' + (availableDevices?.length<1? 'pt-32': 'pt-16')}>
            <h1 className='text-3xl font-bold text-[#37474f] inline-block'>الأجهزة المشغولة</h1>
            <div className='flex w-full flex-wrap justify-center  gap-6 mt-8'>
                {unavailableDevices?.map((device)=><Device  key={device.id} {... {device, setUnavailableDevices, sessions, trigger, setTrigger, deviceTypes, devices, refresh,setRefresh}} />)}
            </div>
        </div>
        }
    </div>
  )
}
  

export default Home