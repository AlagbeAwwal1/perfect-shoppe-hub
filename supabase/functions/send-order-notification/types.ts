
export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  phoneNumber: string;
  comments?: string;
}

export interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

export interface OrderData {
  customer: CustomerData;
  items: OrderItem[];
  subtotal: number;
  recipientEmail: string;
  orderId: string;
  orderDate: string;
  paymentReference?: string;
}
