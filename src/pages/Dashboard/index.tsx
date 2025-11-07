import { useTranslation } from 'react-i18next';
import { getDirection } from '../../i18n';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReceiptsTable from './ReceiptsTable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useConfigs } from '../../context/ConfigsContext';
import ListDialogue from './components/ListDialogue';
import { ICollection } from '../../types';
import { Link } from 'react-router';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#99a1af', '#ff6b6b', '#6bcf63', '#a66cff', '#ff6fcf', '#42aaff', '#ffb142'];

type Data = {date: string, sales: number}

type RevenueType = {total: number, data: Data[], growthLoss: number}

interface TotalRevenueType {
  total: number, 
  totalProducts: number, 
  totalPlaying: number, 
  totalOuter: number, 
  totalSession: number, 
  hours: number, 
  totalGrowthLoss: number, 
  outerGrowthLoss: number, 
  sessionsGrowthLoss: number, 
  productsGrowthLoss: number, 
  playingGrowthLoss: number, 
  data: {date: string, Playing: number, Products: number, Total: number}[],
  growthLossOuter: number, 
  growthLossSession: number
}

export interface ProductsRevenueType extends RevenueType {
  productsList:{product:string, percent:number, sales:number}[]
}

export interface EmployeesRevenueType {
  usersRevenue:{
    cashier: string;
    revenue: number;
    growthLoss: number;
    percent: number;
  }[],
  employeesList:{
    cashier: string;
    revenue: number;
    growthLoss: number;
    percent: number;
  }[]
}

