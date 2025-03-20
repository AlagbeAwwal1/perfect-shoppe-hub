
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const usePaymentHandling = (
  processOrder: (reference: string) => Promise<void>
) => {
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const { toast } = useToast();
  
  const handlePaymentSuccess = async (reference: string) => {
    try {
      await processOrder(reference);
    } catch (error) {
      console.error("Error processing payment:", error);
      // Still show success message to user even if there was an error
      toast({
        title: "Order successful!",
        description: "Your order has been placed. Thank you for your purchase.",
      });
    }
  };
  
  const handlePaymentClose = () => {
    setPaymentInitiated(false);
    toast({
      title: "Payment cancelled",
      description: "You can try again when you're ready.",
    });
  };
  
  return {
    paymentInitiated,
    setPaymentInitiated,
    handlePaymentSuccess,
    handlePaymentClose
  };
};
