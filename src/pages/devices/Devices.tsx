import { useEffect, useState } from 'react'
import AddDevicePopup from './AddDevicePopup'
import DeleteConfirm from './DeleteConfirm'
import { fetchDevices, fetchDeviceTypes } from '../../api/devices'
import { IDevice, IDeviceType } from '../../types'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../i18n'
import { useAuth } from '../../context/AuthContext'
import { BiEdit, BiTrash } from 'react-icons/bi'
import { useConfigs } from '../../context/ConfigsContext'
import DarkBackground from '../../components/DarkBackground'
import CreateDeviceTypePopup from './CreateDeviceTypePopup'


const Devices = () => {
    const [deviceTypes, setDeviceTypes] = useState<IDeviceType[]>([])
    const [devices, setDevices] = useState<IDevice[]>([])
    const [showPopup, setShowPopup] = useState(false)
    const [deleteDevice, setDeleteDevice] = useState<IDevice|null>(null)
    const [deleteType, setDeleteType] = useState<IDeviceType|null>(null)
    const [showCreateType, setShowCreateType] = useState(false)
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);
    const {currentUser} = useAuth()
    const {configs} = useConfigs()
    const [isLoadingDevices, setIsLoadingDevices] = useState(true)
    const [isLoadingTypes, setIsLoadingTypes] = useState(true)

    const refetchDevices = async ()=>{ 
        setIsLoadingDevices(true)
        fetchDevices()
        .then(({data})=> {
            setDevices(data.devices)
        }).finally(()=>setIsLoadingDevices(false))
    }

    const refetchDeviceTypes = async ()=>{ 
        setIsLoadingTypes(true)
        fetchDeviceTypes()
        .then(({data})=> {
            setDeviceTypes(data.deviceTypes)
        }).finally(()=>setIsLoadingTypes(false))
    }

    useEffect(()=>{
        refetchDevices()
        refetchDeviceTypes()
    }, [])

    const devicesTableHead = [
        t('tables.name'),
        t('tables.type'),
        t('tables.status'),
        ...currentUser?.role==='admin'?[t('tables.actions')]:[]
    ]

    const typesTableHead = [
        t('tables.name'),
        t('deviceTypes.hourlyRateSingle'),
        t('deviceTypes.hourlyRateMulti'),
        ...currentUser?.role==='admin'?[t('tables.actions')]:[]
    ]
  
  return (
    <>
    {(showPopup&&deviceTypes)&&
        <AddDevicePopup {...{onAction: async()=>{
            await refetchDevices()
            setShowPopup(false)
        }, deviceTypes}} />
    }
    <DeleteConfirm {...{
        mode: deleteType?'type':'device', 
        device: deleteDevice, 
        deviceType: deleteType, 
        hide: ()=> {
            setDeleteDevice(null)
            setDeleteType(null)
        }, 
        onAction: ()=>{
            deleteType?refetchDeviceTypes():refetchDevices();
            setDeleteDevice(null)
            setDeleteType(null)
        },
        show: !!deleteDevice||!!deleteType
    }} />
    <CreateDeviceTypePopup show={showCreateType} hide={()=>setShowCreateType(false)} onAction={async()=>{
        await refetchDeviceTypes()
        setShowCreateType(false)
    }} />
    <DarkBackground show={showPopup||!!deleteDevice||!!deleteType||showCreateType} setShow={(b: boolean)=>{
        setShowPopup(b);
        setShowCreateType(b)
        setDeleteDevice(null)
        setDeleteType(null)
    }}/>

    <div className='bg-gray-300 h-full w-full flex md:flex-row flex-col md:justify-between gap-6 md:p-10 p-4 overflow-y-auto' dir={currentDirection}>
        <div className='md:flex-1 h-100 md:h-auto md:p-8 p-4 bg-[#f3f3f3] rounded-md flex flex-col'>
            <div className='w-full flex justify-between items-center'>
                <h1 className='md:text-3xl text-xl font-bold'>{t('devices.devices')}</h1>
                {currentUser?.role==='admin'&&
                    <button onClick={()=>{ 
                        deviceTypes?.length>0? setShowPopup(true)
                        : toast.error('برجاء إضافة نوع جهاز أولًا');
                    }} className='px-4 p-2 cursor-poniter shadow-hard rounded text-xs md:text-sm text-white bg-blue-700 hover:bg-blue-500 duration-100 flex gap-3 items-center'>
                        {t('devices.addDevice')} <span className='text-xl font-bold'>+</span> 
                    </button>
                }
            </div>
            {isLoadingDevices?
                <div className='mt-16 flex grow justify-center items-center'>
                    <Loader size={50} color='white' thickness={10}/>
                </div>
            :devices?.length<1? 
                <div dir={currentDirection} className='flex flex-col items-center mt-20'>
                    <h1 className='text-xl font-bold text-white'>{t('devices.noDevices')}</h1>
                    <p className='md:text-sm text-xs font-bold mt-4 text-gray-300'>{t('devices.pleaseAddNewDevice')}</p>
                </div>
                :
                <div className='w-full flex flex-col grow min-h-0 text-black mt-4 text-center rounded-sm overflow-hidden bg-gray-100 shadow-lg'>
                    <div className='bg-gray-700 md:text-sm text-xs text-white border-b-2 border-gray-200 flex'>
                        {devicesTableHead.map((key, i)=> 
                            <div key={i} className='p-3 font-semibold text-center flex-1'>{key}</div>
                        )}
                    </div>
                    <div className='relative md:text-sm text-xs grow min-h-0 overflow-y-auto'>
                        {devices?.map((device, i)=> 
                        <div key={i} className={`relative items-stretch flex ${i%2 !== 0 ? 'bg-gray-50': 'bg-white'} border-b border-gray-200`}>
                            <div className='p-3 font-bold text-blue-500 flex-1 flex items-center justify-center'>{device.name}</div>
                            <div className='flex-1 p-3 flex items-center justify-center'>
                                {device.type.name}
                            </div>
                            <div className='flex-1 p-3 flex items-center justify-center'>
                                <span className={'p-1.5 md:text-[10px] text-xs uppercase bg-opcaity-50 rounded-lg ' + (!device.status? "text-green-800 bg-green-200" : "text-red-800 bg-red-200")}>{!device.status? t('devices.available') : t('devices.inUse')}</span>
                            </div>
                            {currentUser?.role==='admin'&&
                                <div className='flex-1 flex gap-4 items-center p-3 justify-center md:text-2xl text-lg'>
                                    <button 
                                        // onClick={()=>setShowEdit(type.id)}
                                        className='text-white cursor-pointer bg-indigo-600 hover:bg-indigo-400 duration-100 rounded shadow-hard p-1'>
                                        <BiEdit/>
                                    </button>
                                    <button 
                                        onClick={()=>{
                                            setDeleteDevice(device)
                                        }}
                                        className='text-white cursor-pointer bg-red-600 hover:bg-red-400 duration-100 rounded shadow-hard p-1'>
                                        <BiTrash/>
                                    </button>
                                </div>
                            }
                        </div>
                        )}
                    </div>
                </div>
            }
        </div>
        <div className='md:flex-1 flex flex-col h-100 md:h-auto md:p-8 p-4 bg-gray-100 rounded-md text-xs md:text-sm'>
            <div className='w-full flex justify-between items-center'>
                <h1 className='md:text-3xl text-xl font-bold'>{t('deviceTypes.deviceTypes')}</h1>
                {currentUser?.role==='admin'&&
                    <button onClick={()=>{ 
                        setShowCreateType(true)
                    }} className='px-4 p-2 cursor-pointer shadow-hard rounded text-white bg-blue-700 hover:bg-blue-500 duration-100 flex gap-3 items-center'>
                        {t('deviceTypes.addDeviceType')} <span className='text-xl font-bold'>+</span> 
                    </button>
                }
            </div>
            {isLoadingTypes? 
                <div className='mt-16 flex justify-center grow items-center'>
                    <Loader size={50} color='white' thickness={10}/>
                </div>
            :deviceTypes?.length<1? 
                <div dir={currentDirection} className='flex flex-col items-center mt-20'>
                    <h1 className='text-xl font-bold '>{t('devices.noDevices')}</h1>
                    <p className='font-bold mt-4 text-gray-300'>{t('devices.pleaseAddNewDevice')}</p>
                </div>
                :
                <div className='w-full flex flex-col grow min-h-0 text-black mt-4 text-center rounded-sm overflow-hidden bg-[#f3f3f3] shadow-lg'>
                    <div className='bg-gray-700 text-white border-b-2 border-gray-200 flex items-stretch'>
                        {typesTableHead.map((key, i)=> 
                            <div key={i} className='p-3 font-semibold text-center flex-1 flex items-center justify-center'>{key}</div>
                        )}
                    </div>
                    <div className='relative grow min-h-0 overflow-y-auto'>
                        {deviceTypes?.map((type, i)=> 
                        <div key={i} className={`relative items-stretch flex ${i%2 !== 0 ? 'bg-gray-50': 'bg-white'} border-b border-gray-200`}>
                            <div className='p-3 font-bold text-blue-500 flex-1 flex items-center justify-center'>{type.name}</div>
                            <div className='flex-1 flex items-center justify-center gap-1 p-3'>
                                {type.single_price} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.code}</span>
                            </div>
                            <div className='flex-1 flex items-center justify-center gap-1 p-3'>
                                {type.multi_price} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.code}</span>
                            </div>
                            {currentUser?.role==='admin'&&
                                <div className='flex-1 flex gap-4 items-center p-3 justify-center'>
                                    <button 
                                        className='text-white cursor-pointer bg-indigo-600 md:text-2xl text-lg hover:bg-indigo-400 duration-100 rounded shadow-hard p-1'>
                                        <BiEdit/>
                                    </button>
                                    <button 
                                        onClick={()=>{
                                            setDeleteType(type)
                                        }}
                                        className='text-white cursor-pointer bg-red-600 md:text-2xl text-lg hover:bg-red-400 duration-100 rounded shadow-hard p-1'>
                                        <BiTrash/>
                                    </button>   
                                </div>
                            }
                        </div>
                        )}
                    </div>
                </div>
            }
        </div>
    </div>
    </>
  )
}

export default Devices