import React from 'react'
import DeleteIcon from '../assets/delete.png'
import EditIcon from '../assets/edit.png'
import ps5Icon from '../assets/ps5-black.png'
import ps4Icon from '../assets/ps4-black.png'


const ChooseOrder = () => {
  const orders = [
    {name: "PS1", type: "PS5", status: true, startedAt: null },
    {name: "PS2", type: "PS5", status: true, startedAt: null },
    {name: "PS3", type: "PS5", status: true, startedAt: null },
    {name: "PS4", type: "PS5", status: false, startedAt: Date.now() + 60000 },
    {name: "PS5", type: "PS4", status: true, startedAt: null },
    {name: "PS6", type: "PS5", status: true, startedAt: null },
    {name: "PS7", type: "PS5", status: false, startedAt: Date.now() + 150000 },
]

const tableHead = [
    "اسم الجهاز",
    "نوع الجهاز",
    "الحالة",
    "الألعاب",
]
  
  return (
    <>   
        <button className='mt-4 px-4 p-2 shadow-sm shadow-black rounded text-md text-white bg-blue-700 hover:bg-blue-500 duration-100 flex gap-3 items-center mr-12'>
                طلب جديد    <span className='text-xl font-bold'>+</span> 
            </button>
        <table className='w-full text-black mt-6 select-none'>
            <thead className='bg-gray-50 border-b-2 border-gray-200'>
                <tr>
                {tableHead.map((key, i)=> 
                <th key={i} className='p-3 text-sm font-semibold text-right  '>{key}</th>
                )}
                </tr>
            </thead>
            <tbody>
                {orders.map((order, i)=> 
                <tr key={i} className={ 'relative ' + (i%2 != 0 ? 'bg-gray-50': 'bg-white')}>
                    <td className='pr-7 font-bold text-blue-500 p-4'>{order.name}</td>
                    <td>
                        <img className='w-[65px]' src={order.type == "PS5" ? ps4Icon : ps5Icon} />
                    </td>
                    <td>
                        <span className={'p-1.5 text-xs font-bold uppercase tracking-wider bg-opcaity-50 rounded-lg ' + (order.status? "text-green-800 bg-green-200" : "text-red-800 bg-red-200")}>{order.status? "متاح" : "مشغول"}</span>
                    </td>
                    <td>{order.startedAt}</td>
                    <div  className='absolute top-[50%] translate-y-[-50%] left-[2%] flex gap-4 items-center'>
                        <button>
                            <img src={EditIcon} className='h-[30px] z-20 bg-indigo-950 hover:bg-indigo-400 duration-100 rounded p-1' alt="" />
                        </button>
                        <button>
                            <img src={DeleteIcon} className='h-[30px] z-20 bg-red-300 hover:bg-red-700 duration-100 rounded p-1' alt="" />
                        </button>
                    </div>
                </tr>
                )}
            </tbody>
        </table>
    </>
  )
}

export default ChooseOrder