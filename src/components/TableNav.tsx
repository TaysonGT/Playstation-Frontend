import { useTranslation } from 'react-i18next'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { getDirection } from '../i18n'

type pageAction = "next" | "previous" | "start" | "end"

interface Props {
  pageCount: number;
  maxPages: number;
  onChange: (page: number)=> void
}

const TableNav:React.FC<Props> = ({pageCount, maxPages, onChange}) => {
    const {i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);

    const changePage = (action: pageAction)=>{
        const page = JSON.stringify(actionNav(action, pageCount, maxPages))
        onChange(parseInt(page))
    }
    
    const actionNav = (action: pageAction, count: number, endPage: number)=>{
        switch(action){
            case "next": return Math.min(count+1, endPage)
            case "previous": return Math.max(count-1, 1)
            case "start": return 1
            case "end": return endPage
        }
    }
  return (
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
  )
}

export default TableNav
