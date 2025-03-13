
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link to={`/products/${product.id}`} className="product-card block group">
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
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-brand-purple transition-colors">{product.name}</h3>
        <p className="text-brand-gold font-bold mb-2">₦{product.price.toLocaleString()}</p>
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
