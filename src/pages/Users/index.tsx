import { useTranslation } from "react-i18next";
import { getDirection } from "../../i18n";
import { useEffect, useState } from "react";
import { IUser } from "../../types";
import { RiEdit2Fill } from "react-icons/ri";
import axios from "axios";
import Loader from "../../components/Loader";
import { MdDelete } from "react-icons/md";
import TableNav from "../../components/TableNav";
import CreateUserDialog from "./dialogs/CreateUserDialog";
import DarkBackground from "../../components/DarkBackground";
import EditUserDialog from "./dialogs/EditUserDialog";
import DeleteConfirm from "./dialogs/DeleteConfirm";

const UsersPage = () => {
  const {t, i18n} = useTranslation()
  const currentDirection = getDirection(i18n.language);
  const [selectedRole, setSelectedRole] = useState<'admin'|'employee'|null>('employee')
  const [users, setUsers] = useState<IUser[]>([])
  const [editUser, setEditUser] = useState<IUser>()
  const [showAddUser, setShowAddUser] = useState(false)
  const [deleteUser, setDeleteUser] = useState<IUser>()
  const [isLoading, setIsLoading] = useState(true)
  
  const [pageCount, setPageCount] = useState<number>(1)
  const [maxPages, setMaxPages] = useState<number>(0)
  
  const refetch = async()=>{
      setIsLoading(true)
      await axios.get(`/users`, {params:{page: pageCount, role: selectedRole}, withCredentials:true})
      .then(({data})=> {
          setUsers(data.users)
          setMaxPages(Math.ceil(data.total/data.limit))
      }).finally(()=> setIsLoading(false))
  }

  useEffect(()=>{
      refetch()
  }, [pageCount, selectedRole])

  return (
    <div dir={currentDirection} className='h-full w-full bg-gray-300 flex flex-col overflow-y-auto md:overflow-y-visible gap-4 p-6 min-h-0'>
      {showAddUser&& <>
        <CreateUserDialog {...{
          onSave: ()=>{
            setShowAddUser(false)
            refetch()
          },
          onHide: ()=> setShowAddUser(false)
        }}/>
        <DarkBackground setShow={setShowAddUser} show={showAddUser}/>
      </>
      }
      {(editUser)&& <>
        <EditUserDialog {...{onAction: async()=>{
          setEditUser(undefined)
          // await getAll()
          }, user: editUser}}/>
        <DarkBackground setShow={(v:boolean)=>setEditUser(undefined)} show={!!editUser}/>
      </>
      }
      {deleteUser&& <>
        <DeleteConfirm {...{onAction: async()=>{
          setDeleteUser(undefined)
          // await getAll()
        }, hide: ()=> setDeleteUser(undefined), user:deleteUser}}/>
        <DarkBackground setShow={()=>setDeleteUser(undefined)} show={!!deleteUser}/>
      </>
      }
      <div className='flex md:flex-col md:items-start justify-between items-center'>
          {/* <h1 className="md:text-3xl text-2xl text-black font-bold">{t('users.users')}</h1> */}
          {/* <button className='md:text-base text-sm px-4 py-2 mt-4 self-start hover:bg-green-500 duration-150 bg-green-600 text-white rounded-sm shadow-md' onClick={()=>console.log('test')}>{t('users.addUser')}</button> */}
      </div>
      <div className='bg-[#fdfdfd] rounded-md grow overflow-hidden shadow-2xl p-8'>
        <div className='flex md:flex-col md:items-start justify-between items-center'>
          <h2 className="md:text-3xl text-2xl text-black font-bold">{t('users.users')}</h2>
          <button className='md:text-base text-sm px-4 py-2 mt-4 self-start hover:bg-green-500 duration-150 bg-green-600 text-white rounded-sm shadow-md' onClick={()=>setShowAddUser(true)}>{t('users.addUser')}</button>
        </div>
        <div className='flex mb-2 text-xs md:text-sm mt-4'>
            <button onClick={()=>setSelectedRole(null)} className={`py-2 px-3 text-gray-500 border-gray-200 duration-75 hover:bg-gray-50 ${!selectedRole&& 'text-gray-800 bg-gray-100 shadow-inner'}`}>{t('dashboard.all')}</button>
            <button onClick={()=>setSelectedRole('admin')} className={`py-2 px-3 text-gray-500 border-x border-gray-200 duration-75 hover:bg-gray-50 ${selectedRole==='admin'&& 'text-gray-800 bg-gray-100 shadow-inner'}`}>{t('users.admin')}</button>
            <button onClick={()=>setSelectedRole('employee')} className={`py-2 px-3 text-gray-500 duration-75 hover:bg-gray-50 ${selectedRole==='employee' && 'text-gray-800 bg-gray-100 shadow-inner'}`}>{t('users.employee')}</button>
        </div>
        <div>
        {isLoading?
            <div className='flex justify-center items-center grow py-10'>
                <Loader size={40} thickness={7}/>
            </div>
          :users.length<1?
          <div className='flex items-center justify-center py-8'>
              <p className='text-gray-500 font-semibold'>{t('users.noUsers')}</p>
          </div>
          :
          <div className='overflow-x-auto w-full grow'>
              <table className='w-full border-x border-gray-200'>
                  <thead>
                      <tr className='border-y bg-[#f9f9f9] border-gray-200 text-center font-md:bold text-xs md:text-sm  text-black'>
                          <th className='p-3 pl-4 text-center'>{t('tables.name')}</th>
                          <th className='p-3 text-center'>{t('tables.role')}</th>
                          <th className='p-3 text-center'>{t('tables.createdAt')}</th>
                          <th className='p-3 text-center'>{t('tables.actions')}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {users.map((user, i ) =>
                      <tr key={i} className="bg-white text-center border-b text-xs md:text-sm  text-gray-700 border-gray-200">
                          <td className="p-3">
                              {user.username}
                          </td>
                          <td className="p-3 pl-4">
                            {user.role==="admin" ? t('users.admin') : user.role === "employee" ? t('users.employee') : 'Null'}
                          </td>
                          <td className="p-3 gap-2">
                              <p>{new Date(user.createdAt).toLocaleString()}</p>
                          </td>
                          <td
                              className="md:text-2xl text-lg flex items-center justify-center  flex-[0.5] p-3 ">
                              <RiEdit2Fill
                            className="text-cyan-700 hover:text-cyan-500 cursor-pointer"
                                onClick={()=>{
                                    setEditUser(user)
                                }}/>
                              <MdDelete
                            className="hover:text-red-500 text-red-600 cursor-pointer"
                                onClick={()=>{
                                    setDeleteUser(user)
                                }}/>
                          </td>
                      </tr>
                      )}
                  </tbody>
              </table>
              <TableNav {...{
                onChange: (page)=>setPageCount(page),
                maxPages,
                pageCount
              }}/>
          </div>
        }
        </div>
      </div>
    </div>
  )
}

export default UsersPage
