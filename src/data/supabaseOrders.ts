
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderStatus } from "@/types/order";

export async function getOrdersFromDB(): Promise<Order[]> {
  try {
    console.log('Fetching all orders');
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          id, 
          product_id,
          product_name,
          product_price, 
          quantity
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    console.log('Orders fetched:', data);

    // Transform the data to match our Order type
    const orders = data.map((order: any) => ({
      id: order.id,
      customer: {
        id: order.user_id || '',
        firstName: '', // Will be populated from profiles table separately
        lastName: '',  // Will be populated from profiles table separately
        email: '',     // Will be populated from profiles table separately
        phoneNumber: order.phone_number || '',
        address: order.address || '',
        city: order.city || '',
        state: order.state || '',
      },
      items: order.items.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: item.product_price,
        quantity: item.quantity,
        subtotal: item.product_price * item.quantity
      })),
      status: order.status as OrderStatus,
      total: order.total,
      created_at: order.created_at,
      updated_at: order.updated_at,
      reference: order.reference
    }));

    // Now fetch customer information separately for each order
    for (const order of orders) {
      if (order.customer.id) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email')
            .eq('id', order.customer.id)
            .maybeSingle();

          if (profileError) {
            console.error(`Error fetching profile for user ${order.customer.id}:`, profileError);
          } else if (profileData) {
            order.customer.firstName = profileData.first_name || '';
            order.customer.lastName = profileData.last_name || '';
            order.customer.email = profileData.email || '';
          }
        } catch (error) {
          console.error(`Error processing profile for user ${order.customer.id}:`, error);
        }
      }
    }

    console.log('Processed orders:', orders);
    return orders;
  } catch (error) {
    console.error('Error in getOrdersFromDB:', error);
    throw error;
  }
}

export async function getOrderByIdFromDB(orderId: string): Promise<Order | null> {
  try {
    console.log(`Fetching order with id ${orderId}`);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          id, 
          product_id,
          product_name,
          product_price, 
          quantity
        )
      `)
      .eq('id', orderId)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching order with id ${orderId}:`, error);
      throw error;
    }

    if (!data) {
      console.log(`No order found with id ${orderId}`);
      return null;
    }

    console.log('Order fetched:', data);

    // Create order with basic information
    const order: Order = {
      id: data.id,
      customer: {
        id: data.user_id || '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: data.phone_number || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
      },
      items: data.items.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: item.product_price,
        quantity: item.quantity,
        subtotal: item.product_price * item.quantity
      })),
      status: data.status as OrderStatus,
      total: data.total,
      created_at: data.created_at,
      updated_at: data.updated_at,
      reference: data.reference
    };

    // Fetch customer information if user_id exists
    if (order.customer.id) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .eq('id', order.customer.id)
          .maybeSingle();

        if (profileError) {
          console.error(`Error fetching profile for user ${order.customer.id}:`, profileError);
        } else if (profileData) {
          order.customer.firstName = profileData.first_name || '';
          order.customer.lastName = profileData.last_name || '';
          order.customer.email = profileData.email || '';
        }
      } catch (error) {
        console.error(`Error processing profile for user ${order.customer.id}:`, error);
      }
    }

    console.log('Processed order:', order);
    return order;
  } catch (error) {
    console.error('Error in getOrderByIdFromDB:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  try {
    console.log(`Updating order ${orderId} status to ${status}`);
    const { error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
    
    console.log('Order status updated successfully');
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    throw error;
  }
}
