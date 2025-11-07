import { useEffect, useState } from 'react'
import { ICollection } from '../../types'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../i18n'
import axios from 'axios'
import { useConfigs } from '../../context/ConfigsContext'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'
import { formatDateWithRegion } from '../../utlis/date'
import NewCollectionDialogue from '../Dashboard/components/NewCollectionDialogue'

type pageAction = "next" | "previous" | "start" | "end"

interface Props {
    refresh:()=>void;
    setCollection?: React.Dispatch<React.SetStateAction<ICollection|null>>;
    selectedCollection?: ICollection | null;
}

const CollectionsTable:React.FC<Props> = ({refresh, setCollection, selectedCollection}) => {
    const [isLoading, setIsLoading] = useState(true)
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);
    const [collections, setCollections] = useState<ICollection[]>([])
    const [pageCount, setPageCount] = useState<number>(1)
    const [maxPages, setMaxPages] = useState<number>(0)
    const [showNewCollection, setShowNewCollection] = useState(false)

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
    
    const fetchCollections = async ()=>{
        setIsLoading(true)
        await axios.get('/cash/collections', {params:{page: pageCount, limit:10}})
        .then(({data})=>{
            if(!data.success) return toast.error(data.message);
            setCollections(data.collections)
            setMaxPages(Math.ceil(data.total/10))
        }).finally(()=> setIsLoading(false))
    }

    const {configs} = useConfigs()

    useEffect(()=>{
        fetchCollections()
    }, [pageCount])


  return (
    <div className='px-10 py-6'>
        <NewCollectionDialogue show={showNewCollection} refresh={()=>{
            fetchCollections()
            refresh()
        }} cancel={()=>setShowNewCollection(false)}/>
        <div className='flex justify-between items-center'>
            <h1 className='text-xl font-bold'>{t('dashboard.collectionsHistory')}</h1>
            <button onClick={()=>setShowNewCollection(true)} className='bg-[#5D866C] hover:bg-[#769c84] duration-150 rounded-sm px-4 py-2 text-white mt-4'>{t('dashboard.newCollection')}</button>

        </div>
        {isLoading?
            <div className='flex justify-center items-center py-20'>
                <Loader size={50} thickness={10}/>
            </div>
        :collections.length===0?
            <div className='w-full flex justify-center text-gray-400 font-bold py-20'>
                <p>{t('dashboard.noCollections')}</p>
            </div>
        :
        <>
            <table className='w-full mt-8 text-center border border-gray-200 bg-white shadow-soft'>
                <thead className='bg-[#5D866C] text-white text-sm'>
                    <tr className='border-b border-gray-200'>
                        <th className='p-2 border-x border-gray-200 text-center'>{t('tables.no')}</th>
                        <th className='p-2 text-center'>{t('tables.employee')}</th>
                        <th className='p-2 text-center'>{t('dashboard.collectedCash')}</th>
                        <th className='p-2 text-center'>{t('dashboard.remaining')}</th>
                        <th className='p-2 text-center'>{t('tables.date')}/{t('tables.time')}</th>
                        {setCollection&&
                            <th className='p-2 text-center'>{t('tables.actions')}</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {collections?.map((collection, i)=>(
                    <tr key={i} className='not-last:border-b border-gray-200 hover:bg-gray-50'>
                        <td className='p-2 border-x border-gray-200 text-center'>{i+1}</td>
                        <td className='p-2'>{collection.collected_by.username}</td>
                        <td className='p-2'>{collection.amount_collected.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></td>
                        <td className='p-2'>{collection.float_remaining.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></td>
                        <td className='p-2 text-sm font-bold'>{formatDateWithRegion(collection.timestamp, i18n.language === 'ar'? 'ar-US': 'en-US', true)}</td>
                        {setCollection&&
                            <td className='p-2 flex items-center justify-center text-sm font-bold'>
                                <button onClick={()=>setCollection(prev=>prev?.id===collection.id?null:collection)} className={`p-2 rounded-sm text-white ${selectedCollection?.id===collection.id?'bg-gray-400':'bg-green-500'} `}>{selectedCollection?.id===collection.id?t('tables.unselect'):t('tables.select')}</button>
                            </td>
                        }
                    </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex gap-2 py-2 text-xl justify-center mt-auto'>
                <div onClick={()=>changePage('previous')} className={`w-8 duration-150 aspect-square flex justify-center items-center border border-${pageCount>1? 'black cursor-pointer  hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400]': 'gray-200 text-gray-500 cursor-not-allowed'}`}>
                    {currentDirection==='ltr'? <MdKeyboardDoubleArrowLeft/> : <MdKeyboardDoubleArrowRight/>}
                </div>
                <div onClick={()=>changePage('previous')} className={`w-8 duration-150 aspect-square flex justify-center items-center border border-${pageCount>1? 'black cursor-pointer  hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400]': 'gray-200 text-gray-500 cursor-not-allowed'}`}>
                    {currentDirection==='ltr'? <MdKeyboardArrowLeft/> : <MdKeyboardArrowRight/>}
                </div>
                <div className='w-8 hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400] cursor-pointer duration-150 aspect-square flex justify-center items-center border border-black text-sm font-bold py-1'>{pageCount}</div>
                <div onClick={()=>changePage('next')} className={`w-8 duration-150 aspect-square flex justify-center items-center border border-${pageCount<maxPages? 'black cursor-pointer hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400]': 'gray-200 text-gray-500 cursor-not-allowed'}`}>
                    {currentDirection==='ltr'? <MdKeyboardArrowRight/> : <MdKeyboardArrowLeft/>}
                </div>
                <div onClick={()=>changePage('end')} className={`w-8 duration-150 aspect-square flex justify-center items-center border border-${pageCount<maxPages? 'black cursor-pointer hover:bg-[#FFB400] hover:text-white hover:border-[#FFB400]': 'gray-200 text-gray-500 cursor-not-allowed'}`}>
                    {currentDirection==='ltr'? <MdKeyboardDoubleArrowRight/> : <MdKeyboardDoubleArrowLeft/>}
                </div>
            </div>
        </>
        }
    </div>
  )
}

export default CollectionsTable