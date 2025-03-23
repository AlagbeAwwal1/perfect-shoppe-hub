
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { OrderData } from "./types.ts";
import { corsHeaders } from "./corsHeaders.ts";
import { sendOrderEmails } from "./emailService.ts";

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
    
    // Get the API key from environment variables
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY environment variable is not set");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "RESEND_API_KEY environment variable is not set" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    console.log("Using Resend API key from environment variable");
    
    // Force recipient email to be theperfectshoppe6@gmail.com
    console.log("Setting recipient email to theperfectshoppe6@gmail.com");
    orderData.recipientEmail = "theperfectshoppe6@gmail.com";
    
    // Send the emails
    const emailResults = await sendOrderEmails(orderData, apiKey);

    // Log email sending results
    console.log("Admin email result:", JSON.stringify(emailResults.adminEmail));
    console.log("Customer email result:", JSON.stringify(emailResults.customerEmail));

    // Return a success response even if emails had errors
    // This allows the order process to continue
    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: emailResults.adminEmail,
        customerEmail: emailResults.customerEmail
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
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
