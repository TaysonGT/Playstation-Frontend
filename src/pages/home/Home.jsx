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

    useEffect(()=>{
        axios.get('/devices', {withCredentials: true})
            .then(({data})=> {
                setDevices(data.devices)
                setAvailableDevices(data.devices.filter((device)=> device.status == false ))
                setUnavailableDevices(data.devices.filter((device)=> device.status == true))
                console.log(data.devices)
            })
        axios.get('/sessions', {withCredentials:true})
        .then(({data})=>{
            setSessions(data.sessions)
        })
        axios.get('/device-types', {withCredentials:true})
        .then(({data})=> setDeviceTypes(data.deviceTypes))
    }, [trigger])



  return (
    <div className='min-h-screen w-full select-none bg-indigo-200 pb-16 '>

        <DeviceDetails />
        <div className='fixed left-0 top-0 w-screen h-screen bg-layout z-[99]'></div>
        {!devices && <div dir='rtl' className='text-center pt-40'>
            <h1 className='text-3xl font-bold text-indigo-700'>لا توجد أجهزة</h1>
            <p className='text-lg font-bold mt-4 text-indigo-900'>برجاء إضافة أجهزة جديدة ...</p>
        </div>}
        {availableDevices&&
        <div className='w-[85%] mx-auto pt-28 flex flex-col items-center'>
            <h1 className='text-2xl font-bold text-white shadow-small bg-green-500 border-4 p-4 inline-block'>الأجهزة المتاحة</h1>
            <div className='flex w-full flex-wrap justify-center  gap-6 mt-8'>
                {availableDevices.map((device)=>{
                return(
                <Device  key={device.name} {...{device, setTrigger, trigger, deviceTypes}} />)
                })}
                
            </div>
        </div>
        }
        {unavailableDevices&&
        <div className='w-[85%] mx-auto mt-10 flex flex-col items-center'>
            <h1 className='text-2xl font-bold text-center shadow-small text-white border-4 bg-red-500 p-4 inline-block'>الأجهزة الغير متاحة</h1>
            <div className='flex w-full flex-wrap justify-center  gap-6 mt-8'>
                {unavailableDevices.map((device)=><Device  key={device.name} {... {device, sessions, trigger, setTrigger, deviceTypes}} />)}
            </div>
        </div>
        }
    </div>
  )
}
  

export default Home