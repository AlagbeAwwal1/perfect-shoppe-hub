
import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Edit, Eye, RotateCcw, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrdersFromDB, updateOrderStatus } from '@/data/supabaseOrders';
import { Order, OrderStatus } from '@/types/order';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const statusStyles = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500',
  canceled: 'bg-red-500',
};

const OrdersManagement = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getOrdersFromDB,
    enabled: isAdmin,
    // Refresh orders data every 30 seconds
    refetchInterval: 30000,
    // Refetch when the component regains focus
    refetchOnWindowFocus: true,
  });

  // Set up a real-time listener for new orders
  useEffect(() => {
    if (!isAdmin) return;
    
    console.log('Setting up real-time listener for orders table');
    
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Order table change detected:', payload);
          // Invalidate and refetch orders when any change happens
          queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up orders real-time listener');
      supabase.removeChannel(channel);
    };
  }, [isAdmin, queryClient]);

  // Function to send email notification about order status change
  const sendStatusUpdateEmail = async (order: Order, newStatus: OrderStatus) => {
    try {
      console.log(`Sending status update email for order ${order.id}`);
      
      // Call the Supabase Edge Function to send the email
      const { data, error } = await supabase.functions.invoke('send-order-notification', {
        body: {
          orderId: order.id,
          customerName: `${order.customer.firstName} ${order.customer.lastName}`,
          customerEmail: order.customer.email,
          status: newStatus,
          items: order.items.map(item => ({
            name: item.product_name,
            price: item.product_price,
            quantity: item.quantity
          })),
          total: order.total,
          // Add additional data for notification
          notificationType: 'status-update',
          previousStatus: order.status
        }
      });

      if (error) {
        console.error('Error sending status update email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      console.log('Status update email sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in sendStatusUpdateEmail:', error);
      throw error;
    }
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status, order }: { orderId: string; status: OrderStatus; order: Order }) => {
      // First update the order status in the database
      await updateOrderStatus(orderId, status);
      
      // Then send the email notification about the status change
      // Only send if the status actually changed
      if (order.status !== status) {
        await sendStatusUpdateEmail(order, status);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({
        title: 'Status updated',
        description: 'Order status has been updated successfully and notification email sent.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to update order status: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    // Find the order in the orders array
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast({
        title: 'Error',
        description: 'Order not found.',
        variant: 'destructive',
      });
      return;
    }
    
    updateStatusMutation.mutate({ orderId, status, order });
  };

  // Function to manually send order report email
  const sendOrderReport = async (order: Order) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-order-notification', {
        body: {
          orderId: order.id,
          customerName: `${order.customer.firstName} ${order.customer.lastName}`,
          customerEmail: order.customer.email,
          status: order.status,
          items: order.items.map(item => ({
            name: item.product_name,
            price: item.product_price,
            quantity: item.quantity
          })),
          total: order.total,
          notificationType: 'report',
        }
      });

      if (error) {
        throw new Error(`Failed to send report: ${error.message}`);
      }

      toast({
        title: 'Report Sent',
        description: 'Order report has been sent to your email.',
      });
    } catch (error) {
      console.error('Error sending order report:', error);
      toast({
        title: 'Error',
        description: `Failed to send order report: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <Button onClick={() => refetch()} size="sm" variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading orders...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              Error loading orders. Please try again.
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-4">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: Order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        {order.customer.firstName} {order.customer.lastName}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>₦{order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value: OrderStatus) => 
                            handleStatusChange(order.id, value)
                          }
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue>
                              <Badge className={statusStyles[order.status]}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="canceled">Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => sendOrderReport(order)}
                            title="Send order report"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Link to={`/admin/orders/${order.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersManagement;
