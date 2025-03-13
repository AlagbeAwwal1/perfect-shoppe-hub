
import React from 'react';

const About = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-brand-purple mb-4">About Us</h1>
          <div className="w-20 h-1 bg-brand-gold mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn about our journey and mission to provide high-quality Islamic wear.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold text-brand-purple mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              The Perfect Shoppe was founded in 2018 with a simple mission: to provide high-quality Islamic wear that combines modesty with contemporary style. Our founder, a Muslim entrepreneur, noticed a gap in the market for Islamic clothing that was both fashionable and faithful to Islamic principles.
            </p>
            <p className="text-gray-600 mb-4">
              What began as a small online store has grown into a trusted name in Islamic fashion, serving customers across Nigeria and beyond. Our commitment to quality, authenticity, and customer service has been the foundation of our growth.
            </p>
            <p className="text-gray-600">
              Today, we continue to expand our collection while staying true to our core values of modesty, quality, and accessibility.
            </p>
          </div>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt="Our story" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1 h-96 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt="Our mission" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl font-bold text-brand-purple mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              Our mission is to empower Muslims to express their faith through modest fashion without compromising on style or quality. We believe that Islamic wear should be accessible, comfortable, and beautifully crafted.
            </p>
            <p className="text-gray-600 mb-4">
              We are committed to sourcing the finest materials, working with skilled artisans, and ensuring ethical production processes. Every piece in our collection is designed with care and attention to detail.
            </p>
            <p className="text-gray-600">
              Through our products, we aim to foster a sense of pride and confidence in Islamic identity, helping our customers to embrace modesty as a beautiful expression of faith.
            </p>
          </div>
        </div>
        
        <div className="bg-brand-light p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-bold text-brand-purple mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-brand-purple mb-3">Quality</h3>
              <p className="text-gray-600">
                We never compromise on the quality of our products, using only the finest materials and craftsmanship.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-brand-purple mb-3">Modesty</h3>
              <p className="text-gray-600">
                All our designs adhere to Islamic principles of modesty while embracing contemporary styles.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-brand-purple mb-3">Integrity</h3>
              <p className="text-gray-600">
                We operate with transparency, honesty, and ethical business practices in all that we do.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
