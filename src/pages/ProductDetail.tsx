
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '@/data/products';
import { getProductByIdFromDB } from '@/data/supabaseProducts';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useQuery } from '@tanstack/react-query';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const dbProduct = await getProductByIdFromDB(id);
        if (dbProduct) return dbProduct;
        
        // Fallback to static data if DB fetch fails
        return getProductById(id);
      } catch (error) {
        console.error('Error fetching product from DB:', error);
        return getProductById(id);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products">
          <Button>
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-brand-purple mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-100 rounded-lg overflow-hidden h-96 md:h-[500px]">
            {imageError ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">Image not available</span>
              </div>
            ) : (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  console.error(`Failed to load image: ${product.image}`);
                  setImageError(true);
                }}
              />
            )}
          </div>
          
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
              <div className="flex items-center mb-4">
                <span className="mr-4">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-none"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-none"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                className="w-full bg-brand-purple text-white hover:bg-brand-purple/90"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => {
                  handleAddToCart();
                  navigate('/cart');
                }}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
