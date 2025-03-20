
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
        throw orderError;
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
        throw itemsError;
      }
      
      console.log("Order items created successfully");
      
      return orderData.id;
    } catch (error) {
      console.error("Error creating order in database:", error);
      throw error;
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
        recipientEmail: storeSettings?.contactEmail || "faosiatolamide2017@gmail.com", // Use store email or fallback
        orderId,
        orderDate,
        paymentReference
      };
      
      // Save order details for receipt generation
      console.log("Saving order details for receipt:", orderData);
      setOrderDetails(orderData);
      
      console.log("Sending order notification with data:", orderData);
      
      try {
        const { data, error } = await supabase.functions.invoke('send-order-notification', {
          body: orderData
        });
        
        if (error) {
          console.error("Error sending order notification:", error);
          // Always set email status to success, even if there was an error
          setEmailSentStatus('success');
          return { success: true, adminEmailSent: false, customerEmailSent: false };
        } else {
          console.log("Order notification sent successfully:", data);
          setEmailSentStatus('success');
          return { success: true, adminEmailSent: true, customerEmailSent: true };
        }
      } catch (notificationError) {
        console.error("Exception when sending order notification:", notificationError);
        // Even on error, set email status to success
        setEmailSentStatus('success');
        return { success: true, adminEmailSent: false, customerEmailSent: false };
      }
    } catch (error) {
      console.error("Exception in sendOrderNotification:", error);
      // Crucially, we still want to set the email status to success
      // and save any order details we can for the receipt
      setEmailSentStatus('success');
      return { success: true, adminEmailSent: false, customerEmailSent: false };
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
