import axios from 'axios'
import { ProductPayload } from '../pages/stock/types'

export const fetchDevices = ()=> axios.get('/devices', {withCredentials: true})
export const createDevice = (form: ProductPayload)=> axios.post('/devices', form, {withCredentials:true})
export const updateDevice = (id:string, form: ProductPayload)=> axios.put(`/devices/${id}`, form, {withCredentials:true})
export const deleteDevice = (id:string)=> axios.delete(`/devices/${id}`, {withCredentials:true})

export const fetchDeviceTypes = ()=> axios.get('/device-types', {withCredentials: true})

export const fetchSessions = ()=> axios.get('/sessions', {withCredentials: true})
export const createSession = ({device_id, play_type, time_type, end_time}:{device_id: string, play_type: string, time_type: string, end_time?: Date})=> 
    axios.post(`/sessions/${device_id}`, {play_type, time_type, end_time}, {withCredentials: true})
export const transfer = (session_id: string, destination: string)=> axios.put(`/sessions/change-device/${session_id}`, {destination}, {withCredentials: true})
export const updatePlayType = (session_id: string, play_type: string)=> axios.put(`/sessions/change-play-type/${session_id}`, {play_type}, {withCredentials: true})
export const removeSession = (id: string)=> axios.delete(`/sessions/${id}`, {withCredentials: true})

export const fetchOrders = (session_id: string)=> axios.get(`/orders/${session_id}`, {withCredentials: true})
export const addOrder = (session_id: string, product_id: string, quantity: number)=> axios.post(`/orders/${session_id}`, {product_id, quantity}, {withCredentials: true})