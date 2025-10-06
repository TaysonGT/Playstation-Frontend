import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RiArrowRightCircleLine, RiBarChart2Line, RiBillFill, RiQuestionLine,  RiSettings5Line, RiShutDownLine } from "react-icons/ri";
import { useTranslation } from 'react-i18next';
import { MdAccessTimeFilled } from 'react-icons/md';
import { FaSquareMinus } from 'react-icons/fa6';
// import { getDirection } from '../i18n';

const Sidebar: React.FC = () => {
    const location = useLocation()
    const {t} = useTranslation()
    // const currentDirection = getDirection(i18n.language);

    const links = [
      {
        name: t('receipts.outerReceipts'),
        path: "/receipts/outer",
        icon: <RiBillFill/>
      },
      {
        name: t('receipts.sessionReceipts'),
        path: "/receipts/sessions",
        icon: <MdAccessTimeFilled/>
      },
      {
        name: t('dashboard.deductions'),
        path: "/receipts/deductions",
        icon: <FaSquareMinus/>
      },
      {
        name: "الأسئلة",
        path: "/questions",
        icon: <RiQuestionLine/>,
      },
      {
        name: "التقارير",
        path: "/reports",
        icon: <RiBarChart2Line/>
      },
      {
        name: "الإعدادات",
        path: "/settings",
        icon: <RiSettings5Line/>
      },
      {
        name: "إغلاق",
        path: "/power",
        icon: <RiShutDownLine/>
      },
    ]
    
  return ( 
      <div dir='rtl' className='flex flex-col p-6 bg-black text-white h-full group absolute z-[50] shadow-hard right-0 top-0 gap-10'>
        <Link to='/none'><RiArrowRightCircleLine className='text-5xl mx-auto hover:bg-white hover:text-black duration-200 rounded-full'/></Link>
        <ul className='flex flex-col text-md justify-center gap-2'>
          {links.map((link, i)=>
            <div key={i} className={`duration-500 relative select-none group/secondary z-[9] cursor-pointer py-3 pl-0 group-hover:pl-10 w-full rounded-lg group/secondary whitespace-nowrap text-ellipsis ${location.pathname==link.path? 'bg-[#0665DB] text-white': 'hover:bg-[#fbfdff]'}`}>
              <Link className='flex items-center duration-500 text-sm overflow-hidden' to={link.path}>
                <div className={`px-3 text-2xl duration-500 ${location.pathname !== link.path&& 'group-hover/secondary:text-black'} `}>
                  {link.icon}
                </div>
                <div className={`group-hover:max-w-70 max-w-0 duration-500 ${location.pathname !== link.path&& 'group-hover/secondary:text-black'}  overflow-hidden`}>
                  <p className='duration-500'>{link.name}</p>
                </div>
              </Link>
            </div>
          )}
        </ul>
      </div>
  )
}

export default Sidebar