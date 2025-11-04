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

const Stock = () => {
    const [showCreate, setShowCreate] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [selectedProd, setSelectedProd] = useState<IProduct|null>(null)
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);
    const {configs} = useConfigs()
    
    const {products, isLoading, refetch} = useProducts()

    useEffect(()=>{
        refetch()
    }, [])

    const tableHead = [
        t('stock.productName'),
        t('tables.quantity'),
        t('tables.price'),
        t('tables.actions')
    ]

  return (
    <>
    {showCreate&& <>
        <DarkBackground setShow={setShowCreate}/>
        <CreateProductDialogue {...{
            cancel:()=> setShowCreate(false),
            onAction: ()=>{
                refetch()
                setShowCreate(false)
            }}
        }/>
    </>
    }

    {(showDelete&&selectedProd)&& <>
        <DarkBackground setShow={setShowDelete}/>
        <DeleteProductDialogue {...{
            product: selectedProd, 
            cancel: ()=> setShowDelete(false),
            onAction: ()=>{
                refetch()
                setShowDelete(false)
            }
        }} />
    </>}

    {(showEdit&&selectedProd)&& <>
        <DarkBackground setShow={setShowEdit}/>
        <EditProductDialogue {...{
            product: selectedProd, 
            cancel: ()=>setShowEdit(false),
            onAction: ()=>{
                refetch()
                setShowEdit(false)
            }}
        }/>
    </>}

    <div className='py-6 px-10 lg:px-36 bg-[#0d47a1] h-full' dir={currentDirection}>
    
        <div className='w-full flex justify-between items-start '>
            <h1 className='text-white text-3xl font-bold'>{t('stock.inventory')}</h1>
            <button onClick={()=> setShowCreate(true)} className='mt-4 px-4 p-2 shadow-sm cursor-pointer rounded text-md text-white bg-blue-700 hover:bg-blue-500 duration-100 flex gap-3 items-center'>
                {t('stock.addProduct')} <span className='text-xl font-bold'>+</span> 
            </button>
        </div>
        {isLoading? 
            <div className='fixed w-screen h-screen flex justify-center items-center bg-[#fff/20]'>
                {/* <Loader size={50} thickness={20} /> */}
            </div>
        :
        <div className='w-full text-black mt-6 text-right tracking-wide shadow-2xl rounded-lg overflow-hidden'>
            <ul className='bg-gray-50 border-b-2 border-gray-200'>
                <li className='flex w-full items-stretch'>
                {tableHead?.map((key, i)=> 
                    <div key={i} className='flex-1 p-4 text-sm font-semibold text-center'>{key}</div>
                )}
                </li>
            </ul>
            <ul>
                {products?.map((product, i)=> 
                <li key={i} className={ 'relative flex w-full items-stretch  ' + (i%2 !== 0 ? 'bg-gray-50': 'bg-white')}>
                    <div className='flex-1 font-bold py-4 flex text-center justify-center items-center'>{product.name}</div>
                    <div className='flex flex-1 items-center justify-center'>
                        <span className={'p-1.5 text-xs font-bold uppercase tracking-wider bg-opcaity-50 rounded-lg ' + (product.stock>20? "text-green-800 bg-green-200" : "text-red-800 bg-red-200")}>{product.stock}</span>
                    </div>
                    <div className='flex flex-1 text-center justify-center items-center gap-1'><p>{product.price.toLocaleString('en-US')}</p> <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></div>
                    <div  className='flex flex-1 gap-4 items-center justify-center'>
                        <button 
                            onClick={()=>setShowEdit(true)}
                            onMouseOver={()=>setSelectedProd(product)}
                            className='text-white bg-indigo-600 text-2xl hover:bg-indigo-400 duration-100 rounded shadow-hard p-1'>
                            <BiEdit/>
                        </button>
                        <button 
                            onClick={()=>setShowDelete(true)}
                            onMouseOver={()=>setSelectedProd(product)}
                            className='text-white bg-red-600 text-2xl hover:bg-red-400 duration-100 rounded shadow-hard p-1'>
                            <BiTrash/>
                        </button>   
                    </div>
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