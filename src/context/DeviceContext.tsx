import { useState, useEffect, createContext, useContext } from 'react';
import { fetchDevices, createSession, createDevice, updateDevice, deleteDevice, addOrder, transfer, removeSession, updatePlayType } from '../api/devices';
import toast from 'react-hot-toast';
import { DevicePayload, IDevice, IDeviceType } from '../types';

interface IDeviceContext {
  devices: IDevice[], 
  availableDevices: IDevice[], 
  unavailableDevices: IDevice[], 
  // sessions: ISession[], 
  deviceTypes: IDeviceType[], 
  create: (payload: DevicePayload) => Promise<void>, 
  update: (id:string, payload: DevicePayload)=> Promise<void>,
  remove: (id:string)=> Promise<void>, 
  changePlayType: (session_id: string, play_type: string)=> Promise<void>,
  transferSession: (session_id: string, destination: string)=> Promise<void>,
  newOrder: (session_id: string, product_id: string, quantity: number)=> Promise<void>,
  startSession: ({device_id, play_type, time_type, end_time}:{device_id:string, play_type: string, time_type: string, end_time?: Date})=> Promise<void>,
  endSession: (session_id:string)=> Promise<void>,
  refetch: ()=> Promise<void>,
  isLoading: boolean
}

const DeviceContext = createContext<IDeviceContext|undefined>(undefined)

export const DevicesProvider:React.FC<React.PropsWithChildren<{}>> = ({children})=>{
  const [devices, setDevices] = useState<IDevice[]>([]);
  const [availableDevices, setAvailableDevices] = useState<IDevice[]>([]);
  const [unavailableDevices, setUnavailableDevices] = useState<IDevice[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<IDeviceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAll = async () => {
    setIsLoading(true)
    await getDevices()
    await getDeviceTypes()
    setIsLoading(false)
  };
  
  const getDeviceTypes = async () => {
    setDeviceTypes([]);
    try {
        const { data } = await fetchDevices();
        setDeviceTypes(data.deviceTypes);
    } catch(error){
      console.log(error)
    }
  };

  const getDevices = async () => {
    setDevices([]);
    setAvailableDevices([]);
    setUnavailableDevices([]);
    try {
      const { data:devData } = await fetchDevices();
      setDevices(devData.devices);
      setAvailableDevices(devData.availableDevices);
      setUnavailableDevices(devData.unavailableDevices);
    } catch(error){
      console.log(error)
    }
  };

  const create = async (payload: DevicePayload) => {
    setIsLoading(true);
    await createDevice(payload)
    .then(({data})=> data.success? toast.success(data.message) : toast.error(data.message))
    .finally(()=>getAll())
  };

  const update = async (id: string, payload: DevicePayload) => {
    setIsLoading(true);
    await updateDevice(id, payload)
    .then(({data})=> data.success? toast.success(data.message) : toast.error(data.message))
    .finally(()=>getAll())
  };

  const remove = async (id: string) => {
    setIsLoading(true);
    await deleteDevice(id)
    .then(({data})=> data.success? toast.success(data.message) : toast.error(data.message))
    .finally(()=>getAll())
  };
  
  const newOrder = async (session_id: string, product_id: string, quantity: number) => {
    await addOrder(session_id, product_id, quantity)
    .then(({data})=> data.success? toast.success(data.message) : toast.error(data.message))
  };

  const transferSession = async (session_id: string, destination: string) => {
    setIsLoading(true);
    await transfer(session_id, destination)
    .then(({data})=> {
      if(!data.success) return toast.error(data.message)
      toast.success(data.message)
      getAll()
    })
  }

  const changePlayType = async (session_id: string, play_type: string) => {
    setIsLoading(true);
    await updatePlayType(session_id, play_type)
    .then(({data})=> {
      if(!data.success) return toast.error(data.message);
      toast.success(data.message)
      getAll()
    })
  }

  const startSession = async ({device_id, play_type, time_type, end_time}:{device_id:string, play_type: string, time_type: string, end_time?: Date})=>{
    setIsLoading(true);
    await createSession({device_id, play_type, time_type, end_time})
    .then(({data})=> {
      if(!data.success) return toast.error(data.message)
      toast.success(data.message)
      getAll()
    })
  }

  const endSession = async (session_id:string)=>{
    setIsLoading(true);
    await removeSession(session_id)
    .then(({data})=> {
      if(!data.success) return toast.error(data.message)
      toast.success(data.message)
      getAll()
    })
  }

  useEffect(() => { 
    getAll();
  }, []);

  return (
    <DeviceContext.Provider
      value={{
        devices, 
        availableDevices, 
        unavailableDevices, 
        deviceTypes,
        startSession, 
        endSession,
        create, 
        update,
        remove,
        changePlayType,
        transferSession,
        newOrder,
        refetch: getAll,
        isLoading 
      }}
    >
      {children}
    </DeviceContext.Provider>
  );

}


export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevices must be used within a DevicesProvider');
  }
  return context;
};