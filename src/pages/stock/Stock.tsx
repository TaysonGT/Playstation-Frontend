import { useEffect, useState } from 'react'
import DeleteProductDialogue from './DeleteProductDialogue';
import CreateProductDialogue from './CreateProductDialogue'
import EditProductDialogue from './EditProductDialogue'
import { IProduct } from '../../types'
import { useProducts } from './hooks/useProducts'
import DarkBackground from '../../components/DarkBackground';
import { useTranslation } from 'react-i18next';
import { getDirection } from '../../i18n';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { useConfigs } from '../../context/ConfigsContext';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const Stock = () => {
    const [showCreate, setShowCreate] = useState(false)
    const [showDelete, setShowDelete] = useState<IProduct|null>(null)
    const [showEdit, setShowEdit] = useState<IProduct|null>(null)
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);
    const {configs} = useConfigs()
    const {currentUser} = useAuth()
    
    const {products, isLoading, refetch} = useProducts()

    useEffect(()=>{
        refetch()
    }, [])

    const tableHead = [
        t('stock.productName'),
        t('tables.quantity'),
        t('tables.price'),
        ...currentUser?.role==='admin'?[t('tables.actions')]:[]
    ]

  return (
    <>
    <DarkBackground setShow={(b:boolean)=>{setShowCreate(b);setShowDelete(null);setShowEdit(null)}} show={showCreate||!!showDelete||!!showEdit}/>
    <CreateProductDialogue {...{
        show: showCreate,
        cancel:()=> setShowCreate(false),
        onAction: ()=>{
            refetch()
            setShowCreate(false)
        }}
    }/>

    <DeleteProductDialogue {...{
        product: showDelete, 
        cancel: ()=> setShowDelete(null),
        onAction: ()=>{
            refetch()
            setShowDelete(null)
        }
    }} />

    <EditProductDialogue {...{
        product: showEdit, 
        cancel: ()=>setShowEdit(null),
        onAction: ()=>{
            refetch()
            setShowEdit(null)
        }}
    }/>

    <div className='md:p-10 p-6 lg:px-20 bg-[#0d47a1] h-full w-full flex flex-col' dir={currentDirection}>
        <div className='w-full flex md:flex-col justify-between items-center md:items-start'>
            <h1 className='text-white md:text-3xl text-xl font-bold'>{t('stock.inventory')}</h1>
            {currentUser?.role==='admin'&&
                <button onClick={()=> setShowCreate(true)} className='md:mt-4 text-sm px-4 p-2 shadow-hard cursor-pointer rounded text-md text-white bg-blue-700 hover:bg-blue-500 duration-100 flex gap-3 items-center'>
                    {t('stock.addProduct')} <span className='text-xl font-bold'>+</span> 
                </button>
            }
        </div>
        {isLoading? 
            <div className='grow flex justify-center items-center'>
                <Loader size={50} thickness={10} color='white' />
            </div>
        :
        <div className='w-full grow min-h-0 flex flex-col bg-[#f3f3f3] text-black mt-2 md:text-sm text-xs text-right tracking-wide shadow-2xl rounded-lg overflow-hidden'>
            <ul className='bg-gray-50 border-b-2 border-gray-200'>
                <li className='flex w-full items-stretch'>
                {tableHead?.map((key, i)=> 
                    <div key={i} className='flex-1 py-4 px-2 font-semibold text-center'>{key}</div>
                )}
                </li>
            </ul>
            <ul className='grow min-h-0 overflow-y-auto'>
                {products?.map((product, i)=> 
                <li key={i} className={ 'border-b border-gray-200 relative flex w-full items-stretch bg-white'}>
                    <div className='flex-1 font-bold py-2 px-2 flex text-center justify-center items-center'>{product.name}</div>
                    <div className='flex flex-1 items-center justify-center py-2 px-2'>
                        <span className={'p-1.5 md:text-xs text-[10px] font-bold uppercase tracking-wider bg-opcaity-50 rounded-lg ' + (product.stock>20? "text-green-800 bg-green-200" : "text-red-800 bg-red-200")}>{product.stock}</span>
                    </div>
                    <div className='flex flex-1 text-center justify-center items-center gap-1 py-2 px-2'><p>{product.price.toLocaleString('en-US')}</p> <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.code}</span></div>
                    {currentUser?.role==='admin'&&
                    <div  className='flex flex-1 gap-4 items-center justify-center py-3 px-2'>
                        <button 
                            onClick={()=>setShowEdit(product)}
                            className='text-white bg-indigo-600 md:text-2xl text-lg hover:bg-indigo-400 duration-100 rounded shadow-hard p-1'>
                            <BiEdit/>
                        </button>
                        <button 
                            onClick={()=>setShowDelete(product)}
                            className='text-white bg-red-600 md:text-2xl text-lg hover:bg-red-400 duration-100 rounded shadow-hard p-1'>
                            <BiTrash/>
                        </button>   
                    </div>}
                </li>
                )}
            </ul>
        </div>
        }
    </div>
    </>
  )
}

export default Stock;