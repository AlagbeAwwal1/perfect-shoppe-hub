
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { items, clearCart, totalItems, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="py-12 page-container">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <div className="mb-6 animate-float">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4 animate-fade-in delay-200">Your cart is empty</h1>
          <p className="text-gray-600 mb-8 animate-fade-in delay-300">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products">
            <Button className="bg-brand-purple text-white hover:bg-brand-purple/90 animate-fade-in delay-400 hover-lift">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 page-container">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8 animate-fade-in">
          <ShoppingCart className="h-6 w-6 text-brand-purple mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
        </div>
        
        {/* Decorative elements */}
        <div className="relative">
          <div className="decorative-dot top-0 right-20 w-16 h-16 opacity-20" style={{ animationDelay: "0.7s" }}></div>
          <div className="decorative-circle bottom-40 left-10 w-24 h-24 opacity-20" style={{ animationDelay: "1.5s" }}></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="md:col-span-2 animate-slide-in-left">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <li key={item.product.id} className="py-6 stagger-item-appear" style={{ animationDelay: `${index * 100 + 200}ms` }}>
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
                className="animate-fade-in delay-300 hover-lift"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 animate-fade-in delay-400 hover-lift"
              >
                Clear Cart
              </Button>
            </div>
          </div>
          
          <div className="md:col-span-1 animate-slide-in-right">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 card-animated">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="border-t border-gray-200 py-4">
                <div className="flex justify-between mb-2 animate-fade-in delay-200">
                  <p>Subtotal ({totalItems} items)</p>
                  <p>₦{subtotal.toLocaleString()}</p>
                </div>
                <div className="flex justify-between mb-2 animate-fade-in delay-300">
                  <p>Shipping</p>
                  <p>Calculated at checkout</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 py-4">
                <div className="flex justify-between text-lg font-medium animate-fade-in delay-400">
                  <p>Total</p>
                  <p className="text-brand-purple">₦{subtotal.toLocaleString()}</p>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-brand-purple to-purple-700 hover:from-purple-700 hover:to-brand-purple text-white hover-lift animate-fade-in delay-500"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
              
              <div className="mt-4 text-center text-sm text-gray-500 animate-fade-in delay-600">
                <p>Secure checkout with trusted payment methods</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
