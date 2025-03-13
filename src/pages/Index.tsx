
import React from 'react';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategorySection from '@/components/CategorySection';
import { ShoppingBag, Star, Truck } from 'lucide-react';

const Index = () => {
  return (
    <div>
      <Hero />
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-brand-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">We use only high-quality materials for all our products.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-brand-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Modest Design</h3>
              <p className="text-gray-600">Our designs respect Islamic values while staying fashionable.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-brand-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">We offer nationwide shipping with tracking options.</p>
            </div>
          </div>
        </div>
      </section>
      
      <FeaturedProducts />
      <CategorySection />
    </div>
  );
};

export default Index;
