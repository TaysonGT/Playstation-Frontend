import React, { useEffect, useState } from 'react'
import DeleteIcon from '../../assets/delete.png'
import EditIcon from '../../assets/edit.png'
import axios from 'axios'
import AddProductPopup from './AddProductPopup'
import toast from 'react-hot-toast'
import DeleteConfirm from './DeleteConfirm';
import EditConfirm from './EditConfirm';
import { MoonLoader } from 'react-spinners'


const Stock = () => {
    const [products, setProducts] = useState()    
    const [showPopup, setShowPopup] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [deleteId, setDeleteId] = useState()
    const [editConfirm, setEditConfirm] = useState(false)
    const [editProduct, setEditProduct] = useState()
    const [message, setMessage] = useState()
    const [success, setSuccess] = useState()
    

    useEffect(()=>{
        axios.get('/products', {withCredentials: true})
            .then(({data})=> {
                setProducts(data.products)
                if(data.message){ 
                    data.success? toast.success(data.message) : toast.error(data.message)
                }
            })
    }, [message, success, showPopup, deleteConfirm, editConfirm])


    const editHandler = (e)=>{
        axios.get(`/products/${e.target.id.slice(4)}`, {withCredentials: true})
        .then(({data})=>{
            setEditProduct(data.product)
            setEditConfirm(true)
            data.message &&toast.error(data.message)
        })
    }

    const deleteHandler = (e)=>{
        setDeleteId(e.target.id)
        setDeleteConfirm(true)
    }

    const tableHead = [
        "اسم المنتج",
        "الكمية",
        "المستهلك",
        "السعر",
    ]

  return (
    <>
    {showPopup&& <>
        <div onClick={()=>setShowPopup(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-100 z-[100]' ></div>
        <AddProductPopup {...{setShowPopup}} />
    </>
    }

    {deleteConfirm&& <>
        <div onClick={()=>setDeleteConfirm(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-100 z-[100]' ></div>
        <DeleteConfirm {...{setMessage, setSuccess, setDeleteConfirm, setDeleteId, deleteId }} />
    </>}

    {editConfirm&& <>
        <div onClick={()=>setEditConfirm(false)} className='fixed left-0 top-0 w-screen h-screen bg-layout backdrop-blur-sm animate-alert duration-100 z-[100]' ></div>
        <EditConfirm {...{setMessage, setSuccess, setEditConfirm, setEditProduct, editProduct}} />
    </>}


    <div className='pt-32 pb-10 px-10 lg:px-36 bg-[#0d47a1] min-h-screen' dir='rtl'>
    
        <div className='w-full flex justify-between items-start '>
            <h1 className='text-white text-3xl font-bold'>المخزن</h1>
            <button onClick={()=> setShowPopup(true)} className='mt-4 px-4 p-2 shadow-sm shadow-black rounded text-md text-white bg-blue-700 hover:bg-blue-500 duration-100 flex gap-3 items-center'>
                إضافة منتج <span className='text-xl font-bold'>+</span> 
            </button>
        </div>
        {!products? <div className=' flex justify-center items-center'><MoonLoader color='white' /></div>
        :
        <table className='w-full text-black mt-6 select-none text-right tracking-wide shadow-2xl rounded-lg overflow-hidden'>
            <thead className='bg-gray-50 border-b-2 border-gray-200'>
                <tr>
                {tableHead?.map((key, i)=> 
                <th key={i} className='p-3 text-sm font-semibold text-right  '>{key}</th>
                )}
                </tr>
            </thead>
            <tbody>
                {products?.map((product, i)=> 
                <tr key={i} className={ 'relative ' + (i%2 !== 0 ? 'bg-gray-50': 'bg-white')}>
                    <td className='pr-7 font-bold text-blue-500 p-4'>{product.name}</td>
                    <td>
                        <span className={'p-1.5 text-xs font-bold uppercase tracking-wider bg-opcaity-50 rounded-lg ' + (product.stock>20? "text-green-800 bg-green-200" : "text-red-800 bg-red-200")}>{product.stock}</span>
                    </td>
                    <td>{product.consumed}</td>
                    <td>{product.price}ج</td>
                    <div  className='absolute top-[50%] translate-y-[-50%] left-[2%] flex gap-4 items-center'>
                        <button onClick={editHandler}>
                            <img id={'btn-' + product.id} src={EditIcon} className='h-[30px] z-20 bg-indigo-950 hover:bg-indigo-400 duration-100 rounded p-1' alt="" />
                        </button>
                        <button onClick={deleteHandler}>
                            <img id={'btn-' + product.id} src={DeleteIcon} className='h-[30px] z-20 bg-red-300 hover:bg-red-700 duration-100 rounded p-1' alt="" />
                        </button>
                    </div>
                </tr>
                )}
            </tbody>
        </table>
        }
    </div>
    </>
  )
}

export default Stock;