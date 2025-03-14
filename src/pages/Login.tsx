
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { User, Lock, Mail } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the returnUrl from location state if it exists
  const returnUrl = location.state?.returnUrl || '/';
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(returnUrl);
    }
  }, [isAuthenticated, navigate, returnUrl]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await login(formData.email, formData.password);
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      navigate(returnUrl);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 page-container">
      <div className="container mx-auto px-4">
        {/* Decorative elements */}
        <div className="relative">
          <div className="decorative-dot top-40 left-10 w-16 h-16 opacity-20" style={{ animationDelay: "0.2s" }}></div>
          <div className="decorative-dot bottom-20 right-20 w-12 h-12 opacity-20" style={{ animationDelay: "1s" }}></div>
          <div className="decorative-circle top-20 right-40 w-24 h-24 opacity-20" style={{ animationDelay: "0.5s" }}></div>
          <div className="decorative-circle bottom-40 left-40 w-20 h-20 opacity-20" style={{ animationDelay: "1.3s" }}></div>
        </div>
        
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 relative z-10 animate-scale-in">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-block p-3 rounded-full bg-brand-purple/10 mb-4">
              <User className="h-8 w-8 text-brand-purple" />
            </div>
            <h1 className="text-3xl font-bold text-brand-purple">Welcome Back</h1>
            <p className="text-gray-600 mt-2 animate-fade-in delay-200">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-slide-in-left delay-300">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all duration-300"
                  placeholder="Your email"
                  required
                />
              </div>
            </div>
            
            <div className="animate-slide-in-left delay-400">
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="block text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-sm text-brand-purple hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all duration-300"
                  placeholder="Your password"
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-purple to-purple-700 hover:from-purple-700 hover:to-brand-purple text-white animate-fade-in delay-500 hover-lift"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center animate-fade-in delay-600">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-purple hover:underline relative group">
                Sign up
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
