
import type { EmailTemplateData, OrderItem } from './types.ts';

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString()}`;
};

// Helper function to generate items HTML
const generateItemsHTML = (items: OrderItem[]): string => {
  return items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `).join('');
};

// Order confirmation email template
export const createOrderConfirmationTemplate = (data: EmailTemplateData): string => {
  const { orderId, customerName, items, total, status } = data;

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
        .order-id { font-size: 18px; margin-bottom: 15px; }
        .message { margin-bottom: 20px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th { background-color: #f5f5f5; text-align: left; padding: 10px; }
        .items-table th:last-child { text-align: right; }
        .total-row { font-weight: bold; }
        .footer { margin-top: 30px; font-size: 14px; color: #777; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
        </div>
        
        <p class="order-id">Order ID: #${orderId.substring(0, 8)}</p>
        
        <div class="message">
          <p>Dear ${customerName},</p>
          <p>Thank you for your purchase! We're pleased to confirm that your order has been received and is now being processed.</p>
          <p>Your order status is: <strong>${status.toUpperCase()}</strong></p>
        </div>
        
        <h3>Order Summary:</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${generateItemsHTML(items)}
            <tr class="total-row">
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">${formatCurrency(total)}</td>
            </tr>
          </tbody>
        </table>
        
        <p>We'll notify you when your order has been shipped. If you have any questions, please contact our customer service team.</p>
        
        <div class="footer">
          <p>Thank you for shopping with us!</p>
          <p>The Perfect Shoppe</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Order status update email template
export const createOrderStatusUpdateTemplate = (data: EmailTemplateData): string => {
  const { orderId, customerName, items, total, status, previousStatus } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Status Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .order-id { font-size: 18px; margin-bottom: 15px; }
        .message { margin-bottom: 20px; }
        .status-update { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin-bottom: 20px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th { background-color: #f5f5f5; text-align: left; padding: 10px; }
        .items-table th:last-child { text-align: right; }
        .total-row { font-weight: bold; }
        .footer { margin-top: 30px; font-size: 14px; color: #777; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Status Update</h1>
        </div>
        
        <p class="order-id">Order ID: #${orderId.substring(0, 8)}</p>
        
        <div class="status-update">
          <p>The status of order #${orderId.substring(0, 8)} has been updated:</p>
          <p>Previous Status: <strong>${previousStatus?.toUpperCase()}</strong></p>
          <p>New Status: <strong>${status.toUpperCase()}</strong></p>
        </div>
        
        <div class="message">
          <p>Dear Business Owner,</p>
          <p>This is an automatic notification that the status of an order has been updated.</p>
        </div>
        
        <h3>Order Summary:</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${generateItemsHTML(items)}
            <tr class="total-row">
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">${formatCurrency(total)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          <p>This is an automated message from your e-commerce system.</p>
          <p>The Perfect Shoppe</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Order report email template
export const createOrderReportTemplate = (data: EmailTemplateData): string => {
  const { orderId, customerName, items, total, status } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Report</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .order-id { font-size: 18px; margin-bottom: 15px; }
        .message { margin-bottom: 20px; }
        .order-details { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2196F3; margin-bottom: 20px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th { background-color: #f5f5f5; text-align: left; padding: 10px; }
        .items-table th:last-child { text-align: right; }
        .total-row { font-weight: bold; }
        .footer { margin-top: 30px; font-size: 14px; color: #777; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Report</h1>
        </div>
        
        <p class="order-id">Order ID: #${orderId.substring(0, 8)}</p>
        
        <div class="order-details">
          <p>Customer: <strong>${customerName}</strong></p>
          <p>Status: <strong>${status.toUpperCase()}</strong></p>
          <p>Total Amount: <strong>${formatCurrency(total)}</strong></p>
        </div>
        
        <div class="message">
          <p>Dear Business Owner,</p>
          <p>Here is the detailed report for order #${orderId.substring(0, 8)}.</p>
        </div>
        
        <h3>Items Purchased:</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${generateItemsHTML(items)}
            <tr class="total-row">
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">${formatCurrency(total)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          <p>This report was generated at your request.</p>
          <p>The Perfect Shoppe</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
