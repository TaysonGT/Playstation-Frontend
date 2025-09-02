import { useEffect, useState } from 'react'
import axios from 'axios'
import OuterReceipts from './tables/OuterReceipts';
import { IOuterReceipt } from '../../home/types';

const OuterOrders = () => {
    const [receipts, setReceips] = useState<IOuterReceipt[]>([]) 

    useEffect(()=>{
      axios.get('/receipts/outer', {withCredentials:true})
          .then(({data}) => {
              setReceips(data.receipts?.reverse())    
          })
      .catch(err=> (err))
    },[])


  return (
        <div className='min-h-screen bg-[#0d47a1] pt-32 lg:px-36 px-10'>
          <OuterReceipts {... {receipts}} />
        </div>
  )
}

export default OuterOrders