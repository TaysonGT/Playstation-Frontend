import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DevTypePopup from './popups/DevTypePopup';
import NewUser from './popups/NewUser';
import EditUser from './popups/EditUser'
import DeleteConfirm from './popups/DeleteConfirm';
import toast from 'react-hot-toast';

const Config = () => {
  const [configs, setConfigs] = useState([]);

  const [playstationName, setPlaystationName] = useState()
  const [phone, setPhone] = useState()

  const [users, setUsers] = useState()
  const [currentUser, setCurrentUser] = useState()
  
  const [editPopup, setEditPopup] = useState(false)
  const [addPopup, setAddPopup] = useState(false)
  const [typePopup, setTypePopup] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  
  const [refresh, setRefresh] = useState(false)
  
  const [devTypes, setDevTypes] = useState([])
  const [currDevType, setCurrDevType] = useState()
  const [currTypeId, setCurrTypeId] = useState()
  const [singlePrice, setSinglePrice] = useState()
  const [multiPrice, setMultiPrice] = useState()
  
  const [finances, setFinances] = useState()
  const [usersFinances, setUsersFinances] = useState()


  const handleSaveInfo = (e) => {
    e.preventDefault();
    axios.put('/config', {name: playstationName, phone}, {withCredentials:true})
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
    axios.get('/device-types', {withCredentials:true})
    .then(({data})=> {
      if(data.deviceTypes){
        setDevTypes(data.deviceTypes)
      }
    })
    
    axios.get('/users', {withCredentials: true})
    .then(({data})=>{
      setUsers(data.users)
    })
  },[refresh])
  
  useEffect(()=>{
    users&& axios.get('/finances', {withCredentials: true})
    .then(({data})=>{
      setFinances(data.finances)
    })
  }, [users])
  
  useEffect(()=>{
    if(users&& finances){
      const userFinancesArr = []
      users.map((user)=>{
        let userFinance = {
          id: user.id,
          username: user.username,
          admin: user.admin,
          dailyFinances: 0,
          monthlyFinances: 0,
        }
        finances.filter((finance)=> finance.cashier_id === user.id).map((finance)=>{
          const firstDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
          const firstDayofNextMonth = new Date(new Date().getFullYear(), new Date().getMonth() +1, 1)
          let addTime = new Date(new Date(finance.added_at).setHours(2,0,0,0))
          if (addTime.getDate() == new Date().getDate() && new Date().getMilliseconds() - addTime.getMilliseconds() <= 24*60*60*1000){
              if(finance.type == "deduction"){
                userFinance.dailyFinances -= finance.finances
              }else userFinance.dailyFinances += finance.finances;
          }
          if( new Date(addTime) < firstDayofNextMonth 
          && new Date(addTime) >= firstDayOfCurrentMonth ){
              if(finance.type == "deduction"){
                userFinance.monthlyFinances -= finance.finances
              }else userFinance.monthlyFinances += finance.finances
          }
        })
        userFinancesArr.push(userFinance)
      })
      setUsersFinances(userFinancesArr)
    }
  },[users, finances])
  
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
    usersFinances&& console.log(usersFinances)
  }, [usersFinances])
  
  return (
    <div dir='rtl' className="flex flex-col h-screen overflow-hidden pb-10 bg-[#0d47a1] pt-32 lg:px-36 px-10 font-alexandria">
      {typePopup&& <>
        <DevTypePopup {...{setTypePopup, setRefresh, refresh}} />
        <div onClick={(e)=>{e.preventDefault(); setTypePopup(false)}} className='fixed left-0 top-0 w-screen h-screen bg-layout z-[99]'></div>
      </>}
      {addPopup&& <>
        <NewUser {...{setAddPopup, refresh, setRefresh}}/>
        <div onClick={(e)=>{e.preventDefault(); setAddPopup(false)}} className='fixed left-0 top-0 w-screen h-screen bg-layout z-[99]'></div>
      </>
      }
      {editPopup&& <>
        <EditUser {...{setEditPopup, currentUser, refresh, setRefresh}}/>
        <div onClick={(e)=>{e.preventDefault(); setEditPopup(false)}} className='fixed left-0 top-0 w-screen h-screen bg-layout z-[99]'></div>
      </>
      }
      {confirmDelete&& <>
        <DeleteConfirm {...{setConfirmDelete, currentUser, refresh, setRefresh}}/>
        <div onClick={(e)=>{e.preventDefault(); setConfirmDelete(false)}} className='fixed left-0 top-0 w-screen h-screen bg-layout z-[99]'></div>
      </>
      }
        <h1 className="text-white text-3xl font-bold mb-4">الاعدادات</h1>
        <div className='py-6 px-10 grow grid grid-cols-1 lg:grid-cols-5 gap-x-8 gap-y-4 bg-white rounded-lg shadow-large overflow-y-scroll lg:overflow-hidden'>
          <form className='flex flex-col gap-4 lg:col-start-1 lg:col-end-3'>
            <h1 className='font-bold text-xl' >بيانات المحل</h1>
            <div className='flex flex-col'>
              <label className="block font-semibold mb-1">اسم المحل:</label>
              <input onInput={(e)=> setPlaystationName(e.target.value)} type="text" placeholder={configs?.name} className=" border px-2 py-1" />
            </div>
            <div className='flex flex-col'>
              <label className="block font-semibold mb-1">رقم التليفون:</label>
              <input type="tel" placeholder={configs?.phone} onInput={(e)=> setPhone(e.target.value)}  onKeyDown={(e) => {
                  const key = e.key;
                  const isValidInput = /^[0-9]*$/.test(key) || key ==="Backspace" || key === "ArrowRight" || key === "ArrowLeft";
                  if (!isValidInput) {
                    e.preventDefault();
                  }
                }} className="border px-2 py-1 text-right" />
            </div>
            <button type='submit' onClick={handleSaveInfo} className="px-4 py-2 mt-auto bg-blue-500 text-white rounded">تعديل بيانات المحل</button>
          </form>
          <form className='gap-4 flex flex-col lg:col-start-1 lg:col-end-3'>
            <div className='flex gap-4 items-start'>
              <h1 className='font-bold text-xl' >الأسعار</h1>
              <select onInput={e=> setCurrTypeId(e.target.value)} className='select-input p-2 border-2 border-indigo-500 text-indigo-500 outline-none cursor-pointer'>
                {devTypes?.map((devType, i)=> <option key={i} value={devType.id}>{devType.name}</option> )}
              </select>
              <button type='button' onClick={(e)=>{e.preventDefault();  setTypePopup(true)}} className='bg-[#1f1f1f] hover:bg-[#4d4d4d] duration-150 text-white p-2 px-4 rounded'>اضافة نوع جهاز</button>
            </div>
            <div className='flex flex-col'>
              <label className="block font-semibold mb-1">سعر الساعة (سنجل):</label>
              <input onInput={e=> setSinglePrice(e.target.value)} type="number" placeholder={currDevType?.single_price} className="border px-2 py-1"
              />
            </div>
            <div className='flex flex-col'>
              <label className="block font-semibold mb-1">سعر الساعة (ملتي):</label>
              <input onInput={e=> setMultiPrice(e.target.value)} type="number" placeholder={currDevType?.multi_price} className="border px-2 py-1"/>
            </div>
            <button type='submit' onClick={handleSaveTypes} className="px-4 py-2 mt-auto bg-blue-500 text-white rounded">حفظ</button>
          </form>
          <form className='flex flex-col row-start-1 lg:col-start-3 lg:col-end-6 lg:row-end-3'>
            <h1 className='font-bold text-xl' >المستخدمين</h1>
            <div className='grow flex flex-col mb-2 mt-4'>
              <div className='text-white flex w-full gap-2 text-center bg-slate-700 py-2 rounded-t-sm'>
                <div className='flex-1'>الاسم</div>
                <div className='flex-1'>الايراد اليومي</div>
                <div className='flex-1'>الايراد الشهري</div>
                <div className='flex-1'>الدور</div>
              </div> 
              <ul className='flex flex-col grow shadow-inner bg-slate-200 rounded-b-sm border-b-[3px] border-slate-700'>
                {usersFinances?.map((user, i)=>
                  <li
                  onClick={e=>
                    currentUser == user.id? setCurrentUser(null) : setCurrentUser(user.id)
                  }
                  className={'text-black flex w-full py-1 gap-2 text-center hover:bg-slate-300 ' + (i==0&& ' pt-2 ') + (currentUser== user.id&& ' bg-slate-400 hover:bg-slate-400 text-slate-200 ')} key={i}>
                    <div className='flex-1'>{user.username}</div>
                    <div className='flex-1'>{user.dailyFinances}<span className='font-noto font-bold'>ج</span></div>
                    <div className='flex-1'>{user.monthlyFinances}<span className='font-noto font-bold'>ج</span></div>
                    <div className='flex-1'>{user.admin? "ادمن": "موظف"}</div>
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
