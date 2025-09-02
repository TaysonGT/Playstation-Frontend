import { useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../../api/products';
import toast from 'react-hot-toast';
import { IProduct, ProductPayload } from '../types';


export function useProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAll = async () => {
    setIsLoading(true);
    try {
        const { data } = await fetchProducts();
        setProducts(data.products);
    } finally {
      setIsLoading(false);
    }
  };

  const create = async (payload: ProductPayload) => {
    setIsLoading(true);
    await createProduct(payload)
    .then(({data}) => {
      if(data.success){
        toast.success('Category created successfully')
      }else{
        toast.error(data.Message || 'Failed to create category');
      }}
    );
    await getAll();
  };

  const update = async (id: string, payload: ProductPayload) => {
    setIsLoading(true);
    await updateProduct(id, payload)
    .then(({data}) => {
      if(data.success){
        toast.success(data.Message || 'Category updated successfully');
      }else{
        toast.error(data.Message || 'Failed to update category');
      }
    })
    await getAll();
  };

  const remove = async (id: string) => {
    setIsLoading(true);
    await deleteProduct(id)
    .then(({data}) => {
      if(data.success){
        toast.success(data.Message || 'Category removed successfully');
      }else{
        toast.error(data.Message || 'Failed to remove category');
      }
    })
    await getAll();
  };

  useEffect(() => { getAll(); }, []);

  return { products, isLoading, create, update, remove, refetch: getAll };
}
