import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDirection } from '../../i18n';
import { useConfigs } from '../../context/ConfigsContext';
import axios from 'axios';
import Loader from '../../components/Loader';
import { ICollection, IEmployeeReport } from '../../types';
import { formatDateWithRegion } from '../../utlis/date';
import toast from 'react-hot-toast';
import CollectionsTable from './CollectionsTable';

export interface ICashReport {
    lastCollection: ICollection;
    employeesRevenue: IEmployeeReport[];
    total: number
}

const CashReviewPage = () => {
  const {t, i18n} = useTranslation()
  const currentDirection = getDirection(i18n.language);
  const {configs} = useConfigs()
  const [report, setReport] = useState<ICashReport>()
  const [isLoading, setIsLoading] = useState(true)
  
  const fetchCashReport = async()=>{
    setIsLoading(true)
    await axios.get('/cash/report')
    .then(({data})=>{
        if(!data.success) return toast.error(data.message);
        setReport(data)
    }).finally(()=> setIsLoading(false))
  }


  useEffect(()=>{
    fetchCashReport()
  }, [])

  return (
    isLoading? 
        <div className='flex justify-center items-center h-full'><Loader size={50} thickness={10}/></div>
    :(
        <div dir={currentDirection} className='h-full flex flex-col'>
            <div className='border-b text-black border-gray-200 px-10 py-6'>
                <h1 className='text-2xl font-bold'>{t('dashboard.cashReview')}</h1>
            </div>
            <div className='flex-1 grid grid-cols-2 bg-[#ECFAE5] overflow-y-auto'>
                <div className={`px-10 py-6 ${currentDirection==='ltr'? 'border-r' : 'border-l'} border-gray-200`}>
                    <div className='flex gap-10'>
                        <div className='p-4 shadow-soft rounded-md flex-1 bg-white'>
                            <h1 className='mb-2 text-gray-600'>{t('dashboard.balance')}</h1>
                            <h1 className='text-xl font-bold'>{report?.total.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></h1>
                        </div>
                        <div className='p-4 shadow-soft rounded-md flex-1 bg-white'>
                            <h1 className='mb-2 text-gray-600'>{t('dashboard.startingBalance')}</h1>
                            <h1 className='text-xl font-bold'>{report?.lastCollection?.float_remaining.toLocaleString('en-US')||0} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></h1>
                        </div>
                        <div className='p-4 shadow-soft rounded-md flex-1 bg-white'>
                            <h1 className='mb-2 text-gray-600'>{t('dashboard.lastCollection')}</h1>
                            {report?.lastCollection?
                                <h1 className='font-bold'>{formatDateWithRegion(report.lastCollection.timestamp, i18n.language==='ar'?'ar-US':'en-US')}</h1>
                                :
                                <h1 className='text-gray-500'>{t('dashboard.noCollections')}</h1>
                            }
                        </div>
                    </div>
                    <table className='w-full mt-8 text-center border border-gray-200 bg-white shadow-soft'>
                        <thead className='bg-[#5D866C] text-white text-sm'>
                            <tr className='border-b border-gray-200'>
                                <th className='p-2 border-x border-gray-200 text-center'>{t('tables.no')}</th>
                                <th className='p-2 text-center'>{t('tables.employee')}</th>
                                <th className='p-2 text-center'>{t('tables.total')}</th>
                                <th className='p-2 text-center'>{t('tables.firstReceipt')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report?.employeesRevenue?.map((employee, i)=>(
                            <tr key={i} className='not-last:border-b border-gray-200 hover:bg-gray-50'>
                                <td className='p-2 border-x border-gray-200 text-center'>{i+1}</td>
                                <td className='p-2'>{employee.username}</td>
                                <td className='p-2'>{employee.total?.toLocaleString('en-US')||0} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></td>
                                <td className='p-2'>{employee.firstReceipt?formatDateWithRegion(employee.firstReceipt, i18n.language === 'ar'? 'ar-US': 'en-US'):t('receipts.noReceipts')}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <CollectionsTable refresh={fetchCashReport}/>
            </div>
        </div>
    )
  )
};

export default CashReviewPage;
