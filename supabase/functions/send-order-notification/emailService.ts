
import { Resend } from "npm:resend@2.0.0";
import { OrderData } from "./types.ts";
import { 
  SENDER_EMAIL, 
  formatItemsList, 
  generateAdminEmailHtml, 
  generateCustomerEmailHtml 
} from "./emailTemplates.ts";

export const sendOrderEmails = async (
  orderData: OrderData,
  apiKey: string
) => {
  const { customer, items, subtotal, recipientEmail, orderId, orderDate } = orderData;
  
  // Use the provided recipient email or fallback to theperfectshoppe6@gmail.com if not provided
  const adminEmail = recipientEmail || "theperfectshoppe6@gmail.com";
  
  // Format items for email display
  const itemsList = formatItemsList(items);

  const resend = new Resend(apiKey);
  
  // 1. Send notification email to administrator
  console.log("Sending admin notification email to:", adminEmail);
  const adminEmailResponse = await resend.emails.send({
    from: SENDER_EMAIL,
    to: [adminEmail],
    subject: `New Order #${orderId} from ${customer.firstName} ${customer.lastName}`,
    html: generateAdminEmailHtml(customer, itemsList, subtotal, orderId, orderDate),
  });
  
  console.log("Admin notification email sent successfully:", adminEmailResponse);
  
  // 2. Send confirmation email to customer
  console.log("Sending confirmation email to customer:", customer.email);
  const customerEmailResponse = await resend.emails.send({
    from: SENDER_EMAIL,
    to: [customer.email],
    subject: `Your order #${orderId} has been received - The Perfect Shoppe`,
    html: generateCustomerEmailHtml(customer, itemsList, subtotal, orderId, orderDate),
  });
  
  console.log("Customer confirmation email sent successfully:", customerEmailResponse);

  return {
    adminEmail: adminEmailResponse,
    customerEmail: customerEmailResponse
  };
};
