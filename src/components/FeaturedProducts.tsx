
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '@/data/products';
import { getFeaturedProductsFromDB } from '@/data/supabaseProducts';
import ProductCard from './ProductCard';
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';

const FeaturedProducts: React.FC = () => {
  const { data: featuredProducts, isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      try {
        return await getFeaturedProductsFromDB();
      } catch (error) {
        console.error('Error fetching featured products from DB:', error);
        // Fallback to static data if DB fetch fails
        return getFeaturedProducts();
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <section className="py-16 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl font-bold text-brand-purple mb-4">Featured Products</h2>
          <div className="w-20 h-1 bg-brand-gold mb-6"></div>
          <p className="text-gray-600 max-w-2xl">Discover our most popular Islamic wear and accessories, crafted with quality materials and elegant designs.</p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading featured products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load featured products. Please try again later.</p>
          </div>
        ) : featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured products available at the moment.</p>
          </div>
        )}
        
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
