
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '@/data/products';
import { getProductByIdFromDB } from '@/data/supabaseProducts';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useQuery } from '@tanstack/react-query';
import ProductImageCarousel from '@/components/product/ProductImageCarousel';
import ProductInfo from '@/components/product/ProductInfo';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
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
  
  // Create an array of images for the carousel
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

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
          <ProductImageCarousel 
            images={productImages}
            productName={product.name}
          />
          
          <ProductInfo 
            product={product}
            quantity={quantity}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
