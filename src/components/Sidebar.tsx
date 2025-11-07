import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RiBarChart2Line, RiBillFill, RiQuestionLine,  RiSettings5Line } from "react-icons/ri";
import { useTranslation } from 'react-i18next';
import UserIcon from '../assets/user.png'
import { IoHome } from 'react-icons/io5';
import { getDirection } from '../i18n';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
    const location = useLocation()
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);
    const {logoutUser, currentUser} = useAuth()

    const links = [
      {name: t('navigation.home'), path: "/", icon: <IoHome/>},
      {name: t('receipts.receipts'), path: "/receipts", icon: <RiBillFill/>},
      {
        name: "الأسئلة",
        path: "/questions",
        icon: <RiQuestionLine/>,
      },
      {
        name: t('navigation.dashboard'),
        path: "/dashboard",
        icon: <RiBarChart2Line/>
      },
      {
        name: t('navigation.settings'),
        path: "/settings",
        icon: <RiSettings5Line/>
      },
      // {
      //   name: t('navigation.logout'),
      //   path: "/power",
      //   icon: <RiShutDownLine/>
      // },
    ]
    
  return ( 
      <div dir={currentDirection} className={`flex flex-col p-6 bg-black text-white h-full group absolute z-[50] shadow-hard ${currentDirection==='rtl'?'right-0':'left-0'} top-0`}>
        <div className='flex flex-col gap-4 items-center cursor-pointer p-4'>
          <img src={UserIcon} className='sm:h-[40px] h-[30px]' alt="" />
          <p className='sm:font-medium text-white'>{currentUser?.username}</p>
        </div>
        <ul className='flex flex-col text-md justify-center gap-2 mt-2'>
          {links.map((link, i)=>
            <Link key={i} to={link.path} className={`duration-200 flex items-center text-sm relative select-none ${location.pathname !== link.path&& 'hover:text-black'} z-[9] cursor-pointer py-3 ${currentDirection==='rtl'?'pl-10':'pr-10'} w-full rounded-lg group/secondary whitespace-nowrap text-ellipsis ${location.pathname==link.path? 'bg-[#0665DB] text-white': 'hover:bg-[#fbfdff]'}`}>
              <div className={`px-3 text-2xl`}>
                {link.icon}
              </div>
              <p>{link.name}</p>
            </Link>
          )}
        </ul>
        <div className='space-y-1 text-sm text-white flex flex-col items-center mt-10'>
          <p>{t('navigation.changeLanguage')}</p>
          <div className='flex'>
            <button onClick={()=>{
              localStorage.setItem('i18nextLng', 'ar')
              window.location.reload()
            }} className={'px-2 py-1 rounded-l border border-gray-600 ' + (i18n.language === 'ar' ? 'bg-amber-300 text-black font-bold' : 'hover:bg-gray-700 duration-150')}>العربية</button>
            <button onClick={()=>{
              localStorage.setItem('i18nextLng', 'en')
              window.location.reload()
            }} className={'px-2 py-1 rounded-r border border-gray-600 ' + (i18n.language === 'en' ? 'bg-amber-300 text-black font-bold' : 'hover:bg-gray-700 duration-150')}>English</button>

          </div>
        </div>
        <button onClick={logoutUser} className='duration-150 hover:bg-red-500 bg-red-600 rounded-sm py-3 mt-10'>
          {t('navigation.logout')}
        </button>
      </div>
  )
}

export default Sidebar