import { useEffect, useState } from 'react'
import { IReceipt } from '../../types'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../i18n'
import axios from 'axios'
import { useConfigs } from '../../context/ConfigsContext'
import { RiEyeLine } from 'react-icons/ri'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import DarkBackground from '../../components/DarkBackground'
import SessionReceipt from '../Receipts/partials/receipt/SessionReceipt'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'

type pageAction = "next" | "previous" | "start" | "end"

const ReceiptsTable = ({refresh}:{refresh?:boolean}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [selectedType, setSelectedType] = useState<'session'|'outer'|null>(null)
    const [selectedReceipt, setSelectedReceipt] = useState<IReceipt|null>(null)
    const [receipts, setReceipts] = useState<IReceipt[]>([])
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);

    const {currentUser} = useAuth()
    const [pageCount, setPageCount] = useState<number>(1)
    const [maxPages, setMaxPages] = useState<number>(0)

    const {configs} = useConfigs()

    const changePage = (action: pageAction)=>{
        const page = JSON.stringify(actionNav(action, pageCount, maxPages))
        setPageCount(parseInt(page))
    }
    
    const actionNav = (action: pageAction, count: number, endPage: number)=>{
        switch(action){
            case "next": return Math.min(count+1, endPage)
            case "previous": return Math.max(count-1, 1)
            case "start": return 1
            case "end": return endPage
        }
    }

    const refetch = async()=>{
        setIsLoading(true)
        await axios.get(`/receipts${currentUser?.role==='admin'?'':'/employee'}`, {params:{page: pageCount, type: selectedType}, withCredentials:true})
        .then(({data})=> {
            setReceipts(data.receipts)
            setMaxPages(Math.ceil(data.total/data.limit))
        }).finally(()=> setIsLoading(false))
    }

    useEffect(()=>{
        refetch()
    }, [pageCount, selectedType, refresh])


  return (
    <div className="flex flex-col h-full text-black col-start-2 row-start-2 col-end-4 lg:col-end-5 lg:row-end-6 row-end-5 overflow-hidden">
        {selectedReceipt&& 
            <>
            <DarkBackground show={!!selectedReceipt} setShow={()=>setSelectedReceipt(null)} />
            <SessionReceipt {...{receipt:selectedReceipt, hide: ()=>setSelectedReceipt(null)}} />
            </>
        }
        <div className='flex mb-2 text-xs md:text-sm'>
            <button onClick={()=>setSelectedType(null)} className={`py-2 px-3 text-gray-500 border-gray-200 duration-75 hover:bg-gray-50 ${!selectedType&& 'text-gray-800 bg-gray-100 shadow-inner'}`}>{t('dashboard.all')}</button>
            <button onClick={()=>setSelectedType('session')} className={`py-2 px-3 text-gray-500 border-x border-gray-200 duration-75 hover:bg-gray-50 ${selectedType==='session'&& 'text-gray-800 bg-gray-100 shadow-inner'}`}>{t('receipts.session')}</button>
            <button onClick={()=>setSelectedType('outer')} className={`py-2 px-3 text-gray-500 duration-75 hover:bg-gray-50 ${selectedType==='outer' && 'text-gray-800 bg-gray-100 shadow-inner'}`}>{t('receipts.outer')}</button>
        </div>
        {isLoading?
            <div className='flex justify-center items-center grow py-10'>
                <Loader size={40} thickness={7}/>
            </div>
        :receipts.length>0?
        <div className='overflow-x-auto w-full grow'>
            <table className='w-full'>
                <thead>
                    <tr className='border-y border-gray-200 text-center font-md:bold text-xs md:text-sm  text-black'>
                        <th className='p-3 pl-4 text-center'>{t('tables.type')}</th>
                        <th className='p-3 text-center'>{t('tables.employee')}</th>
                        <th className='p-3 text-center'>{t('tables.time')}</th>
                        <th className='p-3 text-center'>{t('tables.total')}</th>
                        <th className='p-3 text-center'>{t('tables.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {receipts.map((receipt, i ) =>
                    <tr key={i} className="bg-white text-center border-b text-xs md:text-sm  text-gray-700 border-gray-200">
                        <td className="p-3 pl-4">
                            {receipt.type==="session" ? t('receipts.session') : receipt.type === "outer" ? t('receipts.outer') : t('receipts.deduction')}
                        </td>
                        <td className="p-3">
                            {receipt.cashier.username}
                        </td>
                        <td className="p-3 gap-2">
                            <p>{new Date(receipt.created_at).toLocaleString()}</p>
                        </td>
                        <td dir={currentDirection} className={"font-bold p-3 " + (receipt.type === "deduction"? "text-red-600" : "text-green-500")}>
                            <p className='flex items-center justify-center gap-1'>
                                {Math.abs(receipt.total).toLocaleString('en-US')}<span>{currentDirection==='rtl'? configs.currency.symbolNative: configs.currency.code}</span>
                            </p>
                        </td>
                        <td
                            onClick={()=>{
                                setSelectedReceipt(receipt)
                            }}
                            className="md:text-2xl text-lg flex items-center justify-center hover:text-cyan-700 cursor-pointer flex-[0.5] p-3 ">
                            <RiEyeLine />
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>
        :<div className='flex items-center justify-center py-8'>
            <p className='text-gray-500 font-semibold'>{t('receipts.noReceipts')}</p>
        </div>
        }
        <div className='flex gap-2 py-2 text-xl justify-center mt-auto'>
            <div onClick={()=>changePage('start')} className={`w-8 duration-150 aspect-square flex justify-center items-center border border-${pageCount>1? 'black cursor-pointer  hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400]': 'gray-200 text-gray-500 cursor-not-allowed'}`}>
                {currentDirection==='ltr'? <MdKeyboardDoubleArrowLeft/> : <MdKeyboardDoubleArrowRight/>}
            </div>
            <div onClick={()=>changePage('previous')} className={`w-8 duration-150 aspect-square flex justify-center items-center border border-${pageCount>1? 'black cursor-pointer  hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400]': 'gray-200 text-gray-500 cursor-not-allowed'}`}>
                {currentDirection==='ltr'? <MdKeyboardArrowLeft/> : <MdKeyboardArrowRight/>}
            </div>
            <div className='w-8 hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400] cursor-pointer  duration-150 aspect-square flex justify-center items-center border border-black text-xs md:text-sm  font-bold py-1'>{pageCount}</div>
            <div onClick={()=>changePage('next')} className={`w-8 duration-150 aspect-square flex justify-center items-center border border-${pageCount<maxPages? 'black cursor-pointer  hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400]': 'gray-200 text-gray-500 cursor-not-allowed'}`}>
                {currentDirection==='ltr'? <MdKeyboardArrowRight/> : <MdKeyboardArrowLeft/>}
            </div>
            <div onClick={()=>changePage('end')} className={`w-8 duration-150 aspect-square flex justify-center items-center border border-${pageCount<maxPages? 'black  cursor-pointer  hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400]': 'gray-200 text-gray-500 cursor-not-allowed'}`}>
                {currentDirection==='ltr'? <MdKeyboardDoubleArrowRight/> : <MdKeyboardDoubleArrowLeft/>}
            </div>
        </div>
    </div>
  )
}

export default ReceiptsTable