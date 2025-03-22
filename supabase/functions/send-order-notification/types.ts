
export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface OrderNotificationPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  status: string;
  items: OrderItem[];
  total: number;
  notificationType: 'confirmation' | 'status-update' | 'report';
  previousStatus?: string;
}

export interface EmailTemplateData {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: string;
  previousStatus?: string;
}
