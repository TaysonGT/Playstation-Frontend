import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AddDeducionPopup from './popups/AddDeductionPopup';

const Revenue = () => {
  const [finances, setFinances] = useState()
  const [currentFinances, setCurrentFinances] = useState()
  const [orders, setOrders] = useState()
  const [productsRevenue, setProductsRevenue] = useState()
  
  const [date, setDate] = useState()
  const [day, setDay] = useState()

  const [dailyGrowthLoss, setDailyGrowthLoss] = useState()
  const [weeklyGrowthLoss, setWeeklyGrowthLoss] = useState()
  const [monthlyGrowthLoss, setMonthlyGrowthLoss] = useState()
  const [yearlyGrowthLoss, setYearlyGrowthLoss] = useState()
  const [productsGrowthLoss, setProductsGrowthLoss] = useState()
  const [dailyDeductionGrowthLoss, setDailyDeductionGrowthLoss]= useState() 
  const [monthlyDeductionGrowthLoss, setMonthlyDeductionGrowthLoss]= useState() 

  const [dailyGrowthLossSign, setDailyGrowthLossSign] = useState()
  const [monthlyGrowthLossSign, setMonthlyGrowthLossSign] = useState()
  const [weeklyGrowthLossSign, setWeeklyGrowthLossSign] = useState()
  const [yearlyGrowthLossSign, setYearlyGrowthLossSign] = useState()
  const [productsGrowthLossSign, setProductsGrowthLossSign] = useState()
  const [dailyDeductionGrowthLossSign, setDailyDeductionGrowthLossSign] = useState()
  const [monthlyDeductionGrowthLossSign, setMonthlyDeductionGrowthLossSign] = useState()
  
  const [showAddDeductionPopup, setShowAddDeductionPopup] = useState(false)

  const arabicWeekNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const currentDateHandler = (e)=>{
    let currDate = e.target.value;
    console.log(currDate)
    setDate(currDate)
  }

  useEffect(()=>{
    let d = null
    let m =null 
    let y = new Date().getFullYear() 
    new Date().getMonth() < 10? m= `0${new Date().getMonth() +1}` : m = new Date().getMonth() +1
    new Date().getDate() < 10 ? d = `0${new Date().getDate()}` : d = new Date().getDate()
    setDate(`${y}-${m}-${d}`)
  }, [])

  useEffect(()=>{
      if(finances){
        setDailyGrowthLoss(Math.floor(Math.abs(finances.dailyFinances - finances.lastDay)/ finances.lastDay *100 ))
        setWeeklyGrowthLoss(Math.floor(Math.abs(finances.weeklyFinances - finances.lastWeek)/ finances.lastWeek *100))
        setMonthlyGrowthLoss(Math.floor(Math.abs(finances.monthlyFinances - finances.lastMonth)/ finances.lastMonth *100 ))
        setYearlyGrowthLoss(Math.floor(Math.abs(finances.yearlyFinances - finances.lastYear)/ finances.lastYear *100 ))
        setDailyDeductionGrowthLoss(Math.floor(Math.abs(finances.dailyDeduction - finances.lastDayDeduction)/ finances.lastDayDeduction *100 ))
        setMonthlyDeductionGrowthLoss(Math.floor(Math.abs(finances.monthlyDeduction - finances.lastMonthDeduction)/ finances.lastMonthDeduction *100 ))

        finances.dailyFinances - finances.lastDay>0? setDailyGrowthLossSign(true) : setDailyGrowthLossSign(false)
        finances.weeklyFinances - finances.lastWeek>0? setWeeklyGrowthLossSign(true) : setWeeklyGrowthLossSign(false)
        finances.monthlyFinances - finances.lastMonth>0? setMonthlyGrowthLossSign(true) : setMonthlyGrowthLossSign(false)
        finances.yearlyFinances - finances.lastYear>0? setYearlyGrowthLossSign(true) : setYearlyGrowthLossSign(false)
        finances.dailyDeduction - finances.lastDayDeduction>0? setDailyDeductionGrowthLossSign(true) : setMonthlyDeductionGrowthLossSign(false)
        finances.monthlyDeduction - finances.lastMonthDeduction>0? setMonthlyDeductionGrowthLossSign(true) : setMonthlyDeductionGrowthLossSign(false)
        
      }

  },[finances])

  useEffect(()=>{
    if(orders){
      let monthlyCost = 0;
      let lastMonthCost = 0;
      orders?.map((order)=>{
        let monthDiff = new Date(order.time_ordered).getMonth() === new Date().getMonth(); 
        let lastMonthDiff = new Date(order.time_ordered).getMonth() === new Date().getMonth() -1 ; 
        let yearDiff = new Date(order.time_ordered).getFullYear() === new Date().getFullYear(); 

        if(monthDiff && yearDiff){
          monthlyCost += order.cost;
        }else if(lastMonthDiff && yearDiff){
          lastMonthCost += order.cost;
        }
      })
      
      setProductsRevenue(monthlyCost)
      setProductsGrowthLoss(Math.floor(Math.abs(monthlyCost - lastMonthCost) / lastMonthCost *100))
      monthlyCost - lastMonthCost> 0 ? setProductsGrowthLossSign(true) : setProductsGrowthLossSign(false)
    }
  }, [orders])

  useEffect(()=>{
    if(date){
      setDay(arabicWeekNames[new Date(date).getDay()])
      axios.get(`/finances/${date}`, {withCredentials:true})
      .then(({data})=>{
        setFinances(data)
        setCurrentFinances(data.currentDayFinances)
        console.log(data)
      })
      axios.get('/orders/outer', {withCredentials: true})
      .then(({data})=>{
        setOrders(data.outerOrders)
      })  
  }
  },[date])

  useEffect(()=>{
    currentFinances&& console.log(currentFinances)
  }, [currentFinances])

  return (
    <div dir='rtl' className="lg:px-36 px-10 bg-[navy] pt-32 pb-10 flex flex-col gap-6 h-screen ">
    
      {showAddDeductionPopup&& 
      <>
        <div onClick={()=>setShowAddDeductionPopup(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout z-[99]'></div>
        <AddDeducionPopup {...{setShowAddDeductionPopup}} />
      </>
      }
    
      <h1 className="text-3xl align-middle lg font-semibold text-white">لوحة المعلومات</h1>

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
              {isFinite(dailyGrowthLoss) &&  !isNaN(dailyGrowthLoss) &&
                <p className={`text-lg font-bold ${dailyGrowthLossSign ? 'text-green-500' : 'text-red-500'}`}>{dailyGrowthLoss}% {dailyGrowthLossSign? "↑" : "↓"}</p>
              }
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 ">
            <h2 className="text-lg font-semibold mb-2">الايراد الاسبوعي</h2>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{finances?.weeklyFinances}<span className='font-noto'>ج</span></p>
              {isFinite(weeklyGrowthLoss) && !isNaN(weeklyGrowthLoss) &&
                <p className={`text-lg font-bold ${weeklyGrowthLossSign ? 'text-green-500' : 'text-red-500'}`}>{weeklyGrowthLoss}% {weeklyGrowthLossSign? "↑" : "↓"}</p>
              }
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">الايراد الشهري</h2>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{finances?.monthlyFinances}<span className='font-noto'>ج</span></p>
              {isFinite(monthlyGrowthLoss) && !isNaN(monthlyGrowthLoss)  &&
                <p className={`text-lg font-bold ${monthlyGrowthLossSign ? 'text-green-500' : 'text-red-500'}`}>{monthlyGrowthLoss}% {monthlyGrowthLossSign? "↑" : "↓"}</p>
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
                  {isFinite(dailyDeductionGrowthLoss) && !isNaN(dailyDeductionGrowthLoss) &&
                    <p className={`text-lg font-bold ${dailyGrowthLossSign?  'text-red-500' : 'text-green-500'}`}>{dailyDeductionGrowthLoss}% {setDailyDeductionGrowthLossSign? "↑" : "↓"}</p>
                  }
                </div>
              </div>
              <div>
                <span className='text-sm'>( هذا الشهر)</span>
                <div className='flex gap-4 items-end'>
                  <p className="text-2xl font-bold">{finances?.monthlyDeduction}<span className='font-noto'>ج</span></p>
                  {isFinite(monthlyDeductionGrowthLoss) && !isNaN(monthlyDeductionGrowthLoss) &&
                    <p className={`text-lg font-bold ${monthlyDeductionGrowthLossSign?  'text-red-500' : 'text-green-500'}`}>{monthlyDeductionGrowthLoss}% {monthlyDeductionGrowthLossSign? "↑" : "↓"}</p>
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">ايرادات المنتجات</h2>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{productsRevenue}<span className='font-noto'>ج</span></p>
              {isFinite(productsGrowthLoss)&& !isNaN(productsGrowthLoss)&&
                <p className={`text-lg font-bold ${productsGrowthLossSign ?    'text-green-500' : 'text-red-500'}`}>{(productsGrowthLoss)}% {productsGrowthLossSign? "↑" : "↓"}</p>
              }
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">الايراد السنوي</h2>
            <div className='flex gap-4 items-end'>
              <p className="text-2xl font-bold">{finances?.yearlyFinances}<span className='font-noto'>ج</span></p>
              {isFinite(yearlyGrowthLoss) && !isNaN(yearlyGrowthLoss)  &&
                <p className={`text-lg font-bold ${yearlyGrowthLossSign ? 'text-green-500' : 'text-red-500'}`}>{yearlyGrowthLoss}% {yearlyGrowthLossSign? "↑" : "↓"}</p>
              }
            </div>
          </div>
          <div className="flex flex-col text-center bg-gray-200 rounded-lg shadow-md text-black col-start-2 row-start-2 col-end-4 lg:col-end-5 lg:row-end-6 row-end-5 overflow-hidden">
            <div className='p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-scroll' style={{gridAutoRows: '200px'}}>
              {currentFinances?.map((finance, i ) =>
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
