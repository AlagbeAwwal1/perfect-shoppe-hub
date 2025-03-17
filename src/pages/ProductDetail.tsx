
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '@/data/products';
import { getProductByIdFromDB } from '@/data/supabaseProducts';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useQuery } from '@tanstack/react-query';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
  
  // Handle thumbnail click
  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
    setImageError(false);
  };

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
          <div className="space-y-4">
            {/* Carousel implementation */}
            <Carousel className="w-full max-w-lg mx-auto">
              <CarouselContent>
                {productImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="bg-gray-100 rounded-lg overflow-hidden h-80 md:h-[500px] flex items-center justify-center p-2">
                      <img 
                        src={image} 
                        alt={`${product.name} - view ${index + 1}`}
                        className="w-full h-full object-contain object-center"
                        onError={(e) => {
                          console.error(`Failed to load image: ${image}`);
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {productImages.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 md:-left-12" />
                  <CarouselNext className="right-2 md:-right-12" />
                </>
              )}
            </Carousel>
            
            {/* Thumbnails for quick navigation */}
            {productImages.length > 1 && (
              <div className="flex overflow-x-auto space-x-2 pb-2 mt-4">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 border-2 rounded-md overflow-hidden h-20 w-20 ${
                      index === currentImageIndex ? 'border-brand-purple' : 'border-gray-200'
                    }`}
                    onClick={() => selectImage(index)}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - thumbnail ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
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
