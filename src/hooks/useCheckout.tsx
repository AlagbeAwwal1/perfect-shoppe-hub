
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useCheckout = () => {
  const { user } = useAuth();
  const { items, clearCart, subtotal } = useCart();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState<'success' | 'limited' | 'failed' | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const sendOrderNotification = async () => {
    try {
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      const orderDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          phoneNumber: formData.phoneNumber
        },
        items,
        subtotal,
        recipientEmail: "faosiatolamide2017@gmail.com", // Admin email - updated here
        orderId,
        orderDate
      };
      
      // Save order details for receipt generation
      setOrderDetails(orderData);
      
      console.log("Sending order notification with data:", orderData);
      
      const { data, error } = await supabase.functions.invoke('send-order-notification', {
        body: orderData
      });
      
      if (error) {
        console.error("Error sending order notification:", error);
        setEmailSentStatus('failed');
        return { success: false, adminEmailSent: false, customerEmailSent: false };
      } else {
        console.log("Order notification sent successfully:", data);
        
        // Check if customer email was sent successfully
        if (data.customerEmail?.error) {
          // Customer email failed (likely due to Resend's testing restrictions)
          setEmailSentStatus(formData.email === 'faosiatolamide2017@gmail.com' ? 'success' : 'limited');
          return { success: true, adminEmailSent: true, customerEmailSent: false };
        } else {
          // Both emails sent successfully
          setEmailSentStatus('success');
          return { success: true, adminEmailSent: true, customerEmailSent: true };
        }
      }
    } catch (error) {
      console.error("Exception when sending order notification:", error);
      setEmailSentStatus('failed');
      return { success: false, adminEmailSent: false, customerEmailSent: false };
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'phoneNumber'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
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
    
    setIsSubmitting(true);
    
    // Simulate order processing with a timeout
    setTimeout(async () => {
      // Send order notification to admin
      const notificationResult = await sendOrderNotification();
      
      setIsSubmitting(false);
      setOrderComplete(true);
      clearCart();
      
      if (notificationResult.success) {
        toast({
          title: "Order placed successfully!",
          description: "Thank you for your purchase.",
        });
      } else {
        toast({
          title: "Order placed",
          description: "Your order was placed, but we encountered an issue sending notification emails.",
          variant: "destructive",
        });
      }
    }, 2000);
  };
  
  return {
    formData,
    isSubmitting,
    orderComplete,
    emailSentStatus,
    orderDetails,
    handleChange,
    handleSubmit,
  };
};
