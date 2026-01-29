import { useState, useEffect, useCallback } from 'react';
import type { Video } from '@/types';
import { videoApi } from '@/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';

export const useVideos = () => {
  const { user, refreshCredits } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVideos = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await videoApi.getVideos(user.id);
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const generateVideo = async (scriptId: string, style: string): Promise<Video> => {
    if (!user?.id) throw new Error('User not authenticated');
    
    setIsLoading(true);
    setError(null);
    try {
      const video = await videoApi.generateVideo(user.id, scriptId, style);
      await loadVideos();
      await refreshCredits(); // Refresh credits after generation
      return video;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      await videoApi.deleteVideo(id);
      await loadVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete video');
      throw err;
    }
  };

  return {
    videos,
    isLoading,
    error,
    generateVideo,
    deleteVideo,
    refresh: loadVideos,
  };
};
