
import React from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Scarves',
    image: '/placeholder.svg',
    slug: 'scarf'
  },
  {
    id: '2',
    name: 'Khimars',
    image: '/placeholder.svg',
    slug: 'khimar'
  },
  {
    id: '3',
    name: 'Prayer Essentials',
    image: '/placeholder.svg',
    slug: 'prayer'
  },
  {
    id: '4',
    name: 'Accessories',
    image: '/placeholder.svg',
    slug: 'accessory'
  }
];

const CategorySection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl font-bold text-brand-purple mb-4">Shop by Category</h2>
          <div className="w-20 h-1 bg-brand-gold mb-6"></div>
          <p className="text-gray-600 max-w-2xl">Explore our carefully curated categories of Islamic wear and accessories.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="group relative overflow-hidden rounded-lg shadow-md h-64"
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg'; // Fallback image if loading fails
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                <span className="inline-block text-brand-gold font-semibold text-sm">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
