
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ 
  images, 
  productName 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  // Handle thumbnail click
  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
    setImageError(false);
  };

  // Create an array of images for the carousel
  const productImages = images && images.length > 0 
    ? images 
    : ['/placeholder.svg'];

  return (
    <div className="space-y-4">
      {/* Carousel implementation */}
      <Carousel className="w-full max-w-lg mx-auto">
        <CarouselContent>
          {productImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="bg-gray-100 rounded-lg overflow-hidden h-80 md:h-[500px] flex items-center justify-center p-2">
                <img 
                  src={image} 
                  alt={`${productName} - view ${index + 1}`}
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
                alt={`${productName} - thumbnail ${index + 1}`}
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
  );
};

export default ProductImageCarousel;
