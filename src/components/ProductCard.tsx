
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const [imageError, setImageError] = useState(false);
  const animationDelay = `${index * 100}ms`;

  return (
    <Link 
      to={`/products/${product.id}`} 
      className="product-card block group stagger-item-appear"
      style={{ animationDelay }}
    >
      <div className="h-64 bg-gray-100 relative overflow-hidden rounded-lg">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">Image not available</span>
          </div>
        ) : (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
            onError={(e) => {
              console.error(`Failed to load image: ${product.image}`);
              setImageError(true);
            }}
          />
        )}
        
        {/* Add hover overlay with icon */}
        <div className="absolute inset-0 bg-brand-purple/0 group-hover:bg-brand-purple/20 transition-all duration-300 flex items-center justify-center">
          <div className="bg-brand-gold text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-brand-purple transition-colors">{product.name}</h3>
        <p className="text-brand-gold font-bold mb-2">₦{product.price.toLocaleString()}</p>
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
        
        {/* Animated underline on hover */}
        <div className="w-0 h-0.5 bg-brand-gold mt-2 transition-all duration-300 group-hover:w-full"></div>
      </div>
    </Link>
  );
};

export default ProductCard;
