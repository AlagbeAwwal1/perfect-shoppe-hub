
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();
  
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-6">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">Thank you for your purchase. We've received your order and will process it shortly.</p>
        <Button 
          className="bg-brand-purple text-white hover:bg-brand-purple/90"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccess;
