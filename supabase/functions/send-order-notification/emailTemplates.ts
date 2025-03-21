
import { CustomerInfo, OrderItem } from "./types.ts";

// Define the sender email - if you verify a domain in Resend, update this to use your domain
export const SENDER_EMAIL = "The Perfect Shoppe <onboarding@resend.dev>";

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
  customer: any,
  itemsList: string,
  subtotal: number,
  orderId: string,
  orderDate: string,
  paymentReference?: string
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .order-details { margin-bottom: 30px; }
        .customer-info { margin-bottom: 30px; }
        .items-table { width: 100%; border-collapse: collapse; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        .items-table th { background-color: #f2f2f2; }
        .total { font-weight: bold; text-align: right; margin-top: 20px; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Order Received</h1>
          <p>Order #${orderId} - ${orderDate}</p>
        </div>
        
        <div class="order-details">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Date:</strong> ${orderDate}</p>
          <p><strong>Total Amount:</strong> ₦${subtotal.toLocaleString()}</p>
          ${paymentReference ? `<p><strong>Payment Reference:</strong> ${paymentReference}</p>` : ''}
        </div>
        
        <div class="customer-info">
          <h2>Customer Information</h2>
          <p><strong>Name:</strong> ${customer.firstName} ${customer.lastName}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Phone:</strong> ${customer.phoneNumber}</p>
          <p><strong>Shipping Address:</strong> ${customer.address}, ${customer.city}, ${customer.state}</p>
          ${customer.comments ? `<p><strong>Comments:</strong> ${customer.comments}</p>` : ''}
        </div>
        
        <h2>Items Ordered</h2>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align: right; padding: 8px;"><strong>Total:</strong></td>
              <td style="padding: 8px;">₦${subtotal.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        
        <div class="footer">
          <p>This is an automated message from The Perfect Shoppe.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateCustomerEmailHtml = (
  customer: any,
  itemsList: string,
  subtotal: number,
  orderId: string,
  orderDate: string
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { color: #6b21a8; }
        .message { margin-bottom: 30px; }
        .order-details { margin-bottom: 30px; }
        .items-table { width: 100%; border-collapse: collapse; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        .items-table th { background-color: #f2f2f2; }
        .total { font-weight: bold; text-align: right; margin-top: 20px; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Order!</h1>
          <p>Order #${orderId}</p>
        </div>
        
        <div class="message">
          <p>Dear ${customer.firstName},</p>
          <p>Thank you for shopping with The Perfect Shoppe! Your order has been received and is being processed.</p>
        </div>
        
        <div class="order-details">
          <h2>Order Details</h2>
          <p><strong>Order Number:</strong> ${orderId}</p>
          <p><strong>Order Date:</strong> ${orderDate}</p>
          <p><strong>Shipping Address:</strong> ${customer.address}, ${customer.city}, ${customer.state}</p>
          ${customer.comments ? `<p><strong>Your Comments:</strong> ${customer.comments}</p>` : ''}
        </div>
        
        <h2>Items Ordered</h2>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align: right; padding: 8px;"><strong>Total:</strong></td>
              <td style="padding: 8px;">₦${subtotal.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        
        <div class="footer">
          <p>If you have any questions about your order, please contact our customer service.</p>
          <p>Thank you for shopping with us!</p>
          <p>The Perfect Shoppe</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
