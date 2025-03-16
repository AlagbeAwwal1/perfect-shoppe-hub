
import React from 'react';
import { Check, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface OrderSuccessProps {
  emailStatus: 'success' | 'limited' | 'failed' | null;
  customerEmail: string;
}

const OrderSuccess = ({ emailStatus, customerEmail }: OrderSuccessProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6 text-center">Thank you for your purchase. We've received your order and will process it shortly.</p>
          
          {emailStatus === 'limited' && (
            <Alert className="mb-6" variant="default">
              <Info className="h-4 w-4" />
              <AlertTitle>Email Delivery Notice</AlertTitle>
              <AlertDescription>
                Your order has been received, but our email system is currently in test mode.
                Confirmation emails can only be sent to verified addresses during testing.
                Rest assured your order has been placed successfully.
              </AlertDescription>
            </Alert>
          )}
          
          {emailStatus === 'failed' && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Email Delivery Issue</AlertTitle>
              <AlertDescription>
                Your order has been placed successfully, but we couldn't send a confirmation email.
                Please keep your order reference for your records.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-center mt-8">
            <Button 
              className="bg-brand-purple text-white hover:bg-brand-purple/90"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
