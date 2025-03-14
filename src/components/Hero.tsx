
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight, ShoppingBag } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-brand-purple to-purple-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-20 bg-cover bg-center"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-brand-gold/20 animate-float" style={{ animationDelay: "0s" }}></div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full bg-brand-gold/10 animate-float" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/3 right-10 w-24 h-24 rounded-full bg-brand-gold/15 animate-float" style={{ animationDelay: "1.5s" }}></div>
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Modest Fashion <br/>
            <span className="text-brand-gold drop-shadow-md shimmer">Elegantly Crafted</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200 animate-slide-in-right" style={{ animationDelay: "200ms" }}>
            Discover our premium collection of Islamic wear that combines modesty with contemporary style and comfort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-right" style={{ animationDelay: "400ms" }}>
            <Link to="/products">
              <Button className="bg-gradient-to-r from-brand-gold to-yellow-500 text-black hover:from-yellow-500 hover:to-brand-gold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 group">
                Browse Collection
                <ShoppingBag className="ml-2 h-4 w-4 group-hover:animate-pulse" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 transform transition-all duration-300 hover:scale-105">
                Contact Us
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Wave decoration at the bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#ffffff" fillOpacity="1" d="M0,224L48,218.7C96,213,192,203,288,202.7C384,203,480,213,576,229.3C672,245,768,267,864,266.7C960,267,1056,245,1152,234.7C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
