
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

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

// Admin emails - you can replace these with your actual admin emails
const ADMIN_EMAILS = ["alagbeawwal@gmail.com", "test@example.com"];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for active session
    const checkSession = async () => {
      try {
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
      } catch (error) {
        console.error("Auth session error:", error);
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const setAuthState = (session: Session | null) => {
    if (session?.user) {
      const { id, email } = session.user;
      const name = email?.split('@')[0] || 'User'; // Default name from email
      
      const userIsAdmin = email ? ADMIN_EMAILS.includes(email) : false;
      console.log('User email:', email, 'Is admin:', userIsAdmin);
      
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
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      toast({
        title: "Login successful",
        description: "You have successfully logged in",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // Store name in user metadata
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      
      if (error) throw error;

      toast({
        title: "Signup successful",
        description: "Your account has been created. You may need to verify your email.",
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
      throw error;
    }
  };

  if (loading) {
    // You could render a loading state here if needed
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
    </div>;
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
