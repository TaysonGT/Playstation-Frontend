import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Home from '../assets/home.png' 
import UserIcon from '../assets/user.png'
import RevenueIcon from '../assets/revenue.png'
import StockIcon from '../assets/stock.png'
import DevicesIcon from '../assets/devices-icon.png'
import OrdersIcon from '../assets/orders.png'
import ConfigIcon from '../assets/config.png'
import './Navbar.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'


const Navbar = ({token}) => {

  let location = useLocation()
  let username = Cookies.get('username')

  const [currentLocation, setCurrentLocation] =  useState(location)

  const links = [
    {link: 'الرئيسية', path: "/", image: Home},
    {link: 'الأجهزة', path: "/devices", image: DevicesIcon},
    {link: 'الفواتير', path: "/orders", image: OrdersIcon},
    {link: 'المخزن', path: '/stock', image: StockIcon},
    {link: 'الحسابات', path: "/revenue", image: RevenueIcon},
    {link: 'الاعدادات', path: "/settings", image: ConfigIcon},
  ]

  const nav = useNavigate()

  const logoutHandler = (e)=>{
    e.preventDefault()
    Cookies.remove('access_token')
    nav('/auth/login')
  }

  useEffect(()=>{
      setCurrentLocation(location)
      !Cookies.get('access_token') && nav('/auth/login')
  },[location.pathname])


  return ( 
    <div className=' w-full fixed bg-[#1b1b1f] shadow-large py-6 xl:px-32 px-8 flex justify-between items-center select-none z-[99] text-sm'>
      {token&& <>
        <div className='flex gap-2 items-center cursor-pointer'>
          <img src={UserIcon} className='sm:h-[40px] h-[30px] mr-auto' alt="" />
          <p className='sm:font-medium text-white'>{username}</p>
        </div>
        
        <ul className=' lg:gap-12 sm:gap-6 hidden justify-between sm:flex lg:absolute lg:left-[50%] lg:translate-x-[-50%]'>
           {links.map(({link, path, image}, i)=>
            <li key={i} className={'text-white flex flex-col items-center cursor-pointer nav-link ' + ("/" +currentLocation.pathname.split('/')[1] == path && "active")}>
              <Link to={path} className='flex flex-col items-center' >
              <img src={image} className=' h-[30px]' alt="" /> 
              <p className=' font-semibold duration-150 mt-1'>{link}</p>
              </Link>
            </li>
           )}
        </ul>
        <button  onClick={logoutHandler} className='bg-red-600 rounded-sm hover:bg-red-400 duration-150 text-white px-3 py-2 font-bold text-md'>تسجيل الخروج</button>
        </>
        }
    </div>
  )
}

export default Navbar