import axios from 'axios';
import { useEffect, useState } from 'react';
import AddDeducionPopup from './popups/AddDeductionPopup';
import { IFinanceReport, IReceipt } from '../home/types';
import Loader from '../../components/Loader';
import { RiEyeLine } from 'react-icons/ri';
import OuterReceipt from '../orders/partials/receipt/OuterReceipt';

const Revenue = () => {
  const [finances, setFinances] = useState<IFinanceReport>({
    // Day Report
    dailyFinances: 0,
    dailyGrowthLoss: 0,
    dailyGrowthLossSign: true,
    dailyDeduction: 0,
    dailyDeductionGrowthLoss: 0,
    dailyDeductionGrowthLossSign: true,
    // Week Report
    weeklyFinances: 0,
    weeklyGrowthLoss: 0,
    weeklyGrowthLossSign: true,
    weeklyDeduction: 0,
    weeklyDeductionGrowthLoss: 0,
    weeklyDeductionGrowthLossSign: true,
    // Month Report 
    monthlyFinances: 0,
    monthlyGrowthLoss: 0,
    monthlyGrowthLossSign: true,
    monthlyDeduction: 0,
    monthlyDeductionGrowthLoss: 0,
    monthlyDeductionGrowthLossSign: true,
    // Year Report
    yearlyFinances: 0,
    yearlyGrowthLoss: 0,
    yearlyGrowthLossSign: false,
    yearlyDeduction: 0,
    yearlyDeductionGrowthLoss: 0,
    yearlyDeductionGrowthLossSign: true,
    // Products Report
    productsRevenue: 0,
    productsGrowthLoss: 0,
    productsGrowthLossSign: true
  })

  const [currentFinances, setCurrentFinances] = useState<IReceipt[]>([])
  const [date, setDate] = useState<string>()
  const [day, setDay] = useState('')
  const [currentUser, setCurrentUser] = useState('')
  const [showAddDeductionPopup, setShowAddDeductionPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showFinanceModal, setShowFinanceModal] = useState(false)
  const [selectedFinance, setSelectedFinance] = useState<IReceipt|null>(null)
  
  const [users, setUsers] = useState<{id:string, username:string}[]>()

  const arabicWeekNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const currentDateHandler = (e:React.InputEvent<HTMLInputElement>)=>{
    let currDate = e.currentTarget.value;
    setDate(new Date(currDate).toISOString())
  }

  const fetchFinances = async(date: string)=>{
    setIsLoading(true)
    setDay(arabicWeekNames[new Date(date).getDay()])
    await axios.get(`/finances/${new Date(date).toLocaleTimeString()}/${currentUser||'all'}`, {withCredentials:true})
    .then(({data})=>{
      setFinances(data)
      setCurrentFinances(data.finances)
    }).finally(()=>
      setIsLoading(false)
    )
  }

  useEffect(()=>{
    setDate(new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
  }, [])

  useEffect(()=>{
    axios.get('/users', {withCredentials:true})
    .then(({data})=>setUsers(data.users))
    .finally(()=>
      date&& fetchFinances(date)
    )
  },[date, currentUser])

  return isLoading? 
    <div className='flex justify-center items-center h-full'><Loader size={50} thickness={10}/></div>
  :(
    <div dir='rtl' className="lg:px-36 px-10 bg-[navy] py-6 flex flex-col gap-6 h-full min-h-0 overflow-y-auto ">
    
      {showAddDeductionPopup&& 
      <>
        <div onClick={()=>setShowAddDeductionPopup(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-100 z-[99]'></div>
        <AddDeducionPopup {...{onAction: ()=>{
          setShowAddDeductionPopup(false)
          date&& fetchFinances(date)
        }}} />
      </>
      }

      {showFinanceModal&&selectedFinance&& 
      <>
        <div onClick={()=>setShowFinanceModal(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-100 z-[99]'></div>
        <OuterReceipt {...{receipt:selectedFinance, hide: ()=>setShowFinanceModal(false)}} />
      </>
      }
    
      <div className='flex justify-between items-center'>
        <h1 className="text-3xl align-middle lg font-semibold text-white">لوحة المعلومات</h1>
        <select onChange={e=> setCurrentUser(e.currentTarget.value)} className='px-3 py-2 rounded'>
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
              <p className={`text-lg font-bold`}>{date&& new Date(date).toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})}</p>
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
          <div className="flex flex-col bg-gray-200 rounded-lg shadow-md text-black col-start-2 row-start-2 col-end-4 lg:col-end-5 lg:row-end-6 row-end-5 overflow-hidden">
            <div className='flex items-stretch border-b border-gray-400 bg-white px-10'>
              <div className='flex-1 p-3 flex items-center'>النوع</div>
              <div className='flex-1 p-3 flex items-center'>الموظف</div>
              <div className='flex-1 p-3 flex items-center'>الوقت</div>
              <div className='flex-[0.5] p-3 flex items-center'>المبلغ</div>
              <div className='flex-[0.5] p-3 flex items-center'>عرض</div>
            </div>
            <div className='p-2 flex flex-col gap-2 overflow-y-auto'>
              {currentFinances.map((finance, i ) =>
                <div key={i} className="bg-white shadow-lg rounded-lg flex items-stretch px-4">
                  <div className="flex-1 p-3">
                    {finance.type==="session" ? "جهاز" : finance.type === "outer" ? "فاتورة خارجية" : "خصم"}
                  </div>
                  <div className="flex-1 p-3">
                    {finance.cashier.username}
                  </div>
                  <div className="flex-1 p-3 flex gap-2 items-center">
                    <p>{new Date(finance.created_at).toLocaleTimeString()}</p> -
                    <p>{new Date(finance.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className={"font-bold flex-[0.5] p-3 " + (finance.type === "deduction"? "text-red-600" : "text-green-500")}>
                    {finance.total}ج
                  </div>
                  <div
                    onClick={()=>{
                      setSelectedFinance(finance)
                      setShowFinanceModal(true)
                    }}
                   className="text-2xl flex items-center hover:text-cyan-700 cursor-pointer flex-[0.5] p-3 ">
                    <RiEyeLine />
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
