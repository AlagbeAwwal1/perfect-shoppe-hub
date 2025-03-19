
import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import {
  BoxIcon,
  LogOut,
  ShoppingBag,
  Users,
  Settings,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Redirect if not authenticated or not an admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive"
      });
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-brand-purple mb-4">Admin Dashboard</h1>
        <div className="w-20 h-1 bg-brand-gold mb-6"></div>
        <p className="text-gray-600">
          Welcome back, {user?.name || 'Admin'}. Manage your products, orders, and settings here.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          className="cursor-pointer group"
          onClick={() => handleNavigation('/admin/products')}
        >
          <div className="p-8 rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-brand-purple/40">
            <div className="mb-4 p-3 bg-brand-purple/10 rounded-full w-fit">
              <BoxIcon className="h-6 w-6 text-brand-purple" />
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-brand-purple transition-colors">Manage Products</h2>
            <p className="text-gray-600">Add, edit, or remove products from your store inventory.</p>
          </div>
        </div>
        
        <div 
          className="cursor-pointer group"
          onClick={() => handleNavigation('/admin/orders')}
        >
          <div className="p-8 rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-brand-purple/40">
            <div className="mb-4 p-3 bg-brand-purple/10 rounded-full w-fit">
              <ShoppingBag className="h-6 w-6 text-brand-purple" />
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-brand-purple transition-colors">Manage Orders</h2>
            <p className="text-gray-600">View and process customer orders.</p>
          </div>
        </div>
        
        <div 
          className="cursor-pointer group"
          onClick={() => handleNavigation('/admin/users')}
        >
          <div className="p-8 rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-brand-purple/40">
            <div className="mb-4 p-3 bg-brand-purple/10 rounded-full w-fit">
              <Users className="h-6 w-6 text-brand-purple" />
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-brand-purple transition-colors">Manage Users</h2>
            <p className="text-gray-600">View and manage user accounts.</p>
          </div>
        </div>
        
        <div 
          className="cursor-pointer group"
          onClick={() => handleNavigation('/admin/settings')}
        >
          <div className="p-8 rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-brand-purple/40">
            <div className="mb-4 p-3 bg-brand-purple/10 rounded-full w-fit">
              <Settings className="h-6 w-6 text-brand-purple" />
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-brand-purple transition-colors">Store Settings</h2>
            <p className="text-gray-600">Configure your store settings.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
