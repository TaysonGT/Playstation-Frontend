import { useEffect, useState } from 'react'
import DeleteIcon from '../../assets/delete.png'
import EditIcon from '../../assets/edit.png'
import axios from 'axios'
import AddDevicePopup from './AddDevicePopup'
import DeleteConfirm from './DeleteConfirm'
import { fetchDevices } from '../../api/devices'
import { IDevice, IDeviceType } from '../home/types'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'


const Devices = () => {
    const [deviceTypes, setDeviceTypes] = useState<IDeviceType[]>([])
    const [devices, setDevices] = useState<IDevice[]>([])
    const [showPopup, setShowPopup] = useState(false)
    const [deleteId, setDeleteId] = useState<string|null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [deleteConfirm, setDeleteConfirm] = useState(false)

    const refetchDevices = ()=>{ 
        setIsLoading(true)
        fetchDevices()
        .then(({data})=> {
            setDevices(data.devices)
        }).finally(()=>setIsLoading(false))
    }

    useEffect(()=>{
        axios.get('/device-types', {withCredentials: true})
        .then(({data})=> setDeviceTypes(data.deviceTypes))
        .finally(()=>refetchDevices())
    }, [])

    const tableHead = [
        "اسم الجهاز",
        "نوع الجهاز",
        "الحالة",
    ]

    useEffect(()=>{
        deleteId? setDeleteConfirm(true) : setDeleteConfirm(false)
    }, [deleteId])
  
  return (
    <>
        {(showPopup&&deviceTypes)&& <>
            <div onClick={(e)=>{console.log(e.target); setShowPopup(false)}} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-150 z-[99]'></div>
            <AddDevicePopup {...{onAction: ()=>{
                fetchDevices()
            }, deviceTypes}} />
        </>
        }
        {deleteConfirm&&<>
            <div onClick={()=>setDeleteConfirm(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-150 z-[100]' ></div>
            <DeleteConfirm {...{deleteId, hide: ()=> setDeleteConfirm(false), onAction: ()=>{
                setDeleteId(null)
                setDeleteConfirm(false)
                refetchDevices()
            }}} />
        </>}
    <div className='pt-32 lg:px-36 px-10 bg-[#0d47a1] min-h-screen flex flex-col' dir='rtl'>
        <div className='w-full flex justify-between items-start'>
            <h1 className='text-white text-3xl font-bold'>الأجهزة</h1>
            <button onClick={()=>{ 
                deviceTypes?.length>0? setShowPopup(true)
                : toast.error('برجاء إضافة نوع جهاز أولًا');
            }} className='mt-4 px-4 p-2 shadow-sm shadow-black rounded text-md text-white bg-blue-700 hover:bg-blue-500 duration-100 flex gap-3 items-center'>
                إضافة جهاز <span className='text-xl font-bold'>+</span> 
            </button>
        </div>
        {isLoading? 
            <div className='mt-16 flex justify-center items-center'>
                <Loader size={50} color='white' thickness={10}/>
            </div>
        :devices?.length<1? 
            <div dir='rtl' className='text-center mt-10'>
                <h1 className='text-xl font-bold text-white'>لا توجد أجهزة</h1>
                <p className='text-sm font-bold mt-4 text-gray-300'>برجاء إضافة أجهزة جديدة ...</p>
            </div>
            :
        <table className='w-full text-black mt-6 select-none'>
            <thead className='bg-gray-50 border-b-2 border-gray-200'>
                <tr>
                {tableHead.map((key, i)=> 
                <th key={i} className='p-3 text-sm font-semibold text-right  '>{key}</th>
                )}
                </tr>
            </thead>
            <tbody className='relative'>
                {devices?.map((device, i)=> 
                <tr key={i} className={ 'relative ' + (i%2 !== 0 ? 'bg-gray-50': 'bg-white')}>
                    <td className='pr-7 font-bold text-blue-500 p-4'>{device.name}</td>
                    <td>
                        <p className=''>{deviceTypes?.filter((type)=> type.id === device.type)[0]?.name}</p>
                    </td>
                    <td>
                        <span className={'p-1.5 text-xs font-bold uppercase tracking-wider bg-opcaity-50 rounded-lg ' + (!device.status? "text-green-800 bg-green-200" : "text-red-800 bg-red-200")}>{!device.status? "متاح" : "مشغول"}</span>
                    </td>
                    <div  className='absolute top-[50%] translate-y-[-50%] left-[2%] flex gap-4 items-center'>
                        <button>
                            <img src={EditIcon} className='h-[30px] z-20 bg-indigo-950 hover:bg-indigo-400 duration-100 rounded p-1' alt="" />
                        </button>
                        <button id={"btn_" +device.id} onClick={(e)=>{
                            setDeleteId(e.currentTarget.id.slice(4))
                        }}>
                            <img id={"img_" +device.id} src={DeleteIcon} className='h-[30px] z-20 bg-red-300 hover:bg-red-700 duration-100 rounded p-1' alt="" />
                        </button>
                    </div>
                </tr>
                )}
            </tbody>
        </table>
        }
    </div>
    </>
  )
}

export default Devices