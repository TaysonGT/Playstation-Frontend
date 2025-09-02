import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DevTypePopup from './popups/DevTypePopup';
import NewUser from './popups/NewUser';
import EditUser from './popups/EditUser'
import DeleteConfirm from './popups/DeleteConfirm';
import toast from 'react-hot-toast';
import { IDeviceType, IFinance } from '../home/types';
import { fetchDeviceTypes } from '../../api/devices';
import DarkBackground from '../../components/DarkBackground';

const Config = () => {
  const [configs, setConfigs] = useState<{name: string, phone: string}>();

  const [playstationName, setPlaystationName] = useState('')
  const [phone, setPhone] = useState('')

  const [currentUser, setCurrentUser] = useState<string|null>(null)
  
  const [editPopup, setEditPopup] = useState(false)
  const [addPopup, setAddPopup] = useState(false)
  const [typePopup, setTypePopup] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  
  const [isLoading, setIsLoading] = useState(true)
  
  const [deviceTypes, setDeviceTypes] = useState<IDeviceType[]>([])
  const [currentDeviceType, setCurrentDeviceType] = useState<string|null>(null)
  const [singlePrice, setSinglePrice] = useState<number>(0)
  const [multiPrice, setMultiPrice] = useState<number>(0)
  
  const [userFinances, setUserFinances] = useState<IFinance[]>([])

  const getAll = async()=>{
    setIsLoading(true)
    await axios.get('/finances/users', {withCredentials: true})
    .then(({data})=>{
      setUserFinances(data.usersFinances)
    })
    await fetchDeviceTypes().then(({data})=>{
      if(data.success){
        setDeviceTypes(data.deviceTypes)
        setCurrentDeviceType(data.deviceTypes[0]?.id)
      }
    })
    await axios.get('/config', {withCredentials:true})
    .then(({data})=>{
      setConfigs({name: data.nameConfig?.value, phone: data.phoneConfig?.value})
    })
    setIsLoading(false)
  }

  const handleSaveInfo = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    axios.put('/config', {name: playstationName, phone}, {withCredentials:true})
    .then(({data})=>{
      if(data.message){
        data.success? toast.success(data.message) : toast.error(data.message)
      }
    }).finally(()=> getAll())
  };
  
  const handleSaveTypes = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if(!currentDeviceType) {
      toast.error('برجاء تحديد نوع جهاز')
      return
    }
    axios.put(`/device-types/${currentDeviceType}`, {singlePrice, multiPrice}, {withCredentials: true})
    .then(({data})=>{
      if(data.message){
        data.success? toast.success(data.message) : toast.error(data.message);
      }
    }).finally(()=>getAll())
  };

  useEffect(()=>{
    getAll()
  },[])
  
  return (
    <div dir='rtl' className="flex flex-col h-screen overflow-hidden pb-10 bg-[#0d47a1] pt-32 lg:px-36 px-10 font-alexandria">
      {typePopup&& <>
        <DevTypePopup {...{onAction: async()=>{
          setTypePopup(false)
          await getAll()
        }, hide: ()=>setTypePopup(false)}} />
        <DarkBackground {... {show: typePopup
        , cancel: ()=>setTypePopup(false)}}/>
      </>}
      {addPopup&& <>
        <NewUser {...{onAction: async()=>{
          setAddPopup(false)
          await getAll()
        }}}/>
        <div onClick={(e)=>{e.preventDefault(); setAddPopup(false)}} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-150 z-[99]'></div>
      </>
      }
      {(editPopup&&currentUser)&& <>
        <EditUser {...{onAction: async()=>{
          setEditPopup(false)
          await getAll()
          }, currentUser}}/>
        <div onClick={(e)=>{e.preventDefault(); setEditPopup(false)}} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-150 z-[99]'></div>
      </>
      }
      {(confirmDelete&&currentUser)&& <>
        <DeleteConfirm {...{onAction: async()=>{
          setConfirmDelete(false)
          await getAll()
        }, hide: ()=> setConfirmDelete(false), currentUser}}/>
        <div onClick={(e)=>{e.preventDefault(); setConfirmDelete(false)}} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-150 z-[99]'></div>
      </>
      }
        <h1 className="text-white text-3xl font-bold mb-4">الاعدادات</h1>
        <div className='p-10 grow flex flex-col lg:flex-row gap-4 lg:gap-y-4 gap-y-8 bg-white rounded-lg shadow-large lg:overflow-y-hidden overflow-y-auto'>
          <div className='flex-1/2 shrink gap-4 flex flex-col lg:overflow-y-auto'>
            <form onSubmit={handleSaveInfo} className='flex flex-col gap-4'>
              <h1 className='font-bold text-xl' >بيانات المحل</h1>
              <div className='flex flex-col'>
                <label className="block font-semibold mb-1">اسم المحل:</label>
                <input onInput={(e)=> setPlaystationName(e.currentTarget.value)} type="text" placeholder={configs?.name} className=" border px-2 py-1" />
              </div>
              <div className='flex flex-col'>
                <label className="block font-semibold mb-1">رقم التليفون:</label>
                <input type="tel" placeholder={configs?.phone} onInput={(e)=> setPhone(e.currentTarget.value)}  onKeyDown={(e) => {
                    const key = e.key;
                    const isValidInput = /^[0-9]*$/.test(key);
                    if (!isValidInput && key != 'Backspace' && key != 'ArrowRight' && key != 'ArrowLeft' && key != 'Shift' && key != 'Home' && key != 'End' && key != 'Del' && key != 'Enter') {
                      e.preventDefault();
                    }
                  }} className="border px-2 py-1 text-right" />
              </div>
              <input type='submit' className="px-4 py-2 mt-auto bg-blue-500 text-white rounded" value='تعديل بيانات المحل'/>
            </form>
            <form className='gap-4 flex flex-col'>
              <div className='flex gap-4 items-start'>
                <h1 className='font-bold text-xl' >الأسعار</h1>
                <select onSelect={e=> setCurrentDeviceType(e.currentTarget.value)} className='select-input p-2 border-2 border-indigo-500 text-indigo-500 outline-none cursor-pointer'>
                  {deviceTypes?.map((deviceType, i)=> <option key={i} value={deviceType.id}>{deviceType.name}</option> )}
                </select>
                <button type='button' onClick={(e)=>{e.preventDefault();  setTypePopup(true)}} className='bg-[#1f1f1f] hover:bg-[#4d4d4d] duration-150 text-white p-2 px-4 rounded'>اضافة نوع جهاز</button>
              </div>
              <div className='flex flex-col'>
                <label className="block font-semibold mb-1">سعر الساعة (سنجل):</label>
                <input onInput={e=> setSinglePrice(parseInt(e.currentTarget.value))} type="number" placeholder={deviceTypes.find(d=>d.id===currentDeviceType)?.single_price.toString()||"0"} className="border px-2 py-1"
                />
              </div>
              <div className='flex flex-col'>
                <label className="block font-semibold mb-1">سعر الساعة (ملتي):</label>
                <input onInput={e=> setMultiPrice(parseInt(e.currentTarget.value))} type="number" placeholder={deviceTypes.find(d=>d.id===currentDeviceType)?.multi_price.toString()||"0"} className="border px-2 py-1"/>
              </div>
              <button type='submit' onClick={handleSaveTypes} className="px-4 py-2 mt-auto bg-blue-500 text-white rounded">حفظ</button>
            </form>
          </div>
          <form className='flex flex-1/2 flex-col'>
            <h1 className='font-bold text-xl' >المستخدمين</h1>
            <div className='grow flex flex-col mb-2 mt-4'>
              <div className='text-white flex w-full gap-2 text-center bg-slate-700 py-2 rounded-t-sm'>
                <div className='flex-1'>الاسم</div>
                <div className='flex-1'>الايراد اليومي</div>
                <div className='flex-1'>الايراد الشهري</div>
                <div className='flex-1'>الدور</div>
              </div> 
              <ul className='flex flex-col grow shadow-inner overflow-y-auto bg-slate-200 rounded-b-sm border-b-[3px] border-slate-700'>
                {userFinances?.map((finance, i)=>
                  <li
                  onClick={()=>
                    setCurrentUser(prev=>{
                      return prev === finance.cashier_id? finance.cashier_id : null
                    }) 
                  }
                  className={'text-black flex w-full py-1 gap-2 text-center hover:bg-slate-300 ' + (i==0&& ' pt-2 ') + (currentUser == finance.cashier_id&& ' bg-slate-400 hover:bg-slate-400 text-slate-200 ')} key={i}>
                    <div className='flex-1'>{finance.username}</div>
                    <div className='flex-1'>{finance.dailyFinances}<span className='font-noto font-bold'>ج</span></div>
                    <div className='flex-1'>{finance.monthlyFinances}<span className='font-noto font-bold'>ج</span></div>
                    <div className='flex-1'>{finance.admin? "ادمن": "موظف"}</div>
                  </li> 
                )}
              </ul>
            </div>
            <div className='flex gap-2'>
              <button type='button' onClick={()=> setAddPopup(true)} className="px-4 py-2 mt-auto bg-green-500 hover:bg-green-400 duration-150 text-white rounded flex-1">اضافة </button>
              <button type='button' onClick={()=> currentUser? setEditPopup(true) : toast.error("برجاء تحديد مستخدم للتعديل")}
                className={"px-4 py-2 mt-auto duration-150 text-white rounded flex-1 " + (currentUser? "bg-blue-500 hover:bg-blue-400" : "bg-gray-300")}>تعديل  </button>
              <button type='button' onClick={()=> currentUser? setConfirmDelete(true) : toast.error("برجاء تحديد مستخدم للحذف")} className={"px-4 py-2 mt-auto duration-150 text-white rounded flex-1 " + (currentUser? "bg-red-600 hover:bg-red-500" : "bg-gray-300")}>حذف </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Config;
