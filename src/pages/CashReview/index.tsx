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
import { Link } from 'react-router';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

export interface ICashReport {
    selectedCollection: ICollection;
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
  const [selectedCollection, setSelectedCollection] = useState<ICollection|null>(null)
  
  const fetchCashReport = async()=>{
    setIsLoading(true)
    await axios.get('/cash/report', {params:{collection_id: selectedCollection?.id}})
    .then(({data})=>{
        if(!data.success) return toast.error(data.message);
        setReport(data)
    }).finally(()=> setIsLoading(false))
  }


  useEffect(()=>{
    fetchCashReport()
  }, [selectedCollection])

  return (
        <div dir={currentDirection} className='h-full flex flex-col'>
            <div className='border-b text-black border-gray-200 px-10 py-6'>
                <h1 className='text-2xl font-bold flex items-center gap-2'><Link to='/dashboard'>{t('dashboard.dashboard')}</Link> {currentDirection==='rtl'? <MdKeyboardArrowLeft className='text-4xl'/> : <MdKeyboardArrowRight className='text-4xl'/>} {t('dashboard.cashReview')}</h1>
            </div>
            <div className='flex-1 grid grid-cols-2 bg-[#ECFAE5] overflow-y-auto'>
                <div className={`px-10 py-6 ${currentDirection==='ltr'? 'border-r' : 'border-l'} border-gray-200`}>
                    {isLoading? 
                        <div className='flex justify-center items-center h-full'><Loader size={50} thickness={10}/></div>
                    :(
                    <>
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
                                <h1 className='mb-2 text-gray-600'>{t('dashboard.reviewPeriod')}</h1>
                                <div className='flex gap-2'><span className='font-bold'>{t('dashboard.from')}:</span> <span className='grow'>{report?.lastCollection?formatDateWithRegion(report?.lastCollection.timestamp, i18n.language==='ar'?'ar-US':'en-US'):t('dashboard.ever')}</span></div>
                                <div className='flex gap-2'><span className='font-bold'>{t('dashboard.until')}:</span> <span className='grow'>{report?.selectedCollection?formatDateWithRegion(report?.selectedCollection.timestamp, i18n.language==='ar'?'ar-US':'en-US'):t('dashboard.now')}</span></div>
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
                                    <td className='p-2'>{employee.firstReceipt?formatDateWithRegion(employee.firstReceipt, i18n.language === 'ar'? 'ar-US': 'en-US', true):t('receipts.noReceipts')}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                    )}
                </div>
                <CollectionsTable refresh={fetchCashReport} setCollection={setSelectedCollection} selectedCollection={selectedCollection}/>
            </div>
        </div>
    )
};

export default CashReviewPage;
