import axios from 'axios'
import { useState, useEffect } from 'react'
import SessionReceiptsTable from './tables/SessionReceiptsTable'
import Loader from '../../../components/Loader'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../../i18n'

const SessionReceipts = () => {
    const [receipts, setReceipts] = useState([])
    const [products, setProducts] = useState([]) 
    const [isLoading, setIsLoading] = useState(false) 
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);

    const refetch = async()=>{
      setIsLoading(true)
      await axios.get('/products', {withCredentials: true})
      .then(({data})=> {
        setProducts(data.products)
      })
      await axios.get('/receipts/session', {withCredentials:true})
      .then(({data})=> {
        setReceipts(data.receipts)
      }).finally(()=> setIsLoading(false))
    }
    useEffect(()=>{
      refetch()
    }, [])

  return (<>
    <div className='h-full flex flex-col' dir={currentDirection}>
        <h1 className="text-3xl font-bold mb-8 text-white">{t('receipts.sessionReceipts')}</h1>
        {isLoading? 
          <div className='mt-16 flex justify-center items-center'><Loader size={40} thickness={10} color='white' /></div>
        :receipts.length>0?
        <div className='grow min-h-0'>
          <SessionReceiptsTable {... {receipts, products}} />
        </div>
        : <div className='text-center grow pt-10'>
            <h1 className='text-xl text-gray-200'>{t('receipts.noSessionReceipts')}</h1>
        </div>
        }
    </div>
      </>
    )
}

export default SessionReceipts