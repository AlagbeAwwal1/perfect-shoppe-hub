
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import PaystackCheckout from './PaystackCheckout';
import { StoreSettings } from '@/types/settings';

interface ShippingFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    comments: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  paymentInitiated?: boolean;
  onPaymentSuccess?: (reference: string) => void;
  onPaymentClose?: () => void;
  subtotal?: number;
  settings?: StoreSettings | null;
}

const ShippingForm = ({ 
  formData, 
  handleChange, 
  handleSubmit, 
  isSubmitting,
  paymentInitiated = false,
  onPaymentSuccess = () => {},
  onPaymentClose = () => {},
  subtotal = 0,
  settings
}: ShippingFormProps) => {
  const currency = settings?.currency || '₦';
  const showPaystack = settings?.paymentMethods?.paystack !== false;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-medium text-gray-900 mb-6">Shipping Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={paymentInitiated}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={paymentInitiated}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={paymentInitiated}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            disabled={paymentInitiated}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={paymentInitiated}
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              disabled={paymentInitiated}
            />
          </div>
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              Zip Code
            </label>
            <Input
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              disabled={paymentInitiated}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            disabled={paymentInitiated}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
            Comments (Please add the colors of the item you wish to purchase)
          </label>
          <Textarea
            id="comments"
            name="comments"
            value={formData.comments || ''}
            onChange={handleChange}
            disabled={paymentInitiated}
            className="min-h-[100px]"
          />
        </div>
        
        <h2 className="text-xl font-medium text-gray-900 mb-6 mt-8">Payment Information</h2>
        
        {!paymentInitiated ? (
          <>
            <p className="text-gray-600 mb-4">
              Complete your order by paying with Paystack, a secure payment platform.
            </p>
            
            <Button 
              type="submit"
              className="w-full md:w-auto bg-brand-purple text-white hover:bg-brand-purple/90"
              disabled={isSubmitting}
            >
              Proceed to Payment
            </Button>
          </>
        ) : (
          <div className="border-t pt-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Order Summary</h3>
              <p className="text-xl font-bold text-brand-purple mt-2">Total: {currency}{subtotal.toLocaleString()}</p>
            </div>
            
            {showPaystack ? (
              <PaystackCheckout
                email={formData.email}
                amount={subtotal}
                name={`${formData.firstName} ${formData.lastName}`}
                phone={formData.phoneNumber}
                onSuccess={onPaymentSuccess}
                onClose={onPaymentClose}
                disabled={isSubmitting}
              />
            ) : (
              <Button
                type="button" 
                className="w-full md:w-auto bg-brand-purple text-white hover:bg-brand-purple/90"
                onClick={() => onPaymentSuccess('manual_payment')}
                disabled={isSubmitting}
              >
                Complete Order
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default ShippingForm;