const DashboardPage = () => {
  // const [isLoading, setIsLoading] = useState(true)
  const [showList, setShowList] = useState<'employees'|'products'|null>(null)
  const {t, i18n} = useTranslation()
  const currentDirection = getDirection(i18n.language);
  const [totalRevenue, setTotalRevenue] = useState<TotalRevenueType>()
  const [productsRevenue, setProductsRevenue] = useState<ProductsRevenueType>()
  const [employeesRevenue, setEmployeesRevenue] = useState<EmployeesRevenueType>()
  const [balance, setBalance] = useState<{total: number, lastCollection: ICollection}>()
  const [period, setPeriod] = useState<'monthly'|'yearly'>('monthly')
  const [date, setDate] = useState(new Date(new Date().setDate(1)))
  const {configs} = useConfigs()
  
  const currentDateHandler = (e:React.InputEvent<HTMLInputElement>)=>{
    let currDate = e.currentTarget.value;
    setDate(new Date(new Date(currDate).setHours(0,0,0,0)))
  }

  const formatDate = (date: Date)=>{
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0')

    return `${year}-${month}`;
  }

  const fetchProductsRevenue = async()=>{
    await axios.get('/finances/products', {params: {period, date: date.toISOString()}})
    .then(({data})=>{
      if(!data.success) return toast.error('Failed to load Total played hours')
      setProductsRevenue({
        ...data,
        data: data.data.map((d: {date: string, sales: number})=>({
          ...d, 
          date: period==='monthly'? new Date(d.date).toLocaleDateString(undefined, {month: 'short', day: '2-digit'})
            :new Date(d.date).toLocaleDateString(undefined, {year: 'numeric', month:'short'})
        }))
      })
    })
  }

  const fetchTotalRevenue = async()=>{
    await axios.get('/finances/collective', {params: {period, date: date.toISOString()}})
    .then(({data})=>{
      if(!data.success) return toast.error('Failed to load Total played hours')
      setTotalRevenue({
        ...data,
        data: data.data.map((d: {date: string, sales: number})=>({
          ...d, 
          date: period==='monthly'? new Date(d.date).toLocaleDateString(undefined, {month: 'short', day: '2-digit'})
            :new Date(d.date).toLocaleDateString(undefined, {year: 'numeric', month:'short'})
        }))
      })
    })
  }

  const fetchEmployeesRevenue = async()=>{
    await axios.get('/finances/employees', {params: {period, date: date.toISOString(), top5: true}})
    .then(({data})=>{
      if(!data.success) return toast.error('Failed to load Total played hours')
      setEmployeesRevenue(data)
    })
  }

  const fetchBalance = async()=>{
    await axios.get('/cash/balance')
    .then(({data})=>{
      if(!data.success) return toast.error('Failed to load Total played hours')
      setBalance(data)
    })
  }

  useEffect(()=>{
    fetchProductsRevenue()
    fetchTotalRevenue()
    fetchBalance()
    fetchEmployeesRevenue()
  },[period, date])
 
  

  return (
  // isLoading? 
  //   <div className='flex justify-center items-center h-full'><Loader size={50} thickness={10}/></div>
  // :(
    <div dir={currentDirection} className='h-full flex flex-col w-full'>
      
      <ListDialogue {...{cancel:()=>setShowList(null), productsRevenue, employeesRevenue, showList}}/>

      <div className='w-full flex gap-10 px-10 py-6 grow items-center border-b border-gray-200'>
        <h1 className="text-4xl font-semibold text-black">{t('dashboard.dashboard')}</h1>
        <div className='flex gap-20 items-center'>
          <div className='flex items-center'>
            <p className='font-bold'>{t('dashboard.reportingCycle')}:</p>
            <input onChange={(e)=>e.target.checked&&setPeriod('monthly')} className='mx-2' type="radio" name="period" checked={period==='monthly'}/>
            <label>{t('dashboard.monthly')}</label>
            <input onChange={(e)=>e.target.checked&&setPeriod('yearly')} className='mx-2' type="radio" name="period" checked={period==='yearly'} />
            <label>{t('dashboard.yearly')}</label>
          </div>
          <div className='flex items-center gap-2'>
            <p className='font-bold'>{t('dashboard.month')}:</p>            
            <input value={formatDate(date)} type="month" className='bg-white text-black px-3 py-1 rounded-md shadow-sm border border-gray-200 hover:bg-green-200' onInput={currentDateHandler} />
          </div>
        </div>
      </div>
      <div className="h-full px-6 overflow-y-auto grid grid-cols-2 min-h-0">
        <div className={`bg-white flex flex-col ${currentDirection==='ltr'? 'border-r': 'border-l'} border-gray-200`}>
          <h1 className='px-5 pt-5 mb-2 text-2xl font-bold'>{t('dashboard.revenue')}</h1>
          <div className='h-80 flex flex-col p-5 border-b border-gray-200'>
            <div className='flex w-full gap-4 flex-wrap'>
              <div className='flex-1'>
                <h1 className='text-gray-600'>{t('dashboard.totalRevenue')}</h1>
                <div className='flex gap-2 items-center'>
                  <h1 className='text-xl font-bold mb-2 text-nowrap'>{totalRevenue?.total.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></h1>
                  {!(!totalRevenue?.totalGrowthLoss || totalRevenue?.totalGrowthLoss===0) &&
                      <p className={`text-base font-bold flex gap-1 ${totalRevenue?.totalGrowthLoss>0 ? 'text-green-500' : 'text-red-500'}`}>{totalRevenue?.totalGrowthLoss>0? "↑" : "↓"}<span>{Math.abs(totalRevenue?.totalGrowthLoss)}%</span></p>
                    }
                </div>
              </div>
              <div className='flex-1'>
                <h1 className='text-gray-600'>{t('dashboard.playingRevenue')}</h1>
                <div className='flex gap-2 items-center'>
                  <h1 className='text-xl font-bold mb-2 text-nowrap'>{totalRevenue?.totalPlaying.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></h1>
                  {!(!totalRevenue?.playingGrowthLoss || totalRevenue?.playingGrowthLoss===0) &&
                      <p className={`text-base font-bold flex gap-1 ${totalRevenue?.playingGrowthLoss>0 ? 'text-green-500' : 'text-red-500'}`}>{totalRevenue?.playingGrowthLoss>0? "↑" : "↓"}<span>{Math.abs(totalRevenue?.playingGrowthLoss)}%</span></p>
                    }
                </div>
              </div>
              <div className='flex-1'>
                <h1 className='text-gray-600'>{t('dashboard.productsRevenue')}</h1>
                <div className='flex gap-2 items-center'>
                  <h1 className='text-xl font-bold mb-2 text-nowrap'>{totalRevenue?.totalProducts.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></h1>
                  {!(!totalRevenue?.productsGrowthLoss || totalRevenue?.productsGrowthLoss===0) &&
                      <p className={`text-base font-bold flex gap-1 ${totalRevenue?.productsGrowthLoss>0 ? 'text-green-500' : 'text-red-500'}`}>{totalRevenue?.productsGrowthLoss>0? "↑" : "↓"}<span>{Math.abs(totalRevenue?.productsGrowthLoss)}%</span></p>
                    }
                </div>
              </div>
              <div className='flex-1'>
                <h1 className='text-gray-600'>{t('dashboard.totalHours')}</h1>
                <h1 className='text-xl font-bold mb-2 text-nowrap'>{totalRevenue?.hours.toLocaleString('en-US')} {t('dashboard.hours')}</h1>
              </div>
            </div>
            <div className='grow' dir='ltr'>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  width={500}
                  height={400}
                  data={totalRevenue?.data}
                  margin={{
                    top: 10,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" reversed={currentDirection==='rtl'} />
                  <YAxis orientation={currentDirection==='rtl'? 'right': 'left'} />
                  <Tooltip />
                  <Area type="monotone" dataKey="playing" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="products"  stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="total"  stroke="#ff6b6b" 
                    fill="none" 
                    strokeWidth={3}
                    dot={{ fill: '#ff6b6b', strokeWidth: 2 }}
                    />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='border-b grid grid-cols-2 border-gray-200'>
            <div className={`${currentDirection==='ltr'? 'border-r' : 'border-l'} border-gray-200 p-5 flex flex-col`}>
              <h1 className='text-gray-600 mb-2'>{t('dashboard.employees')}</h1>
              <div className='flex w-full h-2 gap-1 mb-3'>
                {
                  employeesRevenue?.employeesList.map((employee,i)=>(
                    <div key={i} style={{backgroundColor: COLORS[i], flex: employee.percent}} className={`rounded-xs`}></div>
                  ))
                }
              </div>
              <ul className='grow'>
                {employeesRevenue?.employeesList.slice(0,5).map((employee,i)=>
                  <li key={i} className='flex items-center w-full gap-2 p-1'>
                    <span style={{backgroundColor: COLORS[i]}} className='w-2 h-2 rounded-full'/>
                    <p className='grow'>{employee.cashier}</p>
                    <p className='w-1/4 text-end'>{employee.revenue.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></p>
                    <p className='w-1/4 text-center'>{employee.percent}%</p>
                  </li>
                )}
                {employeesRevenue&& employeesRevenue.employeesList.length>5&&<li onClick={()=>setShowList('employees')} className='p-1 inline-block underline text-gray-700 cursor-pointer hover:text-gray-900 text-start'>{t('tables.showMore')}</li>}
              </ul>
            </div>
            <div className='flex flex-col p-5'>
              <h1 className='text-gray-600 mb-2'>{t('dashboard.topProducts')}</h1>
              <div className='flex w-full h-2 gap-1 mb-3'>
                {
                  productsRevenue?.productsList.map((percent,i)=>(
                    <div key={i} style={{backgroundColor: COLORS[i], flex: percent.percent}} className={`rounded-xs duration-500 ease-in-out`}/>
                  ))
                }
              </div>
              <ul className='grow'>
                {productsRevenue?.productsList.slice(0,5).map((p,i)=>
                  <li key={i} className='flex items-center w-full gap-2 p-1'>
                    <span style={{backgroundColor: COLORS[i]}} className='w-2 h-2 rounded-full'/>
                    <p className='grow'>{p.product}</p>
                    <p className='w-1/4 text-end'>{p.sales.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></p>
                    <p className='w-1/4 text-center'>{p.percent}%</p>
                  </li>
                )}
                {productsRevenue&& productsRevenue.productsList.length>5&&<li onClick={()=>setShowList('products')}  className='p-1 inline-block underline text-gray-700 cursor-pointer hover:text-gray-900 text-start'>{t('tables.showMore')}</li>}
              </ul>
            </div>
          </div>
          <div className='grid grid-cols-2 grow'>
            <div className={`${currentDirection==='ltr'? 'border-r' : 'border-l'} border-gray-200 p-5 flex flex-col`}>
              <h1 className='text-gray-600'>{t('dashboard.balance')}</h1>
              <h1 className='text-xl font-bold'>{balance?.total.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></h1>
              {
                balance?.lastCollection?<p className='mt-2'><span className='font-bold'>{t('dashboard.lastCollection')}:</span> {new Date(balance.lastCollection.timestamp).toLocaleDateString()}, {new Date(balance.lastCollection.timestamp).toLocaleTimeString()}</p>
                :<p className='text-gray-600 mt-2'>{t('dashboard.noCollections')}...</p>
              }
              <Link to='/dashboard/cash-review' className='rounded-sm self-start duration-150 px-3 py-2 mt-2 text-white bg-blue-600 hover:bg-blue-500'>{t('dashboard.reviewCash')}</Link>
            </div>
            
          </div>
        </div>
        <div className='flex flex-col bg-white'>
          <h1 className='px-5 pt-5 mb-2 text-2xl font-bold'>{t('receipts.receipts')}</h1>
          <div className='h-40 border-b border-gray-200 p-5 flex flex-col'>
            {totalRevenue&&
              <div className='flex grow gap-2'>
                  <div style={{flex: Math.min(Math.max(totalRevenue?.totalSession/totalRevenue?.total, 0.2),0.8)||1}} className='flex px-4 pb-2 flex-col border-x border-gray-200 border-b-6 border-b-purple-400'>
                    <h1 className='text-gray-600'>{t('receipts.sessionReceipts')}</h1>
                    <h1 className='text-xl font-bold'>{totalRevenue.totalSession.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></h1>
                    <p className='mt-auto'>{(totalRevenue?.totalSession*100/(totalRevenue.totalSession+totalRevenue.totalOuter)||0).toFixed(1)}%</p>
                  </div>
                  <div style={{flex: Math.min(Math.max(totalRevenue?.totalOuter/totalRevenue?.total, 0.2),0.8)||1}} className='flex px-4 pb-2 flex-col border-x border-gray-200 border-b-6 border-b-green-400'>
                    <h1 className='text-gray-600'>{t('receipts.outerReceipts')}</h1>
                    <h1 className='text-xl font-bold'>{totalRevenue.totalOuter.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></h1>
                    <p className='mt-auto'>{(totalRevenue?.totalOuter*100/(totalRevenue.totalSession+totalRevenue.totalOuter)||0).toFixed(1)}%</p>
                  </div>
              </div>
            }
          </div>
          <div className='grow min-h-0 p-4'>
            <ReceiptsTable/>
          </div>
        </div>
      </div>      
    </div>
  );
};

export default DashboardPage;
