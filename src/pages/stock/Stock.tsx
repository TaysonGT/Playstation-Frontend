import { useEffect, useState } from 'react'
import DeleteIcon from '../../assets/delete.png'
import EditIcon from '../../assets/edit.png'
import DeleteProductDialogue from './DeleteProductDialogue';
import CreateProductDialogue from './CreateProductDialogue'
import EditProductDialogue from './EditProductDialogue'
import { IProduct, ProductPayload } from '../../types'
import { useProducts } from './hooks/useProducts'
import DarkBackground from '../../components/DarkBackground';

const Stock = () => {
    const [showCreate, setShowCreate] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [selectedProd, setSelectedProd] = useState<IProduct|null>(null)
    
    const {products, isLoading, refetch, remove, create, update} = useProducts()

    useEffect(()=>{
        refetch()
    }, [])

    const tableHead = [
        "اسم المنتج",
        "الكمية",
        "المستهلك",
        "السعر",
        "الأوامر"
    ]

  return (
    <>
    {showCreate&& <>
        <DarkBackground {...{show: showCreate, cancel: ()=> setShowCreate(false)}}/>
        <CreateProductDialogue {...{onCancel:()=> setShowCreate(false), onCreate: async(payload: ProductPayload)=>{
            await create(payload)
            setShowCreate(false)
        }}} />
    </>
    }

    {(showDelete&&selectedProd)&& <>
        <DarkBackground {...{show: showDelete, cancel: ()=> setShowDelete(false)}}/>
        <DeleteProductDialogue {...{product: selectedProd, onCancel: ()=> setShowDelete(false), onDelete: async(id: string)=>{
            await remove(id)
            setShowDelete(false)
        } }} />
    </>}

    {(showEdit&&selectedProd)&& <>
        <DarkBackground {...{show: showEdit, cancel: ()=> setShowEdit(false)}}/>
        <EditProductDialogue {...{product: selectedProd, 
            onEdit: async(id: string, payload: ProductPayload)=>{
                await update(id, payload)
                setShowEdit(false)
            },
            onCancel: ()=>setShowEdit(false)}}
        />
    </>}

    <div className='py-6 px-10 lg:px-36 bg-[#0d47a1] h-full' dir='rtl'>
    
        <div className='w-full flex justify-between items-start '>
            <h1 className='text-white text-3xl font-bold'>المخزن</h1>
            <button onClick={()=> setShowCreate(true)} className='mt-4 px-4 p-2 shadow-sm cursor-pointer rounded text-md text-white bg-blue-700 hover:bg-blue-500 duration-100 flex gap-3 items-center'>
                إضافة منتج <span className='text-xl font-bold'>+</span> 
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
                    <div key={i} className='flex-1/5 p-4 text-sm font-semibold text-right'>{key}</div>
                )}
                </li>
            </ul>
            <ul>
                {products?.map((product, i)=> 
                <li key={i} className={ 'relative flex w-full items-stretch  ' + (i%2 !== 0 ? 'bg-gray-50': 'bg-white')}>
                    <div className='flex-1/5 font-bold text-blue-500 p-4 flex items-center'>{product.name}</div>
                    <div className='flex flex-1/5 items-center'>
                        <span className={'p-1.5 text-xs font-bold uppercase tracking-wider bg-opcaity-50 rounded-lg ' + (product.stock>20? "text-green-800 bg-green-200" : "text-red-800 bg-red-200")}>{product.stock}</span>
                    </div>
                    <div className='flex flex-1/5 items-center'>{product.consumed}</div>
                    <div className='flex flex-1/5 items-center'>{product.price}ج</div>
                    <div  className='flex flex-1/5 gap-4 items-center'>
                        <button 
                            onClick={()=>setShowEdit(true)}
                            onMouseOver={()=>setSelectedProd(product)}>
                            <img src={EditIcon} className='h-[30px] z-20 bg-indigo-950 hover:bg-indigo-400 duration-100 rounded p-1' alt="" />
                        </button>
                        <button 
                            onClick={()=>setShowDelete(true)}
                            onMouseOver={()=>setSelectedProd(product)}>
                            <img src={DeleteIcon} className='h-[30px] z-20 bg-red-300 hover:bg-red-700 duration-100 rounded p-1' alt="" />
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