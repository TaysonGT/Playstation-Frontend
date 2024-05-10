import axios from 'axios'
import React, {useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DeviceDetails from './DeviceDetails'


const Device = ({device, sessions, trigger, setTrigger, deviceTypes, devices, setUnavailableDevices, refresh, setRefresh}) => {
    const [timerState, setTimerState] = useState(false)
    const [clock, setClock] = useState(null)
    const [isInputDisabled, setIsInputDisabled] = useState(true)
    const [showDetails, setShowDetails] = useState(false)
    

    const [timeType, setTimeType] = useState()
    const [playType, setPlayType] = useState()
    const [minutes, setMinutes] = useState(0)
    const [hours, setHours] = useState(0)
    
    const [currentSession, setCurrentSession] = useState()
    const [currentDeviceType, setCurrentDeviceType] = useState()
    
    useEffect(()=>{
      if(!timeType){
        setTimeType("open")
      }
      if(!playType){
        setPlayType("single")
      }
    }, [playType, timeType])
    
    
    
    const classnames = {
        input: 'w-[75%] text-[#161925] border border-[#161925] p-1',
        subInput: "w-full text-[#161925] text-center  rounded disabled:bg-gray-400 border border-[#161925] disabled:border-gray-600 duration-150 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        inputWrapper: 'flex gap-4 justify-between mt-1 items-center',
        label: "font-bold "
    }


    const startDeviceHandler = (e)=>{
      e.preventDefault();
      let currHours = parseInt(hours)
      let currMinutes = parseInt(minutes)
      let date = new Date().setHours(new Date().getHours() + currHours).setMinutes(new Date().getMinutes() + currMinutes)
      setUnavailableDevices(null)
      axios.post(`/sessions/${e.target.id}`, {play_type: playType, time_type: timeType, end_time: date}, {withCredentials: true})
      .then(({data})=>{
        if(data.message){
          setTrigger(!trigger)
          data.success? toast.success(data.message) : toast.error(data.message)
        }
      })
    }
    
    const timeOpenHandler = (e)=>{
        if(e.target.value === "time") {
            setTimeType("time")
            setIsInputDisabled(false) 
        }else {
            setIsInputDisabled(true)
            setTimeType("open")
        }
    }
    
    const increment = ()=>{
        let time = Math.floor((Date.now() - new Date(currentSession.start_at).getTime()) /1000)
        const hours = Math.floor(time / (60*60))
        const minutes = Math.floor(time/(60)) % 60
        const seconds = time % 60

        let strHours = hours>9? hours : `0${hours}`
        let strMinutes = minutes>9? minutes : `0${minutes}`
        let strSeconds = seconds>9? seconds : `0${seconds}`

        let timeString = (`${strHours}:${strMinutes}:${strSeconds}`)
        setClock(timeString)
        
        time ++;
        
    }
    
    const decrement = ()=>{
      let time =  Math.floor((new Date(currentSession.end_at) - new Date()) /1000)
        if (time>0) {
            const hours = Math.floor(time / (60*60))
            const minutes = Math.floor(time/(60)) % 60
            const seconds = time % 60
    
            let strHours = hours>9? hours : `0${hours}`
            let strMinutes = minutes>9? minutes : `0${minutes}`
            let strSeconds = seconds>9? seconds : `0${seconds}`
    
            let timeString = (`${strHours}:${strMinutes}:${strSeconds}`)
            setClock(timeString)
            
            time --;
        }else{
            let timeString = (`00:00:00`)
            setClock(timeString)
        }
    }
    
    
    useEffect(()=>{
      let run=null
      if(!timerState && currentSession){
        if(currentSession.time_type === "open") {
            increment()
            run = setInterval(increment, 1000)
        }else {
          run = setInterval(decrement ,1000)
        }
        
        setTimerState(true)
      }
    },[currentSession, timerState])
    
    useEffect(()=>{
      if(sessions){  
        setCurrentSession(sessions.filter((session)=> session.device_id === device.id)[0])
      }
    },[sessions, device.id])
    
    useEffect(()=>{
      deviceTypes&& setCurrentDeviceType(deviceTypes.filter((type)=> type.id === device.type)[0])
    },[deviceTypes, device.type])
    
  return (
    <>
    {showDetails&&<>
        <div onClick={()=>setShowDetails(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-150 z-[100]'></div>
        <DeviceDetails {...{device, setShowDetails, currentSession, clock, setTrigger, trigger, devices, currentDeviceType, refresh, setRefresh, setUnavailableDevices}} />
    </>
    }
    <div className='bg-[#ffffff] w-[250px] border-2 border-[#e0e0e0] flex flex-col items-center rounded p-5 text-[#333] shadow-lg duration-[.3s] h-[320px]'>
        <div className='flex justify-between w-full items-center'>
            <h1 className={'font-semibold px-[20px] py-[3px] text-white rounded ' + (device.status?  'bg-red-500' : 'bg-[#3cb75b]')}>{device.name}</h1>
            <div className='bg-white border-2 border-black text-black p-1 px-4 rounded font-medium'>{currentDeviceType?.name}</div>
        </div>
        { !device.status? 
        <form dir="rtl" className='w-full flex flex-grow flex-col gap-1 text-sm font-bold mt-6 '>
            <div className='flex justify-between gap-2 items-center'>
                <label className="font-bold text-sm w-[100px]">نوع اللعب:</label>
                <select onInput={e=> setPlayType(e.target.value)} className={classnames.input}>
                    <option className={classnames.option} value="single">سنجل</option>
                    <option className={classnames.option} value="multi">ملتي</option>
                </select>
            </div>
            <div className='flex justify-between gap-2 items-center mt-4 '>
                <label className="font-bold text-sm w-[100px]">نوع الوقت:</label>
                <select onInput={timeOpenHandler} className={classnames.input}>
                    <option className={classnames.option} value="open">مفتوح</option>
                    <option className={classnames.option} value="time">وقت</option>
                </select>
            </div>
            <div className='mt-4 flex flex-col items-center'>
                <label className='font-bold text-md'>الوقت</label>
                <div className='flex gap-4 justify-between my-3'>
                    <div className='flex justify-between gap-2 items-center'>
                        <label className={classnames.label} >دقيقة</label>
                        <input type="number" onInput={(e)=> setMinutes(e.target.value)} disabled={isInputDisabled} className={classnames.subInput} placeholder={!isInputDisabled? 0 : null}/>
                    </div>
                    <div className='flex justify-between gap-2 items-center'>
                        <label className={classnames.label}>ساعة</label>
                        <input type="number" onInput={e=> setHours(e.target.value)} disabled={isInputDisabled} className={classnames.subInput} placeholder={!isInputDisabled? 0: null} />
                    </div>
                </div>
            </div>
            <button onClick={startDeviceHandler} id={device.id} className=' bg-[#37474f] text-white p-3 text-md rounded-md hover:bg-[#4f6874]  duration-150 active:shadow-hardInner mt-auto '>بدء</button>
        </form> :
        <div className='mt-5 flex flex-col items-center gap-3 h-full w-full'>
            <div className={'w-[90%] p-4 text-center text-3xl font-bold bg-[#212121] text-white bg-center bg-cover border-emerald-50 border rounded  ' + (currentSession?.time_type === "open"? 'text-red-500' :  'text-green-500')}>{clock? clock : "00:00:00"}</div>
            <div className='flex justify-between gap-4 p-2 '>
                <p className={'text-sm font-medium p-3 py-2 rounded-sm w-full text-white ' + (currentSession?.time_type==="open" ?  'bg-red-700': 'bg-teal-600')} >{currentSession?.time_type.toUpperCase()}</p>
                <p className='text-sm font-medium p-3 py-2 bg-slate-700 rounded-sm w-full text-white'>{currentSession?.play_type.toUpperCase()}</p>
            </div>
            <button onClick={()=> setShowDetails(true)} id={device.id} className=' bg-[#00b4d8] p-3 text-md rounded-md text-white hover:bg-[#90e0ef] duration-200 active:shadow-hardInner mt-auto w-full text-center '>تفاصيل</button>
        </ div>
        }

    </div>
    </>
  )
}

export default Device