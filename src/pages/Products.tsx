
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { products, Product } from '@/data/products';
import { getAllProducts, getProductsByCategoryFromDB } from '@/data/supabaseProducts';
import ProductCard from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query';

const Products = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Get category from URL if present
  const params = new URLSearchParams(location.search);
  const categoryParam = params.get('category');
  
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('all');
    }
  }, [location.search]);
  
  // Fetch products from DB based on active category
  const { data: filteredProducts, isLoading, error } = useQuery({
    queryKey: ['products', activeCategory],
    queryFn: async () => {
      try {
        if (activeCategory === 'all') {
          return await getAllProducts();
        } else {
          return await getProductsByCategoryFromDB(activeCategory);
        }
      } catch (error) {
        console.error('Error fetching products from DB:', error);
        // Fallback to static data if DB fetch fails
        if (activeCategory === 'all') {
          return products;
        } else {
          return products.filter((product) => product.category === activeCategory);
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const filterByCategory = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-brand-purple mb-4">Our Products</h1>
          <div className="w-20 h-1 bg-brand-gold mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our collection of high-quality Islamic wear and accessories designed for modern Muslims.
          </p>
        </div>
        
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => filterByCategory('all')}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === 'all'
                ? 'bg-brand-purple text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } transition-colors`}
          >
            All Products
          </button>
          <button
            onClick={() => filterByCategory('scarf')}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === 'scarf'
                ? 'bg-brand-purple text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } transition-colors`}
          >
            Scarves
          </button>
          <button
            onClick={() => filterByCategory('khimar')}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === 'khimar'
                ? 'bg-brand-purple text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } transition-colors`}
          >
            Khimars
          </button>
          <button
            onClick={() => filterByCategory('prayer')}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === 'prayer'
                ? 'bg-brand-purple text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } transition-colors`}
          >
            Prayer Essentials
          </button>
          <button
            onClick={() => filterByCategory('accessory')}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === 'accessory'
                ? 'bg-brand-purple text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } transition-colors`}
          >
            Accessories
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load products. Please try again later.</p>
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
