
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';

interface PaystackCheckoutProps {
  email: string;
  amount: number;
  name: string;
  phone: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  disabled?: boolean;
}

const PaystackCheckout: React.FC<PaystackCheckoutProps> = ({
  email,
  amount,
  name,
  phone,
  onSuccess,
  onClose,
  disabled = false
}) => {
  const { toast } = useToast();
  
  const initializePayment = () => {
    if (typeof window.PaystackPop === 'undefined') {
      toast({
        title: "Paystack not loaded",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
      return;
    }
    
    const handler = window.PaystackPop.setup({
      key: 'pk_test_70b3218b9922660a6f49ee5e19c350731fe844d8', // Updated with the provided Paystack test key
      email,
      amount: amount * 100, // Paystack expects amount in kobo (multiply by 100)
      currency: 'NGN',
      ref: 'HIDAAYA_' + Math.floor(Math.random() * 1000000000 + 1),
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: name
          },
          {
            display_name: "Phone Number",
            variable_name: "phone",
            value: phone
          }
        ]
      },
      callback: function(response: { reference: string }) {
        onSuccess(response.reference);
      },
      onClose: function() {
        onClose();
      }
    });
    
    handler.openIframe();
  };
  
  return (
    <Button 
      type="button"
      className="w-full md:w-auto bg-brand-purple text-white hover:bg-brand-purple/90"
      onClick={initializePayment}
      disabled={disabled}
    >
      {disabled ? 'Processing...' : 'Pay with Paystack'}
    </Button>
  );
};

export default PaystackCheckout;
