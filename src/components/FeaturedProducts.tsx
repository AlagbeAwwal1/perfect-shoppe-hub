
import React from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '@/data/products';
import ProductCard from './ProductCard';
import { Button } from "@/components/ui/button";

const FeaturedProducts: React.FC = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="py-16 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl font-bold text-brand-purple mb-4">Featured Products</h2>
          <div className="w-20 h-1 bg-brand-gold mb-6"></div>
          <p className="text-gray-600 max-w-2xl">Discover our most popular Islamic wear and accessories, crafted with quality materials and elegant designs.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/products">
            <Button className="bg-brand-purple text-white hover:bg-brand-purple/90">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
