
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderStatus } from "@/types/order";

export async function getOrdersFromDB(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:profiles(id, first_name, last_name, email),
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

  // Transform the data to match our Order type
  const orders = data.map((order: any) => ({
    id: order.id,
    customer: {
      id: order.customer?.id,
      firstName: order.customer?.first_name || '',
      lastName: order.customer?.last_name || '',
      email: order.customer?.email || '',
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

  return orders;
}

export async function getOrderByIdFromDB(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:profiles(id, first_name, last_name, email),
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

  if (!data) return null;

  // Transform the data to match our Order type
  const order: Order = {
    id: data.id,
    customer: {
      id: data.customer?.id,
      firstName: data.customer?.first_name || '',
      lastName: data.customer?.last_name || '',
      email: data.customer?.email || '',
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

  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
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
}
