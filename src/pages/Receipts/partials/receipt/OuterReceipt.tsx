import React, { useRef } from 'react'
import { IReceipt } from '../../../../types'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../../../i18n'
import { useConfigs } from '../../../../context/ConfigsContext'

interface Props {
    receipt: IReceipt,
    hide: ()=>void
}

const OuterReceipt:React.FC<Props> = ({receipt, hide}) => {
    const invoiceRef = useRef<HTMLDivElement>(null)
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);
    const {configs} = useConfigs()
    
    // const handler = useReactToPrint({
    //     content: ()=> invoiceRef.current,
    //     documentTitle: "Invoice",
    //     onAfterPrint: ()=> toast.success("طباعة ناجحة")
    // })
    
  return (
    <div dir={currentDirection} className='fixed z-[100] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#eee] p-4 rounded-lg'>
        <div className='mb-2 w-full flex justify-between flex-row-reverse'>
            <span onClick={()=>hide()} className='text-red-400 duration-150 font-bold text-3xl cursor-pointer hover:text-red-500'>X</span>
            <button onClick={()=>console.log('print')} className="shadow-large rounded bg-indigo-600 px-6 pb-2 pt-2.5 text-md font-medium  text-white duration-150 ease-in-out hover:bg-indigo-400 hover:text-white">
                {t('receipts.printReceipt')}
            </button>
        </div>
        <div className='max-h-[60vh] overflow-y-scroll'>
        <div ref={invoiceRef} className="w-[300px] mx-auto p-4 border rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div>
                <h1 className="text-base font-bold">{configs?.name}</h1>
                <p>{configs?.phone}</p>
                </div>
                <div>
                <p className="text-sm">{t('tables.date')}: {new Date(receipt?.created_at).toLocaleDateString()}</p>
                <p className="text-sm">{t('tables.time')}: {new Date(receipt?.created_at).toLocaleTimeString()}</p>
                </div>
            </div>
            <div className="flex gap-6 mb-4">
                <div>
                <h1 className="text-sm font-bold">{t('tables.cashier')}</h1>
                <p>{receipt?.cashier?.username}</p>
                </div>
            </div>
            {receipt.orders&&receipt.orders.length>0&&
                <div className="mb-4">
                    <h2 className="text-sm font-bold mb-2">{t('receipts.orders')}</h2>
                    <div className="flex w-full mb-2 text-xs font-bold">
                        <span className='flex-1 text-start'>{t('stock.product')}</span>
                        <span className='flex-1 text-center px-2'>{t('tables.quantity')}</span>
                        <span className='flex-1 text-end'>{t('receipts.cost')}</span>
                    </div>
                    {receipt.orders.map((order, index) => (
                    <div key={index} className="flex w-full mb-2">
                        <span className='flex-1 text-start'>{order.product?.name}</span>
                        <span className='flex-1 text-center px-2'>{order.quantity}</span>
                        <span className='flex-1 text-end'>{order.cost}<span>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></span>
                    </div>
                    ))}
                </div>
            }
            {receipt.description&&
            <div className="mb-4">
                <h2 className="text-sm font-bold">{t('receipts.notes')}</h2>
                <p>{receipt.description}</p>
            </div>
            }
            <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                <span className="font-bold">{t('tables.total')}:</span>
                <span className='font-[Noto] flex items-center gap-1 font-bold'>{Math.abs(receipt?.total||0)}<span>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></span>
            </div>
        </div>
        </div>
    </div>
  )
}

export default OuterReceipt



