import axios from 'axios';
import { useEffect, useState } from 'react';
import OuterReceipt from './receipt/OuterReceipt'
import { IReceipt } from '../../../types';
import OrderPopup from './popup/OrderPopup';
import Loader from '../../../components/Loader';
import DarkBackground from '../../../components/DarkBackground';
import { useTranslation } from 'react-i18next';
import { getDirection } from '../../../i18n';
import { useConfigs } from '../../../context/ConfigsContext';

const OuterReceipts = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [currentReceipt, setCurrentReceipt] = useState<IReceipt>()
  const [receipts, setReceipts] = useState<IReceipt[]>([]) 
  const [isLoading, setIsLoading] = useState(true)
  const {configs} = useConfigs()
  const {t, i18n} = useTranslation()
  const currentDirection = getDirection(i18n.language);

  const refetch = async()=>{
    setIsLoading(true)
    await axios.get('/receipts/outer', {withCredentials:true})
    .then(({data}) => {
      setReceipts(data.receipts)    
    })
    .catch(err=> (err))
    .finally(
      ()=>
      setIsLoading(false)
    )
  }

  useEffect(()=>{
    refetch()
  },[])

  return ( <>
    {currentReceipt&& 
      <>
          <OuterReceipt {... {receipt: currentReceipt, hide: ()=>setCurrentReceipt(undefined)}} />
          <DarkBackground setShow={()=>setCurrentReceipt(undefined)}/>
      </>
    }
    {showPopup&&
      <>
        <OrderPopup {...{ hide: ()=>setShowPopup(false), refetch}}  />
        <DarkBackground setShow={setShowPopup}/>
      </>
    }
    <div dir={currentDirection} className="container mx-auto h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-8 text-white">{t('receipts.outerReceipts')}</h1>
      <button className='px-4 py-2 self-start hover:bg-green-500 duration-150 bg-green-600 text-white rounded-lg shadow-md' onClick={()=>setShowPopup(true)}>{t('receipts.addOrder')}</button>
      {isLoading? <div className='grow flex justify-center'><Loader size={40} thickness={10} color='white' /></div>
      :
      receipts.length>0?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
      {receipts?.map((receipt, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
            <h2 className="text-xl font-semibold mb-2">{t('tables.cashier')}: {receipt.cashier?.username}</h2>
            <p className="text-gray-600">{t('tables.date')}: {new Date(receipt.created_at).toLocaleDateString()}</p>
            <p className="text-gray-600">{t('tables.time')}: {new Date(receipt.created_at).toLocaleTimeString()}</p>
            <p className="text-gray-800 mt-2 flex gap-1">{t('tables.total')}:  {receipt.total}<span>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></p>
            <div className="mt-4 flex justify-between items-center">
              <button onClick={()=>setCurrentReceipt(receipt)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ">{t('devices.details')}</button>
            </div>
          </div>
        ))}
      </div>
      : <div className='text-center grow pt-10'>
            <h1 className='text-xl text-gray-200'>{t('receipts.noOuterReceipts')}</h1>
        </div>
      }
    </div>
    </>
  );
};

export default OuterReceipts;
