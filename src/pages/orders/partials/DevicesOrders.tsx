import axios from 'axios'
import { useState, useEffect } from 'react'
import DeviceReceiptTable from './tables/DeviceReceiptTable'
import Loader from '../../../components/Loader'

const DevicesOrders = () => {
    const [receipts, setReceipts] = useState([])
    const [products, setProducts] = useState([]) 
    const [isLoading, setIsLoading] = useState(false) 

    const refetch = async()=>{
      setIsLoading(true)
      await axios.get('/products', {withCredentials: true})
      .then(({data})=> {
        setProducts(data.products)
      })
      await axios.get('/receipts/session', {withCredentials:true})
      .then(({data})=> {
        setReceipts(data.timeReceipts)
      }).finally(()=> setIsLoading(false))
    }
    useEffect(()=>{
      refetch()
    }, [])

  return (<>
    <div className='h-full'>
        <h1 className="text-3xl font-bold mb-4 text-white">فواتير الأجهزة</h1>
        {isLoading? <div className='mt-16 flex justify-center items-center'><Loader size={40} thickness={10} color='white' /></div>
        :receipts.length>0?
        <DeviceReceiptTable {... {receipts, products}} />
        : <div dir='rtl' className='text-center grow pt-10'>
            <h1 className='text-xl text-gray-200'>لا توجد فواتير...</h1>
        </div>
        }
    </div>
      </>
    )
}

export default DevicesOrders