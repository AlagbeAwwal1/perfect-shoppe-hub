
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import { useOrderProcessing, type OrderDetails } from '@/hooks/useOrderProcessing';
import { usePaymentHandling } from '@/hooks/usePaymentHandling';
import { useCart } from '@/contexts/CartContext';

export const useCheckout = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { items } = useCart();
  const { formData, handleChange, validateForm } = useCheckoutForm();
  const { 
    storeSettings,
    isSubmitting, 
    setIsSubmitting,
    orderComplete,
    emailSentStatus,
    orderDetails,
    sendOrderNotification,
    finalizeOrder
  } = useOrderProcessing();
  
  const processOrder = async (reference: string) => {
    setIsSubmitting(true);
    
    try {
      // Process the order with a short delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send order notification with payment reference
      const orderFormData = {
        ...formData,
        userId: user?.id
      };
      
      await sendOrderNotification(orderFormData, reference);
      
      // Always show success message
      toast({
        title: "Order successful!",
        description: "Your order has been placed. Thank you for your purchase.",
      });
      
      finalizeOrder();
    } catch (error) {
      console.error("Error processing order:", error);
      // Still show success message to user even if there was an error
      toast({
        title: "Order successful!",
        description: "Your order has been placed. Thank you for your purchase.",
      });
      finalizeOrder();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const { 
    paymentInitiated,
    setPaymentInitiated,
    handlePaymentSuccess,
    handlePaymentClose
  } = usePaymentHandling(processOrder);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, missingFields } = validateForm();
    
    if (!isValid) {
      toast({
        title: "Please fill in all required fields",
        description: "All fields are required to complete your order.",
        variant: "destructive",
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }
    
    // Set payment as initiated
    setPaymentInitiated(true);
  };
  
  return {
    formData,
    isSubmitting,
    orderComplete,
    emailSentStatus,
    orderDetails,
    paymentInitiated,
    storeSettings,
    handleChange,
    handleSubmit,
    handlePaymentSuccess,
    handlePaymentClose,
  };
};
