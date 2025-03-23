
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Define the recipient email - this can be easily changed here
const RECIPIENT_EMAIL = "theperfectshoppe6@gmail.com";
// Define the sender email - this can be easily changed here
const SENDER_EMAIL = "Contact Form <onboarding@resend.dev>";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
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
    let formData: ContactFormData;
    try {
      formData = JSON.parse(bodyText);
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
    const apiKey = Deno?.env?.get("RESEND_API__KEY");
    if (!apiKey) {
      console.error("RESEND_API__KEY environment variable is not set");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "RESEND_API__KEY is not set - Please set this in the Supabase Edge Function secrets" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { name, email, subject, message } = formData;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      const missingFields: string[] = [];
      if (!name) missingFields.push("name");
      if (!email) missingFields.push("email");
      if (!subject) missingFields.push("subject");
      if (!message) missingFields.push("message");
      
      console.error("Missing required fields:", missingFields);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Sending email with data:", { name, email, subject });

    const resend = new Resend(apiKey);
    const emailResponse = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [RECIPIENT_EMAIL], // Using the constant defined at the top
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h2>Message:</h2>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    // Log detailed error information
    if (error instanceof Error) {
      console.error("Error in send-contact-email function:", error);
      console.error("Error stack:", error.stack);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          stack: error.stack 
        }),
      );
    } else {
      console.error("Unknown error in send-contact-email function:", error);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Unknown error occurred",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  }
};

serve(handler);
