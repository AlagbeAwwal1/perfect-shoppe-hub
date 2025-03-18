
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useCheckout } from '@/hooks/useCheckout';

const CheckoutOrderSummary = () => {
  const { items, subtotal } = useCart();
  const { storeSettings } = useCheckout();
  const currency = storeSettings?.currency || '₦';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      
      <ul className="divide-y divide-gray-200">
        {items.map(item => (
          <li key={item.product.id} className="py-3 flex justify-between">
            <div>
              <span className="font-medium">{item.product.name}</span>
              <span className="text-gray-500 ml-2">x{item.quantity}</span>
            </div>
            <span>{currency}{(item.product.price * item.quantity).toLocaleString()}</span>
          </li>
        ))}
      </ul>
      
      <div className="border-t border-gray-200 py-4 mt-4">
        <div className="flex justify-between mb-2">
          <p>Subtotal</p>
          <p>{currency}{subtotal.toLocaleString()}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        {storeSettings?.taxRate > 0 && (
          <div className="flex justify-between mb-2">
            <p>Tax ({storeSettings.taxRate}%)</p>
            <p>{currency}{((subtotal * storeSettings.taxRate) / 100).toLocaleString()}</p>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 py-4">
        <div className="flex justify-between text-lg font-medium">
          <p>Total</p>
          <p>{currency}{storeSettings?.taxRate ? 
              (subtotal + (subtotal * storeSettings.taxRate / 100)).toLocaleString() : 
              subtotal.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOrderSummary;
