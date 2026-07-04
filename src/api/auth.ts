import axios from 'axios'

export const login = ({username, password}:{username:string, password:string})=> axios.post('/auth/login', {username, password}, {withCredentials: true})
export const createFirstUser = ({username, password, confirmPassword}:{username:string, password:string, confirmPassword:string})=> axios.post(`/auth/firstuser`, {username, password, confirmPassword}, {withCredentials:true})
export const checkNewUser = ()=> axios.get(`/auth/firstuser`)
export const getCurrentSession = ()=> axios.get(`/auth/session`, {withCredentials:true})
