import { useEffect, useState } from 'react'
import AddDevicePopup from './AddDevicePopup'
import DeleteConfirm from './DeleteConfirm'
import { fetchDevices } from '../../api/devices'
import { IDevice, IDeviceType } from '../../types'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'
import { RiDeleteBin6Fill, RiEdit2Fill } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../i18n'


const Devices = () => {
    const [deviceTypes, setDeviceTypes] = useState<IDeviceType[]>([])
    const [devices, setDevices] = useState<IDevice[]>([])
    const [showPopup, setShowPopup] = useState(false)
    const [deleteDevice, setDeleteDevice] = useState<IDevice|null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);

    const refetchDevices = async ()=>{ 
        setIsLoading(true)
        fetchDevices()
        .then(({data})=> {
            setDevices(data.devices)
            setDeviceTypes(data.deviceTypes)
        }).finally(()=>setIsLoading(false))
    }

    useEffect(()=>{
        refetchDevices()
    }, [])

    const tableHead = [
        t('tables.name'),
        t('tables.type'),
        t('tables.status'),
        t('tables.actions')
    ]
  
  return (
    <>
    {(showPopup&&deviceTypes)&& <>
        <div onClick={()=>{setShowPopup(false)}} className='fixed left-0 top-0 w-screen h-screen bg-black/70 animate-appear duration-500 z-[50]'/>
        <AddDevicePopup {...{onAction: async()=>{
            await refetchDevices()
            setShowPopup(false)
        }, deviceTypes}} />
        </>
    }
    {deleteConfirm&&deleteDevice&&<>
        <div onClick={()=>{setDeleteConfirm(false); setDeleteDevice(null)}} className='fixed left-0 top-0 w-screen h-screen bg-black/70 animate-appear duration-500 z-[50]'/>
            <DeleteConfirm {...{device: deleteDevice, hide: ()=> setDeleteConfirm(false), onAction: ()=>{
                setDeleteDevice(null)
                setDeleteConfirm(false)
                refetchDevices()
            }}} />
        </>
    }
    <div className='py-6 lg:px-36 px-10 bg-[#0d47a1] h-full w-full flex flex-col' dir={currentDirection}>
        <div className='w-full flex justify-between items-center'>
            <h1 className='text-white text-3xl font-bold'>{t('devices.devices')}</h1>
            <button onClick={()=>{ 
                deviceTypes?.length>0? setShowPopup(true)
                : toast.error('برجاء إضافة نوع جهاز أولًا');
            }} className='mt-4 px-4 p-2 shadow-hard rounded text-md text-white bg-blue-700 hover:bg-blue-500 duration-100 flex gap-3 items-center'>
                {t('devices.addDevice')} <span className='text-xl font-bold'>+</span> 
            </button>
        </div>
        {isLoading? 
            <div className='mt-16 flex justify-center items-center'>
                <Loader size={50} color='white' thickness={10}/>
            </div>
        :devices?.length<1? 
            <div dir={currentDirection} className='flex flex-col items-center mt-20'>
                <h1 className='text-xl font-bold text-white'>{t('devices.noDevices')}</h1>
                <p className='text-sm font-bold mt-4 text-gray-300'>{t('devices.pleaseAddNewDevice')}</p>
            </div>
            :
        <div className='w-full flex flex-col grow min-h-0 text-black mt-6 text-center rounded-md overflow-hidden'>
            <div className='bg-gray-50 border-b-2 border-gray-200 flex'>
                {tableHead.map((key, i)=> 
                    <div key={i} className='p-3 text-sm font-semibold text-center flex-1'>{key}</div>
                )}
            </div>
            <div className='relative grow min-h-0 overflow-y-auto'>
                {devices?.map((device, i)=> 
                <div key={i} className={`relative items-stretch flex ${i%2 !== 0 ? 'bg-gray-50': 'bg-white'}`}>
                    <div className='p-3 font-bold text-blue-500 flex-1'>{device.name}</div>
                    <div className='flex-1 p-3 flex items-center justify-center'>
                        {device.type.name}
                    </div>
                    <div className='flex-1 p-3 flex items-center justify-center'>
                        <span className={'p-1.5 text-xs font-bold uppercase tracking-wider bg-opcaity-50 rounded-lg ' + (!device.status? "text-green-800 bg-green-200" : "text-red-800 bg-red-200")}>{!device.status? t('devices.available') : t('devices.inUse')}</span>
                    </div>
                    <div className='flex-1 flex gap-4 items-center p-3 justify-center'>
                        <div className='bg-indigo-100 cursor-pointer hover:text-indigo-400 duration-100 rounded-md p-1 text-2xl'>
                            <RiEdit2Fill/>
                        </div>
                        <div className='rounded-md cursor-pointer bg-red-100 text-red-600 hover:text-red-400 duration-100 p-1 text-2xl' onClick={()=>{
                            setDeleteDevice(device)
                            setDeleteConfirm(true)
                        }}>
                            <RiDeleteBin6Fill />
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
        }
    </div>
    </>
  )
}

export default Devices