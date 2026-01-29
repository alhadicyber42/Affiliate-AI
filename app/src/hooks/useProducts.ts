import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types';
import { productApi } from '@/services/mockApi';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(() => {
    const data = productApi.getProducts();
    setProducts(data);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const extractProduct = async (url: string): Promise<Product> => {
    setIsLoading(true);
    setError(null);
    try {
      const product = await productApi.extractFromUrl(url);
      loadProducts();
      return product;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract product');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = (id: string) => {
    productApi.deleteProduct(id);
    loadProducts();
  };

  const getProductById = (id: string): Product | null => {
    return productApi.getProductById(id);
  };

  return {
    products,
    isLoading,
    error,
    extractProduct,
    deleteProduct,
    getProductById,
    refresh: loadProducts,
  };
};
