
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from './corsHeaders.ts';
import { sendEmail } from './emailService.ts';
import { 
  createOrderStatusUpdateTemplate, 
  createOrderReportTemplate,
  createOrderConfirmationTemplate 
} from './emailTemplates.ts';
import type { OrderItem, OrderNotificationPayload } from './types.ts';

console.log('Order notification function started.');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      orderId, 
      customerName, 
      customerEmail, 
      status, 
      items, 
      total, 
      notificationType,
      previousStatus 
    } = await req.json() as OrderNotificationPayload;

    console.log(`Processing ${notificationType} notification for order ${orderId}`);
    console.log('Order details:', { customerName, status, total, items });

    // Determine the email subject and template based on the notification type
    let subject = '';
    let htmlContent = '';
    
    if (notificationType === 'confirmation') {
      subject = `Order Confirmation - Order #${orderId.substring(0, 8)}`;
      htmlContent = createOrderConfirmationTemplate({
        orderId,
        customerName,
        items,
        total,
        status
      });
    } else if (notificationType === 'status-update') {
      subject = `Order Status Updated to ${status.toUpperCase()} - Order #${orderId.substring(0, 8)}`;
      htmlContent = createOrderStatusUpdateTemplate({
        orderId,
        customerName,
        items,
        total,
        status,
        previousStatus: previousStatus || 'unknown'
      });
    } else if (notificationType === 'report') {
      subject = `Order Report - Order #${orderId.substring(0, 8)}`;
      htmlContent = createOrderReportTemplate({
        orderId,
        customerName,
        items,
        total,
        status
      });
    } else {
      throw new Error(`Unknown notification type: ${notificationType}`);
    }

    console.log(`Sending ${notificationType} email with subject: ${subject}`);

    const emailResult = await sendEmail({
      to: 'theperfectshoppe6@gmail.com', // Always send to the business email
      subject,
      html: htmlContent,
    });

    console.log('Email sending result:', emailResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: `${notificationType} email sent successfully`,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in order notification function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unknown error occurred',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});
