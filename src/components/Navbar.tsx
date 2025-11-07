import UserIcon from '../assets/user.png'
import './Navbar.css'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IoBarChart, IoGameController, IoHome, IoSettings } from 'react-icons/io5'
import { IoReceipt } from 'react-icons/io5'
import { MdStorage } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../i18n'

const Navbar = () => {
  let location = useLocation()
  const {t, i18n} = useTranslation()
  const currentDirection = getDirection(i18n.language);
  const {currentUser, logoutUser} = useAuth()

  const links = [
    {name: t('navigation.home'), path: "/", icon: <IoHome/>},
    {name: t('navigation.devices'), path: "/devices", icon: <IoGameController/>},
    {name: t('navigation.receipts'), path: "/receipts", icon: <IoReceipt/>},
    ...currentUser?.role==='admin'? [
      {name: t('navigation.stock'), path: '/stock', icon: <MdStorage/>},
      {name: t('navigation.dashboard'), path: "/dashboard", icon: <IoBarChart/>},
      {name: t('navigation.settings'), path: "/settings", icon: <IoSettings/>}
    ]:[],
  ]


  return ( 
    <div dir={currentDirection} className='w-full bg-[#1b1b1f] shadow-large py-6 xl:px-32 px-8 flex justify-between items-center select-none z-[99] text-sm'>
      {currentUser&& <>
        <div dir='ltr' className='flex gap-2 items-center cursor-pointer'>
          <img src={UserIcon} className='sm:h-[40px] h-[30px] mr-auto' alt="" />
          <p className='sm:font-medium text-white'>{currentUser?.username}</p>
        </div>
        
        <ul className='text-white lg:gap-12 sm:gap-6 hidden justify-between sm:flex lg:absolute lg:left-[50%] lg:translate-x-[-50%]'>
           {links.map((link, i)=>
            <li key={i} className={'cursor-pointer nav-link hover:text-amber-300 after:bg-amber-300 duration-300 ' + ("/" +location.pathname.split('/')[1] === link.path && "active text-amber-300")}>
              <Link to={link.path} className='flex flex-col items-center' >
                <div className='text-3xl'>{link.icon}</div>
                <p className=' font-semibold duration-150 mt-1'>{link.name}</p>
              </Link>
            </li>
           )}
        </ul>
        <div className='flex gap-20 items-center'>
          <div className='space-y-1 text-center text-white '>
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
          <button  onClick={logoutUser} className='bg-red-600 cursor-pointer hover:bg-red-500 duration-150 text-white px-4 py-2 font-bold text-sm'>{t('navigation.logout')}</button>
        </div>
        </>
        }
    </div>
  )
}

export default Navbar