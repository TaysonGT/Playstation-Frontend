import axios from 'axios';
import { useEffect, useState } from 'react';
import AddDeducionPopup from './popups/AddDeductionPopup';
import { IFinanceReport, IReceipt } from '../../types';
import Loader from '../../components/Loader';
import { RiEyeLine } from 'react-icons/ri';
import OuterReceipt from '../Receipts/partials/receipt/OuterReceipt';
import SessionReceipt from '../Receipts/partials/receipt/SessionReceipt';
import { useTranslation } from 'react-i18next';
import { getDirection } from '../../i18n';

const Dashboard = () => {
  const [finances, setFinances] = useState<IFinanceReport>({
    // Day Report
    today: 0,
    todayGrowthLoss: 0,
    todayDeduction: 0,
    todayDeductionGrowthLoss: 0,
    // Week Report
    currentWeek: 0,
    currentWeekGrowthLoss: 0,
    currentWeekDeduction: 0,
    currentWeekDeductionGrowthLoss: 0,
    // Month Report 
    currentMonth: 0,
    currentMonthGrowthLoss: 0,
    currentMonthDeduction: 0,
    currentMonthDeductionGrowthLoss: 0,
    // Year Report
    currentYear: 0,
    currentYearGrowthLoss: 0,
    currentYearDeduction: 0,
    currentYearDeductionGrowthLoss: 0,
    // Products Report
    productsRevenue: 0,
    productsGrowthLoss: 0,
  })

  const [currentFinances, setCurrentFinances] = useState<IReceipt[]>([])
  const [date, setDate] = useState<Date>(new Date(new Date().setHours(0,0,0,0)))
  const [day, setDay] = useState('')
  const [currentUser, setCurrentUser] = useState('')
  const [showAddDeductionPopup, setShowAddDeductionPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showFinanceModal, setShowFinanceModal] = useState(false)
  const [selectedFinance, setSelectedFinance] = useState<IReceipt|null>(null)
  const [users, setUsers] = useState<{id:string, username:string}[]>()
  const arabicWeekNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const englishWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const {t, i18n} = useTranslation()
  const currentDirection = getDirection(i18n.language);

  const currentDateHandler = (e:React.InputEvent<HTMLInputElement>)=>{
    let currDate = e.currentTarget.value;
    setDate(new Date(new Date(currDate).setHours(0,0,0,0)))
  }

  function isPositive(number:number) {
    return number > 0;
  }

  const fetchFinances = async(date: Date)=>{
    setIsLoading(true)
    setDay(i18n.language==='ar'? arabicWeekNames[new Date(date).getDay()]:englishWeekNames[new Date(date).getDay()])
    await axios.get(`/finances/${currentUser||'all'}?date=${date.toISOString()}`,{withCredentials: true})
    .then(({data})=>{
      setFinances(data)
      setCurrentFinances(data.finances)
    }).finally(()=>
      setIsLoading(false)
    )
  }

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
    <div dir={currentDirection} className="lg:px-36 px-10 bg-[navy] py-6 flex flex-col gap-6 h-full min-h-0 overflow-y-auto ">
    
      {showAddDeductionPopup&& 
      <>
        <div onClick={()=>setShowAddDeductionPopup(false)} className='fixed left-0 top-0 w-screen h-screen bg-black/70 animate-appear duration-500 z-[50]'/>
        <AddDeducionPopup {...{onAction: ()=>{
          setShowAddDeductionPopup(false)
          date&& fetchFinances(date)
        }}} />
      </>
      }

      {showFinanceModal&&selectedFinance&& 
      <>
        <div onClick={()=>setShowFinanceModal(false)} className='fixed left-0 top-0 w-screen h-screen bg-black/70 animate-appear duration-500 z-[50]'/>
        {selectedFinance.type==='session'?
          <SessionReceipt {...{receipt:selectedFinance, hide: ()=>setShowFinanceModal(false)}} />
          : <OuterReceipt {...{receipt:selectedFinance, hide: ()=>setShowFinanceModal(false)}} />
        }
      </>
      }
    
      <div className='flex justify-between items-center'>
        <h1 className="text-3xl align-middle lg font-semibold text-white">{t('dashboard.dashboard')}</h1>
        <select onChange={e=> setCurrentUser(e.currentTarget.value)} className='px-3 py-2 rounded bg-white '>
          <option value='all'>{t('dashboard.all')}</option>
          {users?.map((user, i)=>
          <option key={i} value={user.id}>{user.username}</option>)}
        </select>
      </div>

      <div className='grid lg:grid-cols-4 grid-cols-3 gap-4 lg:grid-rows-5 overflow-hidden grow'>
         <div className="bg-green-500 text-white rounded-lg shadow-md p-4">
            <div className='flex justify-between'>
              <h2 className="text-lg font-semibold mb-2">{t('dashboard.date')}</h2>
              <input type="date"className='bg-white text-black px-1 py-1 rounded-lg shadow-lg hover:bg-green-200' onInput={currentDateHandler} />
            </div>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{day}</p>
              <p className={`text-lg font-bold`}>{date&& new Date(date).toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">{t('dashboard.todayRevenue')}</h2>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{finances?.today}<span className='font-noto'>ج</span></p>
              {finances?.todayGrowthLoss && finances?.todayGrowthLoss>0 &&
                <p className={`text-lg font-bold ${isPositive(finances?.todayGrowthLoss) ? 'text-green-500' : 'text-red-500'}`}>{Math.abs(finances?.todayGrowthLoss)}% {(finances?.todayGrowthLoss)? "↑" : "↓"}</p>
              }
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 ">
            <h2 className="text-lg font-semibold mb-2">{t('dashboard.weeklyRevenue')}</h2>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{finances?.currentWeek}<span className='font-noto'>ج</span></p>
              {finances?.currentWeekGrowthLoss && finances?.currentWeek>0 &&
                <p className={`text-lg font-bold ${isPositive(finances?.currentWeekGrowthLoss) ? 'text-green-500' : 'text-red-500'}`}>{Math.abs(finances?.currentWeekGrowthLoss)}% {isPositive(finances?.currentWeekGrowthLoss)? "↑" : "↓"}</p>
              }
            </div>
          </div>

          {/* currentMonth Revenue */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">{t('dashboard.monthlyRevenue')}</h2>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{finances?.currentMonth}<span className='font-noto'>ج</span></p>
              {finances?.currentMonthGrowthLoss && finances?.currentMonth>0 &&
                <p className={`text-lg font-bold ${isPositive(finances?.currentMonthGrowthLoss)? 'text-green-500' : 'text-red-500'}`}>{Math.abs(finances?.currentMonthGrowthLoss)}% {isPositive(finances?.currentMonthGrowthLoss)? "↑" : "↓"}</p>
              }
            </div>
          </div>

          <div className="bg-white lg:row-start-4 lg:row-end-6 rounded-lg shadow-md p-4 flex-col flex">
            <div className='flex justify-between items-center'>
              <h2 className="text-lg font-semibold">{t('dashboard.deductions')}</h2>
              <button onClick={()=> setShowAddDeductionPopup(true)} className='p-2 bg-red-500 hover:bg-red-400 text-white rounded'>اضافة </button>
            </div>
            <div className='grow justify-between flex flex-col'>
              <div>
                <span className='text-sm'>({t('dashboard.today')})</span>
                <div className='flex gap-4 items-end'>
                  <p className="text-2xl font-bold">{Math.abs(finances?.todayDeduction)}<span className='font-noto'>ج</span></p>
                  {finances?.todayDeductionGrowthLoss && finances?.todayDeduction>0 &&
                    <p className={`text-lg font-bold ${isPositive(finances?.todayDeductionGrowthLoss)?  'text-green-500' : 'text-red-500'}`}>{Math.abs(finances?.todayDeductionGrowthLoss)}% {isPositive(finances?.todayDeductionGrowthLoss)? "↓" : "↑" }</p>
                  }
                </div>
              </div>
              <div>
                <span className='text-sm'>({t('dashboard.thisMonth')})</span>
                <div className='flex gap-4 items-end'>
                  <p className="text-2xl font-bold">{Math.abs(finances?.currentMonthDeduction)}<span className='font-noto'>ج</span></p>
                  {finances?.currentMonthDeductionGrowthLoss && finances?.currentMonthDeduction>0 &&
                    <p className={`text-lg font-bold ${isPositive(finances?.currentMonthDeductionGrowthLoss)?  'text-red-500' : 'text-green-500'}`}>{Math.abs(finances?.currentMonthDeductionGrowthLoss)}% {isPositive(finances?.currentMonthDeductionGrowthLoss)? "↑" : "↓"}</p>
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">{t('dashboard.productsRevenue')}</h2>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{finances?.productsRevenue}<span className='font-noto'>ج</span></p>
              {finances?.productsGrowthLoss&& finances?.productsRevenue>0 &&
                <p className={`text-lg font-bold ${isPositive(finances?.productsGrowthLoss) ?    'text-green-500' : 'text-red-500'}`}>{Math.abs(finances?.productsGrowthLoss)}% {isPositive(finances?.productsGrowthLoss)? "↑" : "↓"}</p>
              }
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">{t('dashboard.yearlyRevenue')}</h2>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{finances?.currentYear}<span className='font-noto'>ج</span></p>
              {finances?.currentYearGrowthLoss && finances?.currentYear>0 &&
                <p className={`text-lg font-bold ${isPositive(finances?.currentYearGrowthLoss) ? 'text-green-500' : 'text-red-500'}`}>{Math.abs(finances?.currentYearGrowthLoss)}% {isPositive(finances?.currentYearGrowthLoss)? "↑" : "↓"}</p>
              }
            </div>
          </div>
          <div className="flex flex-col rounded-lg shadow-md text-black col-start-2 row-start-2 col-end-4 lg:col-end-5 lg:row-end-6 row-end-5 overflow-hidden">
            <div className='flex text-center items-stretch border-b border-gray-400 text-white bg-gray-600'>
              <div className='flex-1 p-3 flex items-center justify-center'>{t('tables.type')}</div>
              <div className='flex-1 p-3 flex items-center justify-center'>{t('tables.employee')}</div>
              <div className='flex-1 p-3 flex items-center justify-center'>{t('tables.time')}</div>
              <div className='flex-[0.5] p-3 flex items-center justify-center'>{t('tables.total')}</div>
              <div className='flex-[0.5] p-3 flex items-center justify-center'>{t('tables.actions')}</div>
            </div>
            <div className='py-2 flex flex-col gap-1 overflow-y-auto bg-gray-200 grow'>
              {currentFinances?.map((finance, i ) =>
                <div key={i} className="bg-white text-center flex items-stretch">
                  <div className="flex-1 p-3">
                    {finance.type==="session" ? t('receipts.session') : finance.type === "outer" ? t('receipts.outer') : t('receipts.deduction')}
                  </div>
                  <div className="flex-1 p-3">
                    {finance.cashier.username}
                  </div>
                  <div className="flex-1 p-3 flex gap-2 items-center justify-center">
                    <p>{new Date(finance.created_at).toLocaleString()}</p>
                  </div>
                  <div className={"font-bold flex-[0.5] p-3 " + (finance.type === "deduction"? "text-red-600" : "text-green-500")}>
                    {Math.abs(finance.total)}ج
                  </div>
                  <div
                    onClick={()=>{
                      setSelectedFinance(finance)
                      setShowFinanceModal(true)
                    }}
                   className="text-2xl flex items-center justify-center hover:text-cyan-700 cursor-pointer flex-[0.5] p-3 ">
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

export default Dashboard;
