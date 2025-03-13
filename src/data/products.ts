
export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'scarf' | 'khimar' | 'accessory' | 'prayer' | 'other';
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Shadow Jersey Scarf',
    price: 5200,
    description: 'Elegant shadow jersey scarf with premium quality fabric. Perfect for everyday wear.',
    image: '/lovable-uploads/1b0a00e0-ab3e-4542-8f78-29fae5c4442e.png',
    category: 'scarf',
    featured: true
  },
  {
    id: '2',
    name: 'UAE Jersey Scarf',
    price: 4500,
    description: 'High-quality UAE jersey scarf. Comfortable and stylish for daily use.',
    image: '/lovable-uploads/2487ee30-6654-433c-b1e8-01c9768a9318.png',
    category: 'scarf'
  },
  {
    id: '3',
    name: 'Plain Chiffon Scarf',
    price: 3000,
    description: 'Lightweight plain chiffon scarf in multiple colors. Breathable and elegant.',
    image: '/lovable-uploads/cc4342be-8419-45e2-9039-57437e3f7ca0.png',
    category: 'scarf',
    featured: true
  },
  {
    id: '4',
    name: 'Hoodie Khimar',
    price: 10000,
    description: 'Comfortable hoodie khimar made with premium fabric. Practical and modest design.',
    image: '/lovable-uploads/720c1e48-d793-4d75-934c-1d526853020d.png',
    category: 'khimar'
  },
  {
    id: '5',
    name: 'Egyptian Tieback Khimar',
    price: 10000,
    description: 'Traditional Egyptian tieback khimar. Elegant design with convenient tie-back feature.',
    image: '/lovable-uploads/33be1f5e-8f2d-4dce-862c-da484899dc05.png',
    category: 'khimar',
    featured: true
  },
  {
    id: '6',
    name: 'Lace Khimar',
    price: 10000,
    description: 'Beautiful lace khimar with intricate details. Perfect for special occasions.',
    image: '/lovable-uploads/b7ca1ca2-e597-4281-a2c6-19cf2e4b29d1.png',
    category: 'khimar'
  },
  {
    id: '7',
    name: 'Ombre Chiffon Scarf',
    price: 3500,
    description: 'Stylish ombre chiffon scarf with gradual color transition. Light and flowy.',
    image: '/lovable-uploads/7a54e8bd-7b53-48f2-b10f-d779237b9e09.png',
    category: 'scarf'
  },
  {
    id: '8',
    name: 'LED Digital Counter',
    price: 6000,
    description: 'Digital LED counter for tracking tasbeeh counts. Easy to use with rechargeable battery.',
    image: '/lovable-uploads/f7d2de27-1d73-483d-94ae-b9e0dbd8cc37.png',
    category: 'accessory'
  },
  {
    id: '9',
    name: 'Manual Counter',
    price: 1000,
    description: 'Simple manual counter for tasbeeh. Portable and durable design.',
    image: '/lovable-uploads/2e249e02-ec3e-44df-b37a-e2fdcd225208.png',
    category: 'accessory'
  },
  {
    id: '10',
    name: 'Prayer Rug',
    price: 9000,
    description: 'Premium quality prayer rug with comfortable padding. Beautiful design.',
    image: '/lovable-uploads/65187a7a-94cd-48f3-a5e3-c199c9d3b5e8.png',
    category: 'prayer',
    featured: true
  },
  {
    id: '11',
    name: 'Quran',
    price: 6500,
    description: 'Beautiful Quran with clear print and quality binding. Available in different sizes.',
    image: '/lovable-uploads/c605a6d2-1d9a-4779-85d3-070cc54c8c8a.png',
    category: 'prayer'
  },
  {
    id: '12',
    name: 'Inner Cap',
    price: 1000,
    description: 'Comfortable inner cap to wear under hijab. Soft fabric that stays in place.',
    image: '/lovable-uploads/4cd526ac-3f4b-477d-9f30-2773b541c0d1.png',
    category: 'accessory'
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
