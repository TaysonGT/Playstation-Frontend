import React, { PropsWithChildren, } from 'react'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../../../i18n'
import { useConfigs } from '../../../context/ConfigsContext'
import { EmployeesRevenueType, ProductsRevenueType } from '../graphs'

interface Props{
    showList: 'employees' | 'products' | null,
    cancel: ()=>void,
    productsRevenue?: ProductsRevenueType,
    employeesRevenue?: EmployeesRevenueType
}

const ListDialogue:React.FC<PropsWithChildren<Props>> = ({productsRevenue, employeesRevenue, showList, cancel}) => {
    const {t, i18n} = useTranslation()
    const currentDirection = getDirection(i18n.language);
    const {configs} = useConfigs()
    
  return (
    <div className={`duration-200 z-50 ${showList? 'opacity-100 pointer-events-auto':'opacity-0 pointer-events-none'}`}>
        <div onClick={cancel} className={`h-screen w-screen bg-black/30 fixed top-0 left-0`} />
        <div className='fixed left-1/2 top-1/2 -translate-1/2 bg-white rounded-md shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto'>
            <div className='flex justify-between items-center p-4 border-b border-gray-200'>
            <h1 className='text-2xl font-bold'>{showList=== 'employees'? t('dashboard.employeesRevenue') : t('dashboard.productsRevenue')}</h1>
            <button onClick={cancel} className='text-gray-500 hover:text-gray-800 text-2xl font-bold'>&times;</button>
            </div>
            <div className='p-4 max-h-[70vh] overflow-y-auto'>
                {showList==='employees' && employeesRevenue &&
                <table className='w-full border border-gray-200 text-center'>
                    <thead className='bg-slate-50 text-sm'>
                        <tr className='border-b border-gray-200 font-normal'> 
                            <th className='p-2 border-x border-gray-200 text-center'>{t('tables.no')}</th>
                            <th className='p-2 text-center'>{t('tables.employee')}</th>
                            <th className='p-2 text-center'>{t('dashboard.revenue')}</th>
                            <th className='p-2 text-center'>{t('dashboard.percent')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeesRevenue.usersRevenue.map((employee, i)=>(
                        <tr key={i} className='not-last:border-b border-gray-100 hover:bg-gray-50'>
                            <td className='p-2 border-x border-gray-200 text-center'>{i+1}</td>
                            <td className='p-2'>{employee.cashier}</td>
                            <td className='p-2'>{employee.revenue.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></td>
                            <td className='p-2'>{employee.percent}%</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                }
                {showList==='products' && productsRevenue &&
                    <table className='w-full text-center border border-gray-200'>
                        <thead className='bg-slate-50 text-sm'>
                            <tr className='border-b border-gray-200'>
                                <th className='p-2 border-x border-gray-200 text-center'>{t('tables.no')}</th>
                                <th className='p-2 text-center'>{t('stock.product')}</th>
                                <th className='p-2 text-center'>{t('dashboard.sales')}</th>
                                <th className='p-2 text-center'>{t('dashboard.percent')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsRevenue.productsList.map((product, i)=>(
                            <tr key={i} className='not-last:border-b border-gray-200 hover:bg-gray-50'>
                                <td className='p-2 border-x border-gray-200 text-center'>{i+1}</td>
                                <td className='p-2'>{product.product}</td>
                                <td className='p-2'>{product.sales.toLocaleString('en-US')} <span className='font-noto'>{currentDirection === 'rtl'? configs.currency.symbolNative: configs.currency.symbol}</span></td>
                                <td className='p-2'>{product.percent}%</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    </div>
  )
}

export default ListDialogue