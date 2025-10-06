import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader'

const TestPage = () => {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [newCollectionForm, setNewCollectionForm] = useState({amount: 0, description: ''})
  const [isLoading, setIsLoading] = useState(true)
  function isPositive(number:number) {
    return number > 0;
  }
  
  const fetchBalance = async()=>{
    setIsLoading(true)
    axios.get('/cash/balance')
    .then(({data})=>{
      setBalance(data.total)
    }).finally(()=>setIsLoading(false))
  }

  const fetchTransactions = async()=>{
    setIsLoading(true)
    axios.get(`/cash/transactions`)
    .then(({data})=>{
      if(!data.success) return
      setTransactions(data.transactions)
    }).finally(()=>setIsLoading(false))
  }

  const newCollectionHandler = async(e:React.FormEvent)=>{
    e.preventDefault()
    setIsLoading(true)
    if(!newCollectionForm.amount) return setIsLoading(false);
    axios.post('/cash/collection', newCollectionForm)
    .then(({data})=>{
      if(data.success){
        setNewCollectionForm({amount: 0, description: ''})
        fetchBalance()
        fetchTransactions()
      }
    }).finally(()=> setIsLoading(false))
  }

  useEffect(()=>{
    fetchBalance()
    fetchTransactions()
  }, [])

  return (
    isLoading? 
    <div className='h-full w-full flex items-center justify-center'>
      <Loader size={40} thickness={10}/>
    </div>:
    <div className='h-full w-full p-10 overflow-y-auto'>
      <div className='text-center mb-10'>
        <p className='text-4xl font-bold'>Current Balance</p>
        <p className='text-3xl font-semibold text-amber-500'>{balance} EGP</p>
      </div>
      {/* <div className='flex w-200 gap-10 mx-auto items-start'>
        <form className='w-100 flex flex-col mx-auto flex-1' onSubmit={newAccountHandler}>
          <p className='text-3xl text-center font-semibold mb-6'>Create New Account</p>
          <label className='mb-1'>Name</label>
          <input type="text" className='border rounded-sm border-gray-400 p-2 mb-2' onChange={(e)=>setNewAccountForm(a=>({...a, name: e.target.value}))} placeholder='Account Name' />
          <label className='mb-1'>Type</label>
          <select className='border rounded-sm border-gray-400 p-2 mb-4' onChange={(e)=>setNewAccountForm(a=>({...a, type: e.target.value}))} id="">
            <option>Select a Type</option>
            <option value="cash">Cash</option>
            <option value="digital">Digital</option>
          </select>
          <button type='submit' className='p-2 bg-amber-500 text-white rounded-sm '>Create</button>
        </form>
        <div className='flex-1'>
          <p className='text-3xl text-center font-semibold mb-6'>Accounts</p>
          {accounts.length == 0 && <p className='text-center text-gray-600'>No Accounts Found</p>}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {accounts.map((account: any)=>(
              <div key={account.id} className='border p-4 rounded-md flex flex-col'>
                <p className='font-semibold text-lg'>{account.name}</p>
                <p className='text-sm text-gray-600 mb-2'>{account.type}</p>
                <p className='text-2xl font-bold'>{account.balance} EGP</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}
      <div className='mt-10 flex gap-10 w-200 mx-auto'>
        <form className='w-100 flex flex-col mx-auto flex-1' onSubmit={newCollectionHandler}>
          <p className='text-3xl text-center font-semibold mb-6'>New Collection</p>
          <label className='mb-1'>Amount</label>
          <input type="number" className='border rounded-sm border-gray-400 p-2 mb-2' onChange={(e)=>setNewCollectionForm(a=>({...a, amount: parseFloat(e.target.value)}))} placeholder='Amount' />
          {/* <label className='mb-1'>From Account</label>
          <select className='border rounded-sm border-gray-400 p-2 mb-4' onChange={(e)=>setCNewCollectionForm(a=>({...a, from_account_id: e.target.value}))} id="">
            <option>Select an Account</option>
            {accounts.map((account:any)=>(
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select> */}
          <label className='mb-1'>Description</label>
          <input type="text" className='border rounded-sm border-gray-400 p-2 mb-4' onChange={(e)=>setNewCollectionForm(a=>({...a, description: e.target.value}))} placeholder='Description' />
          <button type='submit' className='p-2 bg-amber-500 text-white rounded-sm '>Collect</button>
        </form>
        <div className='flex-1'>
          <p className='text-3xl text-center font-semibold mb-6'>Transactions</p>
          {/* <select onChange={(e)=>setTransactionsAccount(e.target.value)} className='border rounded-sm border-gray-400 p-2 mb-4 w-full' id="">
            <option>All Accounts</option>
            {accounts.map((account:any)=>(
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select> */}
          <div className='h-96 overflow-y-auto'>
            {transactions.length == 0 && <p className='text-center text-gray-600'>No Transactions Found</p>}
            <div className='grid grid-cols-1 gap-4'>
              {transactions.map((finance: any)=>(
                <div key={finance.id} className='border p-4 rounded-md flex flex-col'>
                  <div className='w-full flex justify-between'>
                    <p className='font-semibold text-lg'>{finance.type}</p>
                    <p className='font-slim text-base text-gray-700'>{new Date(finance.timestamp).toLocaleString()}</p>
                  </div>
                  <p className='text-sm text-gray-600 mb-2'>{finance.description}</p>
                  <p className={`text-2xl font-bold ${isPositive(finance.amount)? 'text-green-500' :'text-red-600'}`}>{Math.abs(finance.amount)} EGP</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage