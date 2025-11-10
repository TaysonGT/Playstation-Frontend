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
    <div dir={currentDirection} className='h-full w-full bg-gray-300 flex flex-col md:flex-row overflow-y-auto md:overflow-y-visible gap-4 p-6 min-h-0'>
        {isLoading?
        <div className='h-full w-full flex justify-center items-center'>
          <Loader size={50} thickness={10} color='#f3f3f3'/>
        </div>
        :
        devices.length===0 ? 
        <div dir={currentDirection} className='text-center grow flex flex-col items-center justify-center'>
            <h1 className='text-3xl font-bold text-gray-500'>{t('devices.noDevices')}</h1>
            <p className='text-lg font-bold mt-4 text-gray-700'>{t('home.pleaseAddNewDevices')}</p>
        </div>
        :
        <>
        <div className='bg-[#f3f3f3] p-6 rounded-md flex-1 flex flex-col items-center'>
            <h1 className='text-3xl font-bold text-[#37474f] inline-block'>{t('home.availableDevices')}</h1>
            {availableDevices?.length>0?
                <div className='w-full grow overflow-y-auto mt-4 p-4 bg-gray-200 border border-gray-300 rounded-md'>
                    <div className='flex w-full flex-wrap gap-6'>
                        {availableDevices?.map((device, i)=>
                        <DeviceCard key={i} {...{device}}/>
                        )}
                    </div>
                </div>
            :
            <div className='h-full w-full flex justify-center items-center'>
                <p className='text-gray-500'>{t('home.noAvailableDevices')}...</p>
            </div>
            } 
        </div>
        <div className='flex-1 flex flex-col bg-[#f3f3f3] rounded-md p-6'>
            <h1 className='text-3xl font-bold text-center text-[#37474f] inline-block'>{t('home.unavailableDevices')}</h1>
            {unavailableDevices?.length>0?
                <div className='w-full grow overflow-y-auto mt-4 p-4 bg-gray-200 border border-gray-300 rounded-md'>
                    <div className='flex w-full flex-wrap gap-6'>
                    {unavailableDevices?.map((device, i)=><DeviceCard key={i} {... {device}} />)}
                    </div>
                </div>
            :
            <div className='h-full w-full flex justify-center items-center'>
                <p className='text-gray-500'>{t('home.noUnavailableDevices')}...</p>
            </div>
            }
        </div>
        </>
        }
    </div>
  )
}

export default HomePage