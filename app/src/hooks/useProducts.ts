import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types';
import { productApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export const useProducts = () => {
  const { user, refreshCredits } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await productApi.getProducts(user.id);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const extractProduct = async (url: string): Promise<Product> => {
    if (!user?.id) throw new Error('User not authenticated');
    
    setIsLoading(true);
    setError(null);
    try {
      const product = await productApi.extractFromUrl(url, user.id);
      await loadProducts();
      await refreshCredits(); // Refresh credits after extraction
      return product;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract product');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productApi.deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    }
  };

  const getProductById = (id: string): Product | null => {
    return products.find(p => p.id === id) || null;
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
