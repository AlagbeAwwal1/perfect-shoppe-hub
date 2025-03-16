
export interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  phoneNumber: string;
}

export interface OrderData {
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  recipientEmail: string;
  orderId: string;
  orderDate: string;
}

export interface EmailResponse {
  success: boolean;
  adminEmail: any;
  customerEmail: any;
  error?: string;
}
