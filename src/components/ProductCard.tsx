
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`} className="product-card block">
      <div className="h-64 bg-gray-100 relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-brand-gold font-bold mb-2">₦{product.price.toLocaleString()}</p>
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
