import Device from './Device'
import { useDevices } from '../../context/DeviceContext'
import Loader from '../../components/Loader'

const Home = () => {
  const {devices, availableDevices, unavailableDevices, isLoading} = useDevices()
  return (
    <div dir="rtl" className='h-full w-full select-none bg-[#f5f5f5] flex flex-col'>
        {isLoading && 
          <Loader size={50} thickness={10}/>
        }
        {!isLoading&&devices.length<1 && <div dir='rtl' className='text-center grow flex flex-col items-center justify-center'>
            <h1 className='text-3xl font-bold text-indigo-700'>لا توجد أجهزة</h1>
            <p className='text-lg font-bold mt-4 text-indigo-900'>برجاء إضافة أجهزة جديدة ...</p>
        </div>}
        {availableDevices.length>0&&
        <div className='w-[85%] mx-auto flex flex-col items-center pt-32'>
            <h1 className='text-3xl font-bold text-[#37474f] inline-block'>الأجهزة المتاحة</h1>
            <div className='flex w-full flex-wrap   gap-6 mt-8'>
                {availableDevices?.map((device, i)=>
                  (
                  <Device key={i} {...{device}}/>)
                  )
                }

            </div>
        </div>
        }
        {unavailableDevices.length>0&&
        <div className={'w-[85%] mx-auto  flex flex-col items-center ' + (availableDevices?.length<1? 'pt-32': 'pt-16')}>
            <h1 className='text-3xl font-bold text-[#37474f] inline-block'>الأجهزة المشغولة</h1>
            <div className='flex w-full flex-wrap gap-6 mt-8'>
                {unavailableDevices?.map((device, i)=><Device  key={i} {... {device}} />)}
            </div>
        </div>
        }
    </div>
  )
}


export default Home
