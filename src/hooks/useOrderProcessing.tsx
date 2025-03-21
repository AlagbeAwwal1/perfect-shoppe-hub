
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getStoreSettingsFromDB } from '@/data/supabaseSettings';
import { useQuery } from '@tanstack/react-query';

export interface OrderDetails {
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
  items: any[];
  subtotal: number;
  recipientEmail: string;
  orderId: string;
  orderDate: string;
  paymentReference?: string;
}

export const useOrderProcessing = () => {
  const { items, clearCart, subtotal } = useCart();
  const { toast } = useToast();
  
  // Fetch store settings
  const { data: storeSettings } = useQuery({
    queryKey: ['storeSettings'],
    queryFn: async () => {
      return await getStoreSettingsFromDB();
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState<'success' | 'limited' | 'failed' | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  
  const createOrderInDatabase = async (formData: any, paymentReference?: string) => {
    try {
      console.log("Creating order in database with data:", formData);
      console.log("Payment reference:", paymentReference);
      
      // Create order record
      const { data: orderData, error: orderError } = await supabase.from('orders').insert({
        user_id: formData.userId,
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
        // Generate a fallback order ID if database insertion fails
        return `TPS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      
      console.log("Order created successfully with ID:", orderData.id);
      
      // Insert order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity
      }));
      
      console.log("Inserting order items:", orderItems);
      
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      
      if (itemsError) {
        console.error("Error creating order items:", itemsError);
      }
      
      console.log("Order items created successfully");
      
      return orderData.id;
    } catch (error) {
      console.error("Error creating order in database:", error);
      // Generate a fallback order ID if there's an exception
      return `TPS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
  };
  
  const sendOrderNotification = async (formData: any, paymentReference?: string) => {
    try {
      // Create order in database and get order ID
      const orderId = await createOrderInDatabase(formData, paymentReference);
      
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
        recipientEmail: storeSettings?.contactEmail || "theperfectshoppe6@gmail.com", // Use store email or fallback
        orderId,
        orderDate,
        paymentReference
      };
      
      // Always save order details for receipt generation, even if email sending fails
      console.log("Saving order details for receipt:", orderData);
      setOrderDetails(orderData);
      
      console.log("Sending order notification with data:", orderData);
      
      try {
        const { data, error } = await supabase.functions.invoke('send-order-notification', {
          body: orderData
        });
        
        if (error) {
          console.error("Error sending order notification:", error);
          setEmailSentStatus('limited');
          return { success: true, adminEmailSent: false, customerEmailSent: false };
        } else {
          console.log("Order notification sent successfully:", data);
          setEmailSentStatus('success');
          return { success: true, adminEmailSent: true, customerEmailSent: true };
        }
      } catch (notificationError) {
        console.error("Exception when sending order notification:", notificationError);
        setEmailSentStatus('limited');
        return { success: true, adminEmailSent: false, customerEmailSent: false };
      }
    } catch (error) {
      console.error("Exception in sendOrderNotification:", error);
      setEmailSentStatus('failed');
      return { success: false, adminEmailSent: false, customerEmailSent: false };
    }
  };
  
  const finalizeOrder = () => {
    setOrderComplete(true);
    clearCart();
  };
  
  return {
    items,
    subtotal,
    storeSettings,
    isSubmitting,
    setIsSubmitting,
    orderComplete,
    setOrderComplete,
    emailSentStatus,
    orderDetails,
    sendOrderNotification,
    finalizeOrder
  };
};
