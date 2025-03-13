
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { LogOut, User } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-sm">
        <div className="flex items-center justify-center mb-8">
          <div className="h-24 w-24 bg-brand-purple/10 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-brand-purple" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-brand-purple mb-8">
          My Profile
        </h1>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-sm text-gray-500">Name</h2>
            <p className="text-lg font-medium">{user?.name || 'N/A'}</p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-sm text-gray-500">Email</h2>
            <p className="text-lg font-medium">{user?.email || 'N/A'}</p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-sm text-gray-500">Account Type</h2>
            <p className="text-lg font-medium">
              {user?.isAdmin ? 'Administrator' : 'Customer'}
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
