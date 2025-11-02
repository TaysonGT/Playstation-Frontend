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

type pageAction = "next" | "previous" | "start" | "end"

const ReceiptsTable = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [selectedType, setSelectedType] = useState<'session'|'outer'|null>(null)
    const [selectedReceipt, setSelectedReceipt] = useState<IReceipt|null>(null)
    const [receipts, setReceipts] = useState<IReceipt[]>([])
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);
      
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
        await axios.get(`/receipts`, {params:{page: pageCount, type: selectedType}, withCredentials:true})
        .then(({data})=> {
            setReceipts(data.receipts)
            setMaxPages(Math.ceil(data.total/data.limit))
        }).finally(()=> setIsLoading(false))
    }

    useEffect(()=>{
        refetch()
    }, [pageCount, selectedType])


  return (
    <div className="flex flex-col text-black col-start-2 row-start-2 col-end-4 lg:col-end-5 lg:row-end-6 row-end-5 overflow-hidden">
        {selectedReceipt&& 
            <>
            <DarkBackground show={!!selectedReceipt} setShow={()=>setSelectedReceipt(null)} />
            <SessionReceipt {...{receipt:selectedReceipt, hide: ()=>setSelectedReceipt(null)}} />
            </>
        }
        <div className='flex mb-2'>
            <button onClick={()=>setSelectedType(null)} className={`py-2 px-3 text-gray-500 border-gray-200 duration-75 hover:bg-gray-50 ${!selectedType&& 'text-gray-800 bg-gray-100'}`}>{t('dashboard.all')}</button>
            <button onClick={()=>setSelectedType('session')} className={`py-2 px-3 text-gray-500 border-x border-gray-200 duration-75 hover:bg-gray-50 ${selectedType==='session'&& 'text-gray-800 bg-gray-100'}`}>{t('receipts.session')}</button>
            <button onClick={()=>setSelectedType('outer')} className={`py-2 px-3 text-gray-500 duration-75 hover:bg-gray-50 ${selectedType==='outer' && 'text-gray-800 bg-gray-100'}`}>{t('receipts.outer')}</button>
        </div>
        <div className='flex items-stretch border-y border-gray-200 font-bold text-sm text-black'>
            <div className='flex-[0.5] p-3 pl-4 flex items-center'>{t('tables.type')}</div>
            <div className='flex-[0.5] p-3 flex items-center'>{t('tables.employee')}</div>
            <div className='flex-1 p-3 flex items-center'>{t('tables.time')}</div>
            <div className='flex-[0.5] p-3 flex items-center'>{t('tables.total')}</div>
            <div className='flex-[0.5] p-3 flex items-center justify-center'>{t('tables.actions')}</div>
        </div>
        <div className='flex flex-col overflow-y-auto bg-gray-100 grow'>
            {isLoading?
            <div className='py-20 flex justify-center w-full'>
                <Loader size={30} thickness={7} />
            </div>
            :receipts.length>0? receipts.map((receipt, i ) =>
            <div key={i} className="bg-white flex items-stretch border-b text-sm text-gray-700 border-gray-200">
                <div className="flex-[0.5] p-3 pl-4">
                    {receipt.type==="session" ? t('receipts.session') : receipt.type === "outer" ? t('receipts.outer') : t('receipts.deduction')}
                </div>
                <div className="flex-[0.5] p-3">
                    {receipt.cashier.username}
                </div>
                <div className="flex-1 p-3 flex gap-2 items-center ">
                    <p>{new Date(receipt.created_at).toLocaleString()}</p>
                </div>
                <div dir={currentDirection} className={"font-bold flex-[0.5] p-3 flex items-center gap-1 " + (receipt.type === "deduction"? "text-red-600" : "text-green-500")}>
                    {Math.abs(receipt.total)}<span>{currentDirection==='rtl'? configs.currency.symbolNative: configs.currency.symbol}</span>
                </div>
                <div
                    onClick={()=>{
                        setSelectedReceipt(receipt)
                    }}
                    className="text-2xl flex items-center justify-center hover:text-cyan-700 cursor-pointer flex-[0.5] p-3 ">
                    <RiEyeLine />
                </div>
            </div>
            ):
            <div className='w-full flex justify-center text-gray-400 font-bold'>
                <p>No Receipts Yet...</p>
            </div>
        }
        </div>
        <div className='flex gap-2 py-2 text-xl justify-center mt-auto'>
            <div onClick={()=>changePage('start')} className={`w-8 hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400] cursor-pointer  duration-150 aspect-square flex justify-center items-center border border-${pageCount>1? 'black cursor-pointer': 'gray-200 text-gray-500 cursor-not-allowed'}`}>
                {currentDirection==='ltr'? <MdKeyboardDoubleArrowLeft/> : <MdKeyboardDoubleArrowRight/>}
            </div>
            <div onClick={()=>changePage('previous')} className={`w-8 hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400] cursor-pointer  duration-150 aspect-square flex justify-center items-center border border-${pageCount>1? 'black cursor-pointer': 'gray-200 text-gray-500 cursor-not-allowed'}`}>
                {currentDirection==='ltr'? <MdKeyboardArrowLeft/> : <MdKeyboardArrowRight/>}
            </div>
            <div className='w-8 hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400] cursor-pointer  duration-150 aspect-square flex justify-center items-center border border-black text-sm font-bold py-1'>{pageCount}</div>
            <div onClick={()=>changePage('next')} className={`w-8 hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400] cursor-pointer  duration-150 aspect-square flex justify-center items-center border border-${pageCount<maxPages? 'black cursor-pointer': 'gray-200 text-gray-500 cursor-not-allowed'}`}>
                {currentDirection==='ltr'? <MdKeyboardArrowRight/> : <MdKeyboardArrowLeft/>}
            </div>
            <div onClick={()=>changePage('end')} className={`w-8 hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400] cursor-pointer  duration-150 aspect-square flex justify-center items-center border border-${pageCount<maxPages? 'black  cursor-pointer': 'gray-200 text-gray-500 cursor-not-allowed'}`}>
                {currentDirection==='ltr'? <MdKeyboardDoubleArrowRight/> : <MdKeyboardDoubleArrowLeft/>}
            </div>
        </div>
    </div>
  )
}

export default ReceiptsTable