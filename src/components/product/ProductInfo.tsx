
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import ProductQuantitySelector from './ProductQuantitySelector';

interface ProductInfoProps {
  product: Product;
  quantity: number;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  onAddToCart: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ 
  product, 
  quantity, 
  incrementQuantity, 
  decrementQuantity, 
  onAddToCart 
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
      <div className="mb-6">
        <p className="text-2xl font-bold text-brand-purple">₦{product.price.toLocaleString()}</p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-600">{product.description}</p>
      </div>
      
      <div className="mb-6">
        <ProductQuantitySelector 
          quantity={quantity}
          onIncrement={incrementQuantity}
          onDecrement={decrementQuantity}
        />
      </div>
      
      <div className="space-y-4">
        <Button 
          className="w-full bg-brand-purple text-white hover:bg-brand-purple/90"
          onClick={onAddToCart}
        >
          Add to Cart
        </Button>
        
        <Button 
          variant="outline"
          className="w-full"
          onClick={() => {
            onAddToCart();
            navigate('/cart');
          }}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
