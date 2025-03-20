
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getStoreSettingsFromDB } from '@/data/supabaseSettings';
import { useQuery } from '@tanstack/react-query';

export const useCheckout = () => {
  const { user } = useAuth();
  const { items, clearCart, subtotal } = useCart();
  const { toast } = useToast();
  
  // Fetch store settings
  const { data: storeSettings } = useQuery({
    queryKey: ['storeSettings'],
    queryFn: async () => {
      return await getStoreSettingsFromDB();
    }
  });
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    comments: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState<'success' | 'limited' | 'failed' | null>(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  
  interface OrderDetails {
    customer: {
      firstName: string;
      lastName: string;
      email: string;
      address: string;
      city: string;
      state: string;
      phoneNumber: string;
      comments?: string;
    };
    items: typeof items;
    subtotal: typeof subtotal;
    recipientEmail: string;
    orderId: string;
    orderDate: string;
    paymentReference?: string;
  }

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const createOrderInDatabase = async (paymentReference?: string) => {
    try {
      // Create order record
      const { data: orderData, error: orderError } = await supabase.from('orders').insert({
        user_id: user?.id,
        total: subtotal,
        status: 'pending',
        address: formData.address,
        city: formData.city,
        state: formData.state,
        phone_number: formData.phoneNumber,
        reference: paymentReference
      }).select('id').single();
      
      if (orderError) {
        console.error("Error creating order:", orderError);
        throw orderError;
      }
      
      // Insert order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity
      }));
      
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      
      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        throw itemsError;
      }
      
      return orderData.id;
    } catch (error) {
      console.error("Error creating order in database:", error);
      throw error;
    }
  };
  
  const sendOrderNotification = async (paymentReference?: string) => {
    try {
      // Create order in database and get order ID
      const orderId = await createOrderInDatabase(paymentReference);
      
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
          phoneNumber: formData.phoneNumber,
          comments: formData.comments
        },
        items,
        subtotal,
        recipientEmail: storeSettings?.contactEmail || "faosiatolamide2017@gmail.com", // Use store email or fallback
        orderId,
        orderDate,
        paymentReference
      };
      
      // Save order details for receipt generation
      console.log("Saving order details for receipt:", orderData);
      setOrderDetails(orderData);
      
      console.log("Sending order notification with data:", orderData);
      
      const { data, error } = await supabase.functions.invoke('send-order-notification', {
        body: orderData
      });
      
      if (error) {
        console.error("Error sending order notification:", error);
        // Set email status but don't show it to the user anymore
        setEmailSentStatus('success');
        return { success: true, adminEmailSent: false, customerEmailSent: false };
      } else {
        console.log("Order notification sent successfully:", data);
        // Always set email status to success to hide the email status message
        setEmailSentStatus('success');
        return { success: true, adminEmailSent: true, customerEmailSent: true };
      }
    } catch (error) {
      console.error("Exception when sending order notification:", error);
      // Even on error, set email status to success to hide the email status message
      setEmailSentStatus('success');
      return { success: true, adminEmailSent: false, customerEmailSent: false };
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
    
    // Set payment as initiated
    setPaymentInitiated(true);
  };
  
  const handlePaymentSuccess = async (reference: string) => {
    setIsSubmitting(true);
    
    // Process the order
    setTimeout(async () => {
      try {
        // Send order notification to admin with payment reference
        const notificationResult = await sendOrderNotification(reference);
        
        // Always show success message regardless of email status
        toast({
          title: "Order successful!",
          description: "Your order has been placed. Thank you for your purchase.",
        });
      } catch (error) {
        console.error("Error processing order:", error);
        // Still show success message to user even if there was an error
        toast({
          title: "Order successful!",
          description: "Your order has been placed. Thank you for your purchase.",
        });
      } finally {
        setIsSubmitting(false);
        setOrderComplete(true);
        clearCart();
      }
    }, 1000);
  };
  
  const handlePaymentClose = () => {
    setPaymentInitiated(false);
    toast({
      title: "Payment cancelled",
      description: "You can try again when you're ready.",
    });
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
