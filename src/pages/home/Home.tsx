import DeviceCard from './DeviceCard'
import { useDevices } from '../../context/DeviceContext'
import Loader from '../../components/Loader'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../i18n'

const HomePage = () => {
  const {devices, availableDevices, unavailableDevices, isLoading} = useDevices()
  const {t, i18n} = useTranslation()
  const currentDirection = getDirection(i18n.language);

  return (
    <div dir={currentDirection} className='h-full w-full bg-[#f5f5f5] flex flex-col gap-15 p-10 px-20 min-h-0 overflow-y-auto'>
        {isLoading && 
        <div className='h-full w-full flex justify-center items-center'>
          <Loader size={50} thickness={10}/>
        </div>
        }
        {!isLoading&&devices&&devices.length<1 && <div dir={currentDirection} className='text-center grow flex flex-col items-center justify-center'>
            <h1 className='text-3xl font-bold text-indigo-700'>{t('devices.noDevices')}</h1>
            <p className='text-lg font-bold mt-4 text-indigo-900'>{t('home.pleaseAddNewDevices')}</p>
        </div>}
        {availableDevices?.length>0&&
        <div className='flex flex-col items-center'>
            <h1 className='text-3xl font-bold text-[#37474f] inline-block'>{t('home.availableDevices')}</h1>
            <div className='flex w-full flex-wrap gap-6 mt-8'>
                {availableDevices?.map((device, i)=>
                  (
                  <DeviceCard key={i} {...{device}}/>)
                  )
                }

            </div>
        </div>
        }
        {unavailableDevices?.length>0&&
        <div className={' flex flex-col items-center'}>
            <h1 className='text-3xl font-bold text-[#37474f] inline-block'>{t('home.unavailableDevices')}</h1>
            <div className='flex w-full flex-wrap gap-6 mt-8'>
                {unavailableDevices?.map((device, i)=><DeviceCard key={i} {... {device}} />)}
            </div>
        </div>
        }
    </div>
  )
}

export default HomePage