
import React from 'react';
import { Check, AlertCircle, Info, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { jsPDF } from 'jspdf';
import { useCart } from '@/contexts/CartContext';

interface OrderSuccessProps {
  emailStatus: 'success' | 'limited' | 'failed' | null;
  customerEmail: string;
  orderDetails: {
    customer: {
      firstName: string;
      lastName: string;
      email: string;
      address: string;
      city: string;
      state: string;
      phoneNumber: string;
    };
    items: any[];
    subtotal: number;
    orderId: string;
    orderDate: string;
  };
}

const OrderSuccess = ({ emailStatus, customerEmail, orderDetails }: OrderSuccessProps) => {
  const navigate = useNavigate();
  
  const generateReceipt = () => {
    const doc = new jsPDF();
    
    // Add receipt header
    doc.setFontSize(22);
    doc.setTextColor(107, 33, 168); // Purple color
    doc.text("The Perfect Shoppe", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Order Receipt", 105, 30, { align: "center" });
    
    // Add order details
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderDetails.orderId}`, 20, 45);
    doc.text(`Date: ${orderDetails.orderDate}`, 20, 55);
    
    // Add customer details
    doc.setFontSize(14);
    doc.text("Customer Information", 20, 70);
    doc.setFontSize(12);
    doc.text(`Name: ${orderDetails.customer.firstName} ${orderDetails.customer.lastName}`, 20, 80);
    doc.text(`Email: ${orderDetails.customer.email}`, 20, 90);
    doc.text(`Phone: ${orderDetails.customer.phoneNumber}`, 20, 100);
    doc.text(`Address: ${orderDetails.customer.address}`, 20, 110);
    doc.text(`City: ${orderDetails.customer.city}, ${orderDetails.customer.state}`, 20, 120);
    
    // Add order items
    doc.setFontSize(14);
    doc.text("Order Items", 20, 140);
    
    // Create table header
    doc.setFontSize(12);
    doc.text("Item", 20, 150);
    doc.text("Qty", 100, 150);
    doc.text("Price", 130, 150);
    doc.text("Total", 170, 150);
    
    // Add horizontal line
    doc.line(20, 153, 190, 153);
    
    // Add items
    let yPos = 160;
    orderDetails.items.forEach((item) => {
      doc.text(item.product.name, 20, yPos);
      doc.text(item.quantity.toString(), 100, yPos);
      doc.text(`₦${item.product.price.toLocaleString()}`, 130, yPos);
      doc.text(`₦${(item.product.price * item.quantity).toLocaleString()}`, 170, yPos);
      yPos += 10;
    });
    
    // Add total
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text("Total:", 130, yPos);
    doc.text(`₦${orderDetails.subtotal.toLocaleString()}`, 170, yPos);
    
    // Add footer
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text("Thank you for shopping with The Perfect Shoppe!", 105, yPos + 20, { align: "center" });
    
    // Save the PDF
    doc.save(`receipt-${orderDetails.orderId}.pdf`);
  };
  
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6 text-center">Thank you for your purchase. We've received your order and will process it shortly.</p>
          
          {emailStatus === 'limited' && (
            <Alert className="mb-6" variant="default">
              <Info className="h-4 w-4" />
              <AlertTitle>Email Delivery Notice</AlertTitle>
            </Alert>
          )}
          
          {emailStatus === 'failed' && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Email Delivery Issue</AlertTitle>
              <AlertDescription>
                Your order has been placed successfully, but we couldn't send a confirmation email.
                Please download your receipt using the button below.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button 
              className="flex items-center gap-2 bg-brand-purple text-white hover:bg-brand-purple/90"
              onClick={generateReceipt}
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            
            <Button 
              className="bg-brand-purple text-white hover:bg-brand-purple/90"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
