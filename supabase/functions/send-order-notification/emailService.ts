
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
  const { customer, items, subtotal, recipientEmail, orderId, orderDate, paymentReference } = orderData;
  
  // Always use theperfectshoppe6@gmail.com as the default recipient
  const adminEmail = "theperfectshoppe6@gmail.com";
  
  // Format items for email display
  const itemsList = formatItemsList(items);
  
  // Initialize response object
  const emailResults = {
    adminEmail: null,
    customerEmail: null,
    success: false
  };

  try {
    console.log("Initializing Resend with API key (length):", apiKey ? apiKey.length : "no key provided");
    const resend = new Resend(apiKey);
    
    // 1. Send notification email to administrator
    console.log("Sending admin notification email to:", adminEmail);
    try {
      const adminEmailResponse = await resend.emails.send({
        from: SENDER_EMAIL,
        to: [adminEmail],
        subject: `New Order #${orderId} from ${customer.firstName} ${customer.lastName}`,
        html: generateAdminEmailHtml(customer, itemsList, subtotal, orderId, orderDate, paymentReference),
      });
      
      console.log("Admin notification email response:", JSON.stringify(adminEmailResponse));
      emailResults.adminEmail = adminEmailResponse;
      
      if (adminEmailResponse.error) {
        console.error("Error sending admin email:", adminEmailResponse.error);
      } else {
        console.log("Admin notification email sent successfully to", adminEmail);
      }
    } catch (adminEmailError) {
      console.error("Exception sending admin email:", adminEmailError);
      emailResults.adminEmail = { error: adminEmailError.message };
    }
    
    // 2. Send confirmation email to customer
    console.log("Sending confirmation email to customer:", customer.email);
    try {
      const customerEmailResponse = await resend.emails.send({
        from: SENDER_EMAIL,
        to: [customer.email],
        subject: `Your order #${orderId} has been received - The Perfect Shoppe`,
        html: generateCustomerEmailHtml(customer, itemsList, subtotal, orderId, orderDate),
      });
      
      console.log("Customer email response:", JSON.stringify(customerEmailResponse));
      emailResults.customerEmail = customerEmailResponse;
      
      if (customerEmailResponse.error) {
        console.error("Error sending customer email:", customerEmailResponse.error);
      } else {
        console.log("Customer confirmation email sent successfully to", customer.email);
      }
    } catch (customerEmailError) {
      console.error("Exception sending customer email:", customerEmailError);
      emailResults.customerEmail = { error: customerEmailError.message };
    }
    
    // Consider the operation successful if at least we tried to send emails
    // Even if there are Resend errors, we want the order process to continue
    emailResults.success = true;
  } catch (error) {
    console.error("Fatal error in sendOrderEmails:", error);
    emailResults.success = false;
  }

  return emailResults;
};
