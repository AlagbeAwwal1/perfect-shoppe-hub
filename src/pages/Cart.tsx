
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { items, clearCart, totalItems, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products">
            <Button className="bg-brand-purple text-white hover:bg-brand-purple/90">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-gray-200">
                  {items.map(item => (
                    <li key={item.product.id} className="py-6">
                      <CartItem item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="text-red-500 hover:text-red-600"
              >
                Clear Cart
              </Button>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="border-t border-gray-200 py-4">
                <div className="flex justify-between mb-2">
                  <p>Subtotal ({totalItems} items)</p>
                  <p>₦{subtotal.toLocaleString()}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p>Shipping</p>
                  <p>Calculated at checkout</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 py-4">
                <div className="flex justify-between text-lg font-medium">
                  <p>Total</p>
                  <p>₦{subtotal.toLocaleString()}</p>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4 bg-brand-purple text-white hover:bg-brand-purple/90"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
