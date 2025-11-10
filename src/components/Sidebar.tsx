import { Link, useLocation } from 'react-router-dom'
import { RiBox2Fill, RiDashboardFill, RiReceiptFill, RiSettingsFill } from "react-icons/ri";
import { useTranslation } from 'react-i18next';
import UserIcon from '../assets/user.png'
import { IoGameController, IoHome } from 'react-icons/io5';
import { getDirection } from '../i18n';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({show, setShow}:{show:boolean, setShow?: (b:boolean)=>void}) => {
    const location = useLocation()
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);
    const {logoutUser, currentUser} = useAuth()

    const links = [
      {name: t('navigation.home'), path: "/", icon: <IoHome/>},
      {name: t('receipts.receipts'), path: "/receipts", icon: <RiReceiptFill/>},
      {name: t('navigation.devices'), path: "/devices", icon: <IoGameController/>},
      {name: t('navigation.stock'), path: '/stock', icon: <RiBox2Fill/>},
      ...currentUser?.role==='admin'?
        [
          {name: t('navigation.dashboard'), path: "/dashboard", icon: <RiDashboardFill/>},
          {name: t('navigation.settings'), path: "/settings", icon: <RiSettingsFill/>}
        ]:[],
    ]
    
  return ( 
      <div dir={currentDirection} className={`flex flex-col overflow-y-auto p-6 bg-black text-white h-full group fixed lg:relative w-55 z-[103] shadow-hard duration-200 ${currentDirection==='rtl'?`lg:right-0 ${show?'right-0':'-right-55'}`:`lg:left-0 ${show?'left-0':'-left-55'}`} top-0`}>
        <div className='flex flex-col gap-4 items-center cursor-pointer p-4'>
          <img src={UserIcon} className='sm:h-[40px] h-[30px]' alt="" />
          <p className='sm:font-medium text-white'>{currentUser?.username}</p>
        </div>
        <ul className='flex flex-col text-md justify-center gap-2 mt-2'>
          {links.map((link, i)=>
            <Link onClick={()=>setShow&&setShow(false)} key={i} to={link.path} className={`duration-200 flex items-center text-xs md:text-sm relative select-none ${location.pathname !== link.path&& 'hover:text-black'} z-[9] cursor-pointer py-3 ${currentDirection==='rtl'?'pl-10':'pr-10'} w-full rounded-lg group/secondary whitespace-nowrap text-ellipsis ${location.pathname==link.path? 'bg-[#0665DB] text-white': 'hover:bg-[#fbfdff]'}`}>
              <div className={`px-3 text-2xl`}>
                {link.icon}
              </div>
              <p>{link.name}</p>
            </Link>
          )}
        </ul>
        <div className='space-y-1 text-xs md:text-sm text-white flex flex-col items-center mt-10'>
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
        <button onClick={logoutUser} className='duration-150 hover:bg-red-500 bg-red-600 rounded-sm py-2 mt-10 text-xs md:text-sm'>
          {t('navigation.logout')}
        </button>
      </div>
  )
}

export default Sidebar