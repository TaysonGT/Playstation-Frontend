import React, {useEffect, useState } from 'react'
import DeviceDetails from './DeviceDetails'
import { IDevice } from './types'
import { useDevices } from '../../context/DeviceContext'


const Device = ({device}:{device: IDevice}) => {
  const {deviceTypes, sessions, startSession} = useDevices()

  const deviceType = deviceTypes.find((t)=>t.id===device.type)
  const session = sessions.find((s)=>s.device_id===device.id)
  
  const [timerState, setTimerState] = useState(false)
  const [clock, setClock] = useState<string>('')
  const [isInputDisabled, setIsInputDisabled] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  
  const [timeType, setTimeType] = useState<string>("open")
  const [playType, setPlayType] = useState<string>("single")
  const [minutes, setMinutes] = useState<number>(0)
  const [hours, setHours] = useState<number>(0)

  const classnames = {
      input: 'w-[75%] text-[#161925] border border-[#161925] p-1',
      subInput: "w-full text-[#161925] text-center  rounded disabled:bg-gray-400 border border-[#161925] disabled:border-gray-600 duration-150 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
      inputWrapper: 'flex gap-4 justify-between mt-1 items-center',
      label: "font-bold "
  }

  const startDeviceHandler = (e: React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    let end_time = undefined
    if(timeType === 'time') {
        end_time = new Date()
        end_time.setHours(end_time.getHours()+hours)
        end_time.setMinutes(end_time.getMinutes()+minutes)
    }
    startSession({device_id: device.id, play_type: playType, time_type: timeType, end_time})
  }
  
  const timeTypeHandler = (timeType: string)=>{
      setTimeType(timeType)
      timeType === "time"? setIsInputDisabled(false) : setIsInputDisabled(true)
  }

  const getStringTime = (time: number)=>{
    const hours = Math.floor(time / (60*60))
    const minutes = Math.floor(time/(60)) % 60
    const seconds = time % 60

    const strHours = hours>9? hours : `0${hours}`
    const strMinutes = minutes>9? minutes : `0${minutes}`
    const strSeconds = seconds>9? seconds : `0${seconds}`

    return `${strHours}:${strMinutes}:${strSeconds}`
  }
  
  const increment = ()=>{
    let time = Math.floor((Date.now() - new Date(session!.start_at).getTime()) /1000)
    setClock(getStringTime(time))
    time ++;
  }
  
  const decrement = ()=>{
    let time =  Math.floor((new Date(session!.end_at).getTime() - new Date().getTime()) /1000)
    if (time>0) {
        setClock(getStringTime(time))
        time --;
    }else{
        setClock(`00:00:00`)
    }
  }
  
  useEffect(()=>{
    let run:any=null
    if(!timerState&&session){
      if(session.time_type === "open") {
          increment()
          run = setInterval(increment, 1000)
      }else if(session.time_type === "time"){
        run = setInterval(decrement ,1000)
      }
      
      setTimerState(true)
    }
  },[timerState])

  return (
    <>
    {(showDetails&&session)&&<>
        <div onClick={()=>setShowDetails(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-150 z-[100]'></div>
        <DeviceDetails {...{device, session, clock, deviceType: deviceType!}} />
    </>
    }
    <div className='bg-[#ffffff] w-[250px] border-2 border-[#e0e0e0] flex flex-col items-center rounded p-5 text-[#333] shadow-lg duration-[.3s] h-[320px]'>
        <div className='flex justify-between w-full items-center'>
            <h1 className={'font-semibold px-[20px] py-[3px] text-white rounded ' + (device.status?  'bg-red-500' : 'bg-[#3cb75b]')}>{device.name}</h1>
            <div className='bg-white border-2 border-black text-black p-1 px-4 rounded font-medium'>{deviceType?.name}</div>
        </div>
        { !device.status? 
        <form dir="rtl" className='w-full flex flex-grow flex-col gap-1 text-sm font-bold mt-6'>
            <div className='flex justify-between gap-2 items-center'>
                <label className="font-bold text-sm w-[100px]">نوع اللعب:</label>
                <select onInput={e=> setPlayType(e.currentTarget.value)} className={classnames.input}>
                    <option value="single">سنجل</option>
                    <option value="multi">ملتي</option>
                </select>
            </div>
            <div className='flex justify-between gap-2 items-center mt-4 '>
                <label className="font-bold text-sm w-[100px]">نوع الوقت:</label>
                <select onInput={(e)=> timeTypeHandler(e.currentTarget.value)} className={classnames.input}>
                    <option value="open">مفتوح</option>
                    <option value="time">وقت</option>
                </select>
            </div>
            <div className='mt-4 flex flex-col items-center'>
                <label className='font-bold text-md'>الوقت</label>
                <div className='flex gap-4 justify-between my-3'>
                    <div className='flex justify-between gap-2 items-center'>
                        <label className={classnames.label} >دقيقة</label>
                        <input type="number" onInput={(e)=> setMinutes(parseInt(e.currentTarget.value))} disabled={isInputDisabled} className={classnames.subInput} placeholder={!isInputDisabled? "0" : ""}/>
                    </div>
                    <div className='flex justify-between gap-2 items-center'>
                        <label className={classnames.label}>ساعة</label>
                        <input type="number" onInput={e=> setHours(parseInt(e.currentTarget.value))} disabled={isInputDisabled} className={classnames.subInput} placeholder={!isInputDisabled? "0": ""} />
                    </div>
                </div>
            </div>
            <button onClick={startDeviceHandler} id={device.id} className=' bg-[#37474f] text-white p-3 text-md rounded-md hover:bg-[#4f6874]  duration-150 active:shadow-hardInner mt-auto '>بدء</button>
        </form> :
        <div className='mt-5 flex flex-col items-center gap-3 h-full w-full'>
            <div className={'w-[90%] p-4 text-center text-3xl font-bold bg-[#212121] text-white bg-center bg-cover border-emerald-50 border rounded  ' + (session?.time_type === "open"? 'text-red-500' :  'text-green-500')}>{clock? clock : "00:00:00"}</div>
            <div className='flex justify-between gap-4 p-2 '>
                <p className={'text-sm font-medium p-3 py-2 rounded-sm w-full text-white ' + (session?.time_type==="open" ?  'bg-red-700': 'bg-teal-600')} >{session?.time_type.toUpperCase()}</p>
                <p className='text-sm font-medium p-3 py-2 bg-slate-700 rounded-sm w-full text-white'>{session?.play_type.toUpperCase()}</p>
            </div>
            <button onClick={()=> setShowDetails(true)} id={device.id} className=' bg-[#00b4d8] p-3 text-md rounded-md text-white hover:bg-[#90e0ef] duration-200 active:shadow-hardInner mt-auto w-full text-center '>تفاصيل</button>
        </ div>
        }

    </div>
    </>
  )
}

export default Device