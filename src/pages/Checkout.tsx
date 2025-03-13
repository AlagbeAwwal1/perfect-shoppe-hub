
import React, { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useCheckout } from '@/hooks/useCheckout';
import ShippingForm from '@/components/checkout/ShippingForm';
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';
import OrderSuccess from '@/components/checkout/OrderSuccess';

const Checkout = () => {
  const { items } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formData, isSubmitting, orderComplete, handleChange, handleSubmit } = useCheckout();
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to complete your purchase.",
        variant: "destructive",
      });
      navigate('/login', { state: { returnUrl: '/checkout' } });
    }
  }, [isAuthenticated, navigate, toast]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  if (items.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }
  
  if (orderComplete) {
    return <OrderSuccess />;
  }
  
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ShippingForm 
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
          
          <div className="md:col-span-1">
            <CheckoutOrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
