import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthState } from '@/types';
import { authApi } from '@/services/mockApi';
import { supabase } from '@/lib/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;
    console.log('🔐 AuthContext: Initializing');

    const handleSession = async (session: any) => {
      if (!mounted) return;

      if (!session?.user) {
        console.log('ℹ️ AuthContext: No session found');
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      console.log('🔐 AuthContext: Processing session for', session.user.id);
      try {
        // Fetch profile with 5s timeout safety
        const profilePromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
        );

        let profile = null;
        try {
          const result = await Promise.race([profilePromise, timeoutPromise]) as any;
          if (result.error) console.warn('🔐 AuthContext: Profile fetch error:', result.error.message);
          profile = result.data;
        } catch (err) {
          console.warn('🔐 AuthContext: Profile fetch timed out or failed');
        }

        if (!mounted) return;

        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.email!.split('@')[0],
          avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
          plan: profile?.plan || 'free',
          credits: profile?.credits || 100,
          createdAt: profile?.created_at || new Date().toISOString(),
        };

        console.log('✅ AuthContext: State updated (Authenticated)');
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (err) {
        console.error('❌ AuthContext: Unexpected state update error:', err);
        if (mounted) setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    }).catch(() => {
      if (mounted) setState(prev => ({ ...prev, isLoading: false }));
    });

    // Handle auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔐 AuthContext: Auth event [${event}]`);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        handleSession(session);
      } else if (event === 'SIGNED_OUT') {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔐 AuthContext: Manual login starting');
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // onAuthStateChange will handle the final state cleanup
    } catch (error) {
      console.error('❌ AuthContext: Manual login error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    console.log('🔐 AuthContext: Manual registration starting');
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) throw error;

      if (data.user) {
        // Fallback profile creation
        await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          email,
          plan: 'free'
        });
      }
    } catch (error) {
      console.error('❌ AuthContext: Manual registration error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    await authApi.logout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (updates: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null,
    }));
  };

  const refreshCredits = async () => {
    if (!state.user?.id) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', state.user.id)
        .single();
      
      if (profile) {
        updateUser({ credits: profile.credits });
      }
    } catch (error) {
      console.error('Failed to refresh credits:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        refreshCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
