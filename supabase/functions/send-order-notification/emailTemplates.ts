
import { CustomerInfo, OrderItem } from "./types.ts";

// Define the sender email
export const SENDER_EMAIL = "Order Notification <onboarding@resend.dev>";

export const formatItemsList = (items: OrderItem[]): string => {
  return items.map(item => 
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.product.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">₦${item.product.price.toLocaleString()}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">₦${(item.product.price * item.quantity).toLocaleString()}</td>
    </tr>`
  ).join('');
};

export const generateAdminEmailHtml = (
  customer: CustomerInfo, 
  itemsList: string, 
  subtotal: number, 
  orderId: string, 
  orderDate: string
): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6b21a8; text-align: center;">The Perfect Shoppe</h1>
      <h2 style="color: #333;">New Order Received</h2>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">Order Information</h3>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Date:</strong> ${orderDate}</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">Customer Information</h3>
        <p><strong>Name:</strong> ${customer.firstName} ${customer.lastName}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Phone:</strong> ${customer.phoneNumber}</p>
        <p><strong>Address:</strong> ${customer.address}, ${customer.city}, ${customer.state}</p>
      </div>
      
      <h3>Order Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Product</th>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Quantity</th>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Subtotal:</td>
            <td style="padding: 8px; font-weight: bold;">₦${subtotal.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
      
      <p style="text-align: center; margin-top: 20px; color: #666;">
        You can view and manage this order on your admin dashboard.
      </p>
    </div>
  `;
};

export const generateCustomerEmailHtml = (
  customer: CustomerInfo, 
  itemsList: string, 
  subtotal: number, 
  orderId: string, 
  orderDate: string
): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6b21a8; text-align: center;">The Perfect Shoppe</h1>
      <h2 style="color: #333;">Thank You for Your Order!</h2>
      
      <p style="margin-bottom: 20px;">Dear ${customer.firstName},</p>
      
      <p style="margin-bottom: 20px;">Thank you for shopping with us. We've received your order and are working on processing it as soon as possible.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">Order Information</h3>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Date:</strong> ${orderDate}</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Product</th>
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Quantity</th>
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Subtotal:</td>
              <td style="padding: 8px; font-weight: bold;">₦${subtotal.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">Shipping Information</h3>
        <p><strong>Address:</strong> ${customer.address}</p>
        <p><strong>City:</strong> ${customer.city}</p>
        <p><strong>State:</strong> ${customer.state}</p>
      </div>
      
      <p>If you have any questions about your order, please contact our customer service team.</p>
      
      <p style="text-align: center; margin-top: 30px; color: #666;">
        Thank you for shopping with The Perfect Shoppe!
      </p>
    </div>
  `;
};
