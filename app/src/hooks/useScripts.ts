import { useState, useEffect, useCallback } from 'react';
import type { Script, ScriptModule } from '@/types';
import { scriptApi } from '@/services/mockApi';

export const useScripts = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadScripts = useCallback(() => {
    const data = scriptApi.getScripts();
    setScripts(data);
  }, []);

  useEffect(() => {
    loadScripts();
  }, [loadScripts]);

  const generateScript = async (
    productId: string,
    framework: string,
    platform: string,
    tone: string
  ): Promise<Script> => {
    setIsLoading(true);
    setError(null);
    try {
      const script = await scriptApi.generateScript(productId, framework, platform, tone);
      loadScripts();
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
      loadScripts();
      return module;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate module');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateScript = (id: string, updates: Partial<Script>) => {
    scriptApi.updateScript(id, updates);
    loadScripts();
  };

  const deleteScript = (id: string) => {
    scriptApi.deleteScript(id);
    loadScripts();
  };

  const getScriptById = (id: string): Script | null => {
    return scriptApi.getScriptById(id);
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
