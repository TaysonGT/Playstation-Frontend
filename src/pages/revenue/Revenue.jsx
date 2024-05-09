import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AddDeducionPopup from './popups/AddDeductionPopup';

const Revenue = () => {
  const [finances, setFinances] = useState()
  const [currentFinances, setCurrentFinances] = useState()
  
  const [date, setDate] = useState()
  const [day, setDay] = useState()
  
  const [currentUser, setCurrentUser] = useState()
  
  const [showAddDeductionPopup, setShowAddDeductionPopup] = useState(false)
  
  const [refresh, setRefresh] = useState(false)
  
  const [users, setUsers] = useState()

  const arabicWeekNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const currentDateHandler = (e)=>{
    let currDate = e.target.value;
    setDate(currDate)
  }

  useEffect(()=>{
    let d = null
    let m =null 
    let y = new Date().getFullYear() 
    new Date().getMonth() < 10? m= `0${new Date().getMonth() +1}` : m = new Date().getMonth() +1
    new Date().getDate() < 10 ? d = `0${new Date().getDate()}` : d = new Date().getDate()
    setDate(`${y}-${m}-${d}`)
    setCurrentUser(document.querySelector('.selectUser').value)
  }, [])

  useEffect(()=>{
    if(date && currentUser){
      setDay(arabicWeekNames[new Date(date).getDay()])
      axios.get(`/finances/${date}/${currentUser}`, {withCredentials:true})
      .then(({data})=>{
        setFinances(data)
        setCurrentFinances(data.currentDayFinances)
      })
    }
    date&& axios.get('/users', {withCredentials:true})
    .then(({data})=>setUsers(data.users))
  },[date, refresh, currentUser])

  return (
    <div dir='rtl' className="lg:px-36 px-10 bg-[navy] pt-32 pb-10 flex flex-col gap-6 h-screen ">
    
      {showAddDeductionPopup&& 
      <>
        <div onClick={()=>setShowAddDeductionPopup(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-100 z-[99]'></div>
        <AddDeducionPopup {...{setShowAddDeductionPopup, refresh, setRefresh}} />
      </>
      }
    
      <div className='flex justify-between items-center'>
        <h1 className="text-3xl align-middle lg font-semibold text-white">لوحة المعلومات</h1>
        <select onChange={e=> setCurrentUser(e.target.value)} className='px-3 py-2 rounded selectUser'>
          <option value='all'>الكلي</option>
          {users?.map((user, i)=>
          <option key={i} value={user.id}>{user.username}</option>)}
        </select>
      </div>

      <div className='grid lg:grid-cols-4 grid-cols-3 gap-4 lg:grid-rows-5 overflow-hidden grow'>
         <div className="bg-green-500 text-white rounded-lg shadow-md p-4">
            <div className='flex justify-between'>
              <h2 className="text-lg font-semibold mb-2">يوم</h2>
              <input type="date"className='bg-white text-black px-1 py-1 rounded-lg shadow-lg hover:bg-green-200' onInput={currentDateHandler} />
            </div>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{day}</p>
              <p className={`text-lg font-bold`}>{date}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">الايراد اليومي</h2>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{finances?.dailyFinances}<span className='font-noto'>ج</span></p>
              {isFinite(finances?.dailyGrowthLoss) && finances?.dailyGrowthLoss>0 &&
                <p className={`text-lg font-bold ${finances?.dailyGrowthLossSign ? 'text-green-500' : 'text-red-500'}`}>{finances?.dailyGrowthLoss}% {finances?.dailyGrowthLossSign? "↑" : "↓"}</p>
              }
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 ">
            <h2 className="text-lg font-semibold mb-2">الايراد الاسبوعي</h2>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{finances?.weeklyFinances}<span className='font-noto'>ج</span></p>
              {isFinite(finances?.weeklyGrowthLoss) && finances?.weeklyGrowthLoss>0 &&
                <p className={`text-lg font-bold ${finances?.weeklyGrowthLossSign ? 'text-green-500' : 'text-red-500'}`}>{finances?.weeklyGrowthLoss}% {finances?.weeklyGrowthLossSign? "↑" : "↓"}</p>
              }
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">الايراد الشهري</h2>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{finances?.monthlyFinances}<span className='font-noto'>ج</span></p>
              {isFinite(finances?.monthlyGrowthLoss) && finances?.monthlyGrowthLoss>0 &&
                <p className={`text-lg font-bold ${finances?.monthlyGrowthLossSign ? 'text-green-500' : 'text-red-500'}`}>{finances?.monthlyGrowthLoss}% {finances?.monthlyGrowthLossSign? "↑" : "↓"}</p>
              }
            </div>
          </div>

          <div className="bg-white lg:row-start-4 lg:row-end-6 rounded-lg shadow-md p-4 flex-col flex">
            <div className='flex justify-between items-center'>
              <h2 className="text-lg font-semibold">الخصومات  </h2>
              <button onClick={()=> setShowAddDeductionPopup(true)} className='p-2 bg-red-500 hover:bg-red-400 text-white rounded'>اضافة </button>
            </div>
            <div className='grow justify-between flex flex-col'>
              <div>
                <span className='text-sm'>(اليوم)</span>
                <div className='flex gap-4 items-end'>
                  <p className="text-2xl font-bold">{finances?.dailyDeduction}<span className='font-noto'>ج</span></p>
                  {isFinite(finances?.dailyDeductionGrowthLoss) && finances?.dailyDeductionGrowthLoss>0 &&
                    <p className={`text-lg font-bold ${finances?.dailyDeductionGrowthLossSign?  'text-green-500' : 'text-red-500'}`}>{finances?.dailyDeductionGrowthLoss}% {finances?.dailyDeductionGrowthLossSign? "↓" : "↑" }</p>
                  }
                </div>
              </div>
              <div>
                <span className='text-sm'>( هذا الشهر)</span>
                <div className='flex gap-4 items-end'>
                  <p className="text-2xl font-bold">{finances?.monthlyDeduction}<span className='font-noto'>ج</span></p>
                  {isFinite(finances?.monthlyDeductionGrowthLoss) && finances?.monthlyDeductionGrowthLoss>0 &&
                    <p className={`text-lg font-bold ${finances?.monthlyDeductionGrowthLossSign?  'text-red-500' : 'text-green-500'}`}>{finances?.monthlyDeductionGrowthLoss}% {finances?.monthlyDeductionGrowthLossSign? "↑" : "↓"}</p>
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">ايرادات المنتجات</h2>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{finances?.productsRevenue}<span className='font-noto'>ج</span></p>
              {isFinite(finances?.productsGrowthLoss)&& finances?.productsGrowthLoss>0 &&
                <p className={`text-lg font-bold ${finances?.productsGrowthLossSign ?    'text-green-500' : 'text-red-500'}`}>{(finances?.productsGrowthLoss)}% {finances?.productsGrowthLossSign? "↑" : "↓"}</p>
              }
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">الايراد السنوي</h2>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{finances?.yearlyFinances}<span className='font-noto'>ج</span></p>
              {isFinite(finances?.yearlyGrowthLoss) && finances?.yearlyGrowthLoss>0 &&
                <p className={`text-lg font-bold ${finances?.yearlyGrowthLossSign ? 'text-green-500' : 'text-red-500'}`}>{finances?.yearlyGrowthLoss}% {finances?.yearlyGrowthLossSign? "↑" : "↓"}</p>
              }
            </div>
          </div>
          <div className="flex flex-col text-center bg-gray-200 rounded-lg shadow-md text-black col-start-2 row-start-2 col-end-4 lg:col-end-5 lg:row-end-6 row-end-5 overflow-hidden">
            <div className='p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-scroll' style={{gridAutoRows: '200px'}}>
              {currentFinances?.sort((b,a)=> new Date(a.added_at) - new Date(b.added_at)).map((finance, i ) =>
                <div key={i} className="bg-white shadow-lg rounded-lg flex flex-col justify-between overflow-hidden">
                  <div className="p-4 flex-1">
                    <h3 className="text-lg font-semibold">{finance.type==="Device" || finance.type ==="devices" ? "جهاز" : finance.type === "outerReceipt" ? "فاتورة خارجية" : "خصم"}</h3>
                    <p className="text-gray-600 text-sm ">{finance.description}</p>
                  </div>
                  <div className="bg-gray-100 p-1 flex-[.2]">
                    <p className={"font-bold text-md " + (finance.type === "deduction"? "text-red-600" : "text-green-500")}>{finance.finances}ج</p>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>      
  );
};

export default Revenue;
