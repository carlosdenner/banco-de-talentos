import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isEmailConfirmed: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle auth callback from email confirmation links
    const handleAuthCallback = async () => {
      console.log('[Auth] Checking for auth callback...');
      console.log('[Auth] Current URL:', window.location.href);
      console.log('[Auth] Hash:', window.location.hash);
      console.log('[Auth] Search:', window.location.search);
      
      // Check if we have auth tokens in URL (hash or query params)
      const hash = window.location.hash;
      const search = window.location.search;
      
      if ((hash && (hash.includes('access_token') || hash.includes('type='))) || 
          (search && (search.includes('access_token') || search.includes('type=')))) {
        console.log('[Auth] Auth callback detected, processing...');
        
        // Let Supabase process the callback automatically
        // The detectSessionInUrl option should handle this
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for processing
        
        const { data, error } = await supabase.auth.getSession();
        console.log('[Auth] Session after callback:', data.session);
        console.log('[Auth] Error:', error);
        
        if (error) {
          console.error('[Auth] Error processing auth callback:', error);
        }
        
        if (data.session) {
          console.log('[Auth] Session established, user:', data.session.user.email);
          setSession(data.session);
          setUser(data.session.user);
          // Clean up the URL
          window.history.replaceState(null, '', window.location.pathname);
        } else {
          console.warn('[Auth] No session after callback processing');
        }
        setLoading(false);
        return;
      }
      
      // Get initial session
      console.log('[Auth] No callback detected, getting initial session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[Auth] Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    handleAuthCallback();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] Auth state changed:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resendConfirmationEmail = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    return { error: error as Error | null };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/banco-de-talentos/`,
    });
    return { error: error as Error | null };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error: error as Error | null };
  };

  // Check if user's email is confirmed
  const isEmailConfirmed = user?.email_confirmed_at != null;

  return (
    <AuthContext.Provider value={{ user, session, loading, isEmailConfirmed, signUp, signIn, signOut, resendConfirmationEmail, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
