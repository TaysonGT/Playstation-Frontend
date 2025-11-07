import { useTranslation } from 'react-i18next'
import { getDirection } from '../../i18n';
import ReceiptsTable from '../Dashboard/ReceiptsTable';
import DarkBackground from '../../components/DarkBackground';
import { useState } from 'react';
import OrderModal from './partials/popup/OrderPopup';

const ReceiptsPage = () => {
    const {t,i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);
    const [showPopup, setShowPopup] = useState(false)
    const [refresh, setRefresh] = useState(false)

    return (
        <div dir={currentDirection} className='w-full h-full flex flex-col p-8 bg-[#f3f3f3]'>
            {showPopup&&
                <>
                    <OrderModal {...{ hide: ()=>setShowPopup(false), refetch: ()=>setRefresh(prev=>!prev)}}  />
                    <DarkBackground setShow={setShowPopup}/>
                </>
            }
            <h1 className="text-3xl text-black font-bold">{t('receipts.receipts')}</h1>
            <button className='px-4 py-2 mt-4 self-start hover:bg-green-500 duration-150 bg-green-600 text-white rounded-sm shadow-md' onClick={()=>setShowPopup(true)}>{t('receipts.addOrder')}</button>
            <div className='bg-white mt-2 p-3 rounded-md grow overflow-hidden shadow-2xl'>
                <ReceiptsTable {...{refresh}}/>
            </div>
        </div>
    )
}

export default ReceiptsPage