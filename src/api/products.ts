import axios from 'axios'
import { ProductPayload } from '../types'

export const fetchProducts = ()=> axios.get('/products', {withCredentials: true})
export const createProduct = (form: ProductPayload)=> axios.post('/products', form, {withCredentials:true})
export const updateProduct = (id:string, form: ProductPayload)=> axios.put(`/products/${id}`, form, {withCredentials:true})
export const deleteProduct = (id:string)=> axios.delete(`/products/${id}`, {withCredentials:true})