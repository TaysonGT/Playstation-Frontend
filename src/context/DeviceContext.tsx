import { useState, useEffect, createContext, useContext } from 'react';
import { fetchDevices, createSession, createDevice, updateDevice, deleteDevice, fetchSessions, addOrder, transfer, removeSession, updatePlayType } from '../api/devices';
import toast from 'react-hot-toast';
import { DevicePayload, IDevice, IDeviceType, ISession } from '../pages/home/types';

interface IDeviceContext {
  devices: IDevice[], 
  availableDevices: IDevice[], 
  unavailableDevices: IDevice[], 
  sessions: ISession[], 
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
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAll = async () => {
    setIsLoading(true);
    try {
        const { data:devData } = await fetchDevices();
        const { data:sessData } = await fetchSessions();
        setDevices(devData.devices);
        setDeviceTypes(devData.deviceTypes);
        setSessions(sessData.sessions);
        setAvailableDevices(devData.devices?.filter((device: IDevice)=> device.status === false))
        setUnavailableDevices(devData.devices?.filter((device: IDevice)=> device.status === true))
    } catch(error){
      console.log(error)
    }finally {
      setIsLoading(false);
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
    setIsLoading(true);
    await addOrder(session_id, product_id, quantity)
    .then(({data})=> data.success? toast.success(data.message) : toast.error(data.message))
    setIsLoading(false);
  };

  // const getSessions = async () => {
  //   setIsLoading(true);
  //   await fetchSessions()
  //   .then(({data})=> data.success? toast.success(data.message) : toast.error(data.message))
  // }

  const transferSession = async (session_id: string, destination: string) => {
    setIsLoading(true);
    await transfer(session_id, destination)
    .then(({data})=> data.success? toast.success(data.message) : toast.error(data.message))
    .finally(()=>getAll())
  }

  const changePlayType = async (session_id: string, play_type: string) => {
    setIsLoading(true);
    await updatePlayType(session_id, play_type)
    .then(({data})=> data.success? toast.success(data.message) : toast.error(data.message))
  }

  const startSession = async ({device_id, play_type, time_type, end_time}:{device_id:string, play_type: string, time_type: string, end_time?: Date})=>{
    await createSession({device_id, play_type, time_type, end_time})
    .then(({data})=> data.success? toast.success(data.message) : toast.error(data.message))
    .finally(()=>getAll())
  }

  const endSession = async (session_id:string)=>{
    await removeSession(session_id)
    .then(({data})=> data.success? toast.success(data.message) : toast.error(data.message))
    .finally(()=>getAll())
  }

  useEffect(() => { 
    getAll();
  }, []);

  useEffect(() => { 
    console.log(isLoading);
  }, [isLoading]);

  return (
    <DeviceContext.Provider
      value={{
        devices, 
        availableDevices, 
        unavailableDevices, 
        deviceTypes, 
        sessions,
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