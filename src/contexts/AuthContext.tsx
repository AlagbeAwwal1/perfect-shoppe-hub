import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Admin email - you can replace this with your actual admin email
const ADMIN_EMAIL = "alagbeawwal@gmail.com";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthState(session);
      setLoading(false);
      
      // Listen for auth state changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        (_event, session) => {
          setAuthState(session);
        }
      );
      
      return () => subscription.unsubscribe();
    };
    
    checkSession();
  }, []);

  const setAuthState = (session: Session | null) => {
    if (session?.user) {
      const { id, email } = session.user;
      const name = email?.split('@')[0] || 'User'; // Default name from email
      const userIsAdmin = email === ADMIN_EMAIL;
      
      setUser({
        id,
        name,
        email: email || '',
        isAdmin: userIsAdmin,
      });
      
      setIsAuthenticated(true);
      setIsAdmin(userIsAdmin);
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
  };

  const signup = async (name: string, email: string, password: string) => {
    // Store name in user metadata
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  if (loading) {
    // You could render a loading state here if needed
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
