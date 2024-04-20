import React, { useEffect, useState, useRef } from 'react'

import PS4 from '../assets/ps4.png'
import PS5 from '../assets/ps5.png'
import { Link } from 'react-router-dom'

const Device = ({deviceData, session}) => {
    const device = deviceData
    const [timerState, setTimerState] = useState(false)
    const [clock, setClock] = useState(null)
    const [isInputDisabled, setIsInputDisabled] = useState(true)

    const classnames = {
        input: 'w-[75%] text-[#161925] border border-[#161925]',
        subInput: "w-full text-[#161925] text-center  rounded disabled:bg-gray-400 border border-[#161925] disabled:border-gray-600 duration-150 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        inputWrapper: 'flex gap-4 justify-between mt-1 items-center',
        label: "font-bold "
    }


    let time = !device.status? Date.now() - session.startAt : null

    const timeOpenHandler = (e)=>{
        e.target.value == "time" ? setIsInputDisabled(false) : setIsInputDisabled(true)
        
        
    }

    const timer = (e)=>{
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

    if(!timerState && !clock){
        timer()
        const run = setInterval(timer, 1000);

        setTimerState(true)
    }
    
  return (
    <div className=' bg-indigo-900  w-[200px] flex flex-col items-center rounded p-5 text-[#fff] hover:shadow-lg duration-[.3s] h-[300px]'>
        <div className='flex justify-between w-full items-center'>
            <h1 className={'font-semibold px-[20px] py-[3px] text-white rounded ' + (!device.status?  'bg-red-500' : 'bg-[#3cb75b]')}>{device.name}</h1>
            <img className='w-[80px] p-[8px] rounded bg-indigo-950 ' src={device.type==="PS5"? PS5 : PS4 } alt="" />
        </div>
        { device.status? 
        
        <form dir="rtl" className='w-full flex flex-col gap-1 text-sm font-bold mt-6 '>
            <div className='flex justify-between gap-2 items-center'>
                
                <label className="font-bold text-sm w-[100px]">نوع اللعب:</label>
                <select className={classnames.input}>
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
                        <input type="number" disabled={isInputDisabled} className={classnames.subInput} defaultValue={!isInputDisabled? 0 : null}/>
                    </div>
                    <div className='flex justify-between gap-2 items-center'>
                        <label className={classnames.label}>ساعة</label>
                        <input type="number" disabled={isInputDisabled} className={classnames.subInput} defaultValue={!isInputDisabled? 0: null} />
                    </div>
                </div>
            </div>
            <button className=' bg-[#11bb66] text-white p-3 text-md rounded-md hover:bg-[#7fbea7]  duration-150 active:shadow-hardInner mt-auto '>بدء</button>
        </form> :
            <div className='mt-5 flex flex-col items-center gap-3 h-full w-full'>
                    <div className='p-5 text-3xl font-bold bg-[white] text-gray-600  bg-center bg-cover border-emerald-50 border  rounded shadow-hardInner '>{clock? clock : "00:00:00"}</div>
                <div className='flex justify-between gap-4 p-2 '>
                    <p className='text-sm font-medium p-3 py-2 bg-white border-[#4090b0] border-b-[5px] rounded-sm w-full text-[#4090b0]'>Open</p>
                    <p className='text-sm font-medium p-3 py-2 bg-white  border-[#568968] border-b-[5px] rounded-sm w-full text-[#568968]'>Single</p>
                </div>
                
                <Link className=' bg-[#00b4d8]  p-3 text-md rounded-md text-white hover:bg-[#90e0ef] duration-200 active:shadow-hardInner mt-auto w-full text-center '>تفاصيل</Link>
            </ div>
        }

    </div>
  )
}

export default Device