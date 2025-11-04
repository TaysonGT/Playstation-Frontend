import { useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../../api/products';
import { IProduct, ProductPayload } from '../../../types';


export function useProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAll = async () => {
    setProducts([]);
    setIsLoading(true);
    await fetchProducts()
    .then(({data})=>{
      setProducts(data.products);
    }).finally(()=>setIsLoading(false))
  };

  const create = async (payload: ProductPayload) => {
    setIsLoading(true);
    const {data} = await createProduct(payload)
    await getAll();
    return {data}
  };

  const update = async (id: string, payload: ProductPayload) => {
    setIsLoading(true);
    const {data} = await updateProduct(id, payload)
    await getAll();
    return {data}
  };

  const remove = async (id: string) => {
    setIsLoading(true);
    const {data} = await deleteProduct(id)  
    await getAll();
    return {data}
  };

  useEffect(() => { getAll(); }, []);

  return { products, isLoading, create, update, remove, refetch: getAll };
}
