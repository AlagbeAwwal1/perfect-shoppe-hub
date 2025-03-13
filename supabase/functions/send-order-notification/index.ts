
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Define the sender email
const SENDER_EMAIL = "Order Notification <onboarding@resend.dev>";

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface OrderData {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    phoneNumber: string;
  };
  items: OrderItem[];
  subtotal: number;
  recipientEmail: string; // Add recipient email to the interface
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log incoming request headers and body to debug
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    
    // Clone the request to read the body twice
    const clonedReq = req.clone();
    const bodyText = await clonedReq.text();
    console.log("Request body:", bodyText);
    
    // Parse the body as JSON - handle parsing errors explicitly
    let orderData: OrderData;
    try {
      orderData = JSON.parse(bodyText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError.message);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Invalid JSON in request body: ${parseError.message}` 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Get the API key
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY environment variable is not set");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "RESEND_API_KEY is not set - Please set this in the Supabase Edge Function secrets" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { customer, items, subtotal, recipientEmail } = orderData;
    
    // Use the provided recipient email or fallback to a default if not provided
    const toEmail = recipientEmail || "info@theperfectshoppe.com";
    
    // Format items for email display
    const itemsList = items.map(item => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.product.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">₦${item.product.price.toLocaleString()}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">₦${(item.product.price * item.quantity).toLocaleString()}</td>
      </tr>`
    ).join('');

    console.log("Sending email notification for order to:", toEmail);

    const resend = new Resend(apiKey);
    const emailResponse = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [toEmail],
      subject: `New Order from ${customer.firstName} ${customer.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6b21a8; text-align: center;">The Perfect Shoppe</h1>
          <h2 style="color: #333;">New Order Received</h2>
          
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
      `,
    });

    console.log("Email notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    // Log detailed error information
    console.error("Error in send-order-notification function:", error);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error occurred",
        stack: error.stack 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
