import { useTranslation } from 'react-i18next';
import { useWakeUpBanner } from '../hooks/useWakupBanner';
import { getDirection } from '../i18n';

const WakeUpBanner = () => {
  const isWaking = useWakeUpBanner(); 
  const {t, i18n} = useTranslation()
  const currentDirection = getDirection(i18n.language);

  return (
    <div dir={currentDirection} className={`fixed top-6 lg:top-10 left-1/2 -translate-x-1/2 transition-opacity z-200 select-none cursor-wait duration-300 ${isWaking ? 'opacity-100 hover:opacity-80' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex items-center gap-3 bg-amber-50 text-amber-700 border rounded-lg shadow-sm shadow-black/35 px-4 py-3">
        <div className="w-7 h-7 border-4 border-gray-200 border-t-amber-800 rounded-full animate-spin" />
        <div className='grow text-nowrap space-y-1'>
          <p className="text-sm font-medium leading-loose">{t('loading.wakingUpServer')}</p>
          <p className="text-xs text-[#989898]">{t('loading.firstLoadInfo')}</p>
        </div>
      </div>
    </div>
  );
}

export default WakeUpBanner
