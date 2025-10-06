import { useEffect, useState } from 'react'
import axios from 'axios'
import SessionReceipt from '../receipt/SessionReceipt';
import { IReceipt, IProduct } from '../../../../types';
import DarkBackground from '../../../../components/DarkBackground';
import { useTranslation } from 'react-i18next';
// import { getDirection } from '../../../../i18n';

interface Props {
  receipts: IReceipt[], 
  products: IProduct[]
}

const SessionReceiptsTable:React.FC<Props> = ({receipts, products}) => {
    const [selectedReceipt, setSelectedReceipt] = useState<IReceipt|null>(null)
    const [showInvoice, setShowInvoice] = useState(false)
    const [configs, setConfigs] = useState<{name:string, phone:string}>({name: '', phone: ''})
    const {t} = useTranslation()

    useEffect(()=>{
        axios.get('/config', {withCredentials: true})
          .then(({data})=> setConfigs({name: data.nameConfig?.value, phone: data.phoneConfig?.value}))
    }, [])

  return (
    <div className="shadow-lg rounded-lg overflow-hidden h-full flex flex-col">
        {(showInvoice&&selectedReceipt)&& 
            <>
                <SessionReceipt {... {receipt: selectedReceipt, hide: ()=>setShowInvoice(false), configs, products}} />
                <DarkBackground setShow={setShowInvoice}/>
            </>
        }
        <ul className='w-full bg-white'>
            <li className="flex bg-gray-100 items-center">
                <div className="py-4   text-gray-600 font-bold uppercase flex-1 items-center text-center ">{t('devices.deviceName')}</div>
                <div className=" py-4   text-gray-600 font-bold uppercase flex-1 items-center text-center ">{t('tables.endTime')}</div>
                <div className=" py-4   text-gray-600 font-bold uppercase flex-1 items-center text-center ">{t('tables.total')}</div>
                <div className=" py-4   text-gray-600 font-bold uppercase flex-1 items-center text-center ">{t('tables.actions')}</div>
            </li>
        </ul>
        <ul className='w-full h-full bg-white overflow-y-auto grow min-h-0'>
        {receipts?.map((receipt, i)=>
            <li key={i} className='flex items-stretch w-full'>
                <div className="py-4 border-b border-gray-200 text-lg flex-1 flex items-center justify-center bg-white font-bold">{receipt.device?.name||'--'}</div>
                <div className="py-4  border-b border-gray-200 flex-1 flex items-center justify-center flex-col bg-white">
                  <div>{new Date(receipt.created_at).toLocaleDateString()}</div>
                  <div>{new Date(receipt.created_at).toLocaleTimeString()}</div>
                </div>
                <div className="py-4  border-b border-gray-200 flex-1 flex items-center justify-center">{receipt.total}ج</div>
                <div className="py-4  border-b border-gray-200 flex-1 flex items-center justify-center  text-ellipsis overflow-hidden">
                  <button onClick={()=>{setSelectedReceipt(receipt); setShowInvoice(true)}} className='p-2 bg-green-500 hover:bg-green-400 duration-100 text-white rounded-md'>{t('receipts.showOrders')}</button>
                </div>
            </li>
            )} 
        </ul>
    </div>
  )
}

export default SessionReceiptsTable
