import { useState, useEffect, useCallback } from 'react';
import type { Script, ScriptModule } from '@/types';
import { scriptApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export const useScripts = () => {
  const { user, refreshCredits } = useAuth();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadScripts = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await scriptApi.getScripts(user.id);
      setScripts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scripts');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadScripts();
  }, [loadScripts]);

  const generateScript = async (
    productId: string,
    framework: string,
    platform: string,
    tone: string
  ): Promise<Script> => {
    if (!user?.id) throw new Error('User not authenticated');
    
    setIsLoading(true);
    setError(null);
    try {
      const script = await scriptApi.generateScript(user.id, productId, framework, platform, tone);
      await loadScripts();
      await refreshCredits(); // Refresh credits after generation
      return script;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate script');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateModule = async (scriptId: string, moduleId: string): Promise<ScriptModule> => {
    setIsLoading(true);
    try {
      const module = await scriptApi.regenerateModule(scriptId, moduleId);
      await loadScripts();
      return module;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate module');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateScript = async (id: string, updates: Partial<Script>) => {
    await scriptApi.updateScript(id, updates);
    await loadScripts();
  };

  const deleteScript = async (id: string) => {
    try {
      await scriptApi.deleteScript(id);
      await loadScripts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete script');
      throw err;
    }
  };

  const getScriptById = (id: string): Script | null => {
    return scripts.find(s => s.id === id) || null;
  };

  return {
    scripts,
    isLoading,
    error,
    generateScript,
    regenerateModule,
    updateScript,
    deleteScript,
    getScriptById,
    refresh: loadScripts,
  };
};
