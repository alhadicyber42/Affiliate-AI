import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export const useAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalCTR: 0,
    totalConversions: 0,
    totalRevenue: 0,
    productsCount: 0,
    scriptsCount: 0,
    videosCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await analyticsApi.getAnalytics(user.id);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refresh: loadAnalytics,
  };
};
