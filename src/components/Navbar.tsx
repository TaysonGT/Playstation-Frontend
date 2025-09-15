import UserIcon from '../assets/user.png'
import './Navbar.css'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IoBarChart, IoGameController, IoHome, IoReceipt, IoSettings } from 'react-icons/io5'
import { MdStorage } from 'react-icons/md'


const Navbar = () => {
  let location = useLocation()

  const links = [
    {name: 'الرئيسية', path: "/", icon: <IoHome/>},
    {name: 'الأجهزة', path: "/devices", icon: <IoGameController/>},
    {name: 'الفواتير', path: "/orders", icon: <IoReceipt/>},
    {name: 'المخزن', path: '/stock', icon: <MdStorage/>},
    {name: 'الحسابات', path: "/revenue", icon: <IoBarChart/>},
    {name: 'الاعدادات', path: "/settings", icon: <IoSettings/>},
  ]

  const {currentUser, logoutUser} = useAuth()

  return ( 
    <div className='w-full bg-[#1b1b1f] shadow-large py-6 xl:px-32 px-8 flex justify-between items-center select-none z-[99] text-sm'>
      {currentUser&& <>
        <div className='flex gap-2 items-center cursor-pointer'>
          <img src={UserIcon} className='sm:h-[40px] h-[30px] mr-auto' alt="" />
          <p className='sm:font-medium text-white'>{currentUser?.username}</p>
        </div>
        
        <ul className='text-white lg:gap-12 sm:gap-6 hidden justify-between sm:flex lg:absolute lg:left-[50%] lg:translate-x-[-50%]'>
           {links.map((link, i)=>
            <li key={i} className={'cursor-pointer nav-link hover:text-[#06ced4] after:bg-[#06ced4] duration-150 ' + ("/" +location.pathname.split('/')[1] === link.path && "active text-[#06ced4]")}>
              <Link to={link.path} className='flex flex-col items-center' >
                <div className='text-3xl'>{link.icon}</div>
                <p className=' font-semibold duration-150 mt-1'>{link.name}</p>
              </Link>
            </li>
           )}
        </ul>
        <button  onClick={logoutUser} className='bg-red-600 rounded-sm hover:bg-red-400 duration-150 text-white px-3 py-2 font-bold text-md'>تسجيل الخروج</button>
        </>
        }
    </div>
  )
}

export default Navbar