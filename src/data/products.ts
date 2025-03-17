
export type ProductCategory = 'scarf' | 'khimar' | 'accessory' | 'prayer' | 'other';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  image: string;
  featured: boolean;
  images?: string[]; // Array of image URLs
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Shadow Jersey Scarf',
    price: 5200,
    description: 'Elegant shadow jersey scarf with premium quality fabric. Perfect for everyday wear.',
    image: '/placeholder.svg',
    category: 'scarf',
    featured: true
  },
  {
    id: '2',
    name: 'UAE Jersey Scarf',
    price: 4500,
    description: 'High-quality UAE jersey scarf. Comfortable and stylish for daily use.',
    image: '/placeholder.svg',
    category: 'scarf',
    featured: false
  },
  {
    id: '3',
    name: 'Plain Chiffon Scarf',
    price: 3000,
    description: 'Lightweight plain chiffon scarf in multiple colors. Breathable and elegant.',
    image: '/placeholder.svg',
    category: 'scarf',
    featured: true
  },
  {
    id: '4',
    name: 'Hoodie Khimar',
    price: 10000,
    description: 'Comfortable hoodie khimar made with premium fabric. Practical and modest design.',
    image: '/placeholder.svg',
    category: 'khimar',
    featured: false
  },
  {
    id: '5',
    name: 'Egyptian Tieback Khimar',
    price: 10000,
    description: 'Traditional Egyptian tieback khimar. Elegant design with convenient tie-back feature.',
    image: '/placeholder.svg',
    category: 'khimar',
    featured: true
  },
  {
    id: '6',
    name: 'Lace Khimar',
    price: 10000,
    description: 'Beautiful lace khimar with intricate details. Perfect for special occasions.',
    image: '/placeholder.svg',
    category: 'khimar',
    featured: false
  },
  {
    id: '7',
    name: 'Ombre Chiffon Scarf',
    price: 3500,
    description: 'Stylish ombre chiffon scarf with gradual color transition. Light and flowy.',
    image: '/placeholder.svg',
    category: 'scarf',
    featured: false
  },
  {
    id: '8',
    name: 'LED Digital Counter',
    price: 6000,
    description: 'Digital LED counter for tracking tasbeeh counts. Easy to use with rechargeable battery.',
    image: '/placeholder.svg',
    category: 'accessory',
    featured: false
  },
  {
    id: '9',
    name: 'Manual Counter',
    price: 1000,
    description: 'Simple manual counter for tasbeeh. Portable and durable design.',
    image: '/placeholder.svg',
    category: 'accessory',
    featured: false
  },
  {
    id: '10',
    name: 'Prayer Rug',
    price: 9000,
    description: 'Premium quality prayer rug with comfortable padding. Beautiful design.',
    image: '/placeholder.svg',
    category: 'prayer',
    featured: true
  },
  {
    id: '11',
    name: 'Quran',
    price: 6500,
    description: 'Beautiful Quran with clear print and quality binding. Available in different sizes.',
    image: '/placeholder.svg',
    category: 'prayer',
    featured: false
  },
  {
    id: '12',
    name: 'Inner Cap',
    price: 1000,
    description: 'Comfortable inner cap to wear under hijab. Soft fabric that stays in place.',
    image: '/placeholder.svg',
    category: 'accessory',
    featured: false
  }
];

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (category: Product['category']): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
