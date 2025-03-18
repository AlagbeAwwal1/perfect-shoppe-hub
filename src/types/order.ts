
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

export interface CustomerInfo {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
}

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  created_at: string;
  updated_at: string;
  reference?: string;
}
