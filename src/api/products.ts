import axios from 'axios'
import { ProductPayload } from '../types'

export const fetchProducts = ({page, limit}:{page: number, limit: number})=> axios.get('/products', {params: {page, limit},withCredentials: true})
export const createProduct = (form: ProductPayload)=> axios.post('/products', form, {withCredentials:true})
export const updateProduct = (id:string, form: ProductPayload)=> axios.put(`/products/${id}`, form, {withCredentials:true})
export const deleteProduct = (id:string)=> axios.delete(`/products/${id}`, {withCredentials:true})
