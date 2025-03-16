
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import HeroDecorations from './hero/HeroDecorations';
import HeroContent from './hero/HeroContent';

const Hero: React.FC = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      transition: {
        delay: 0.3,
        staggerChildren: 0.2
      }
    });
  }, [controls]);

  return (
    <section className="relative bg-gradient-to-br from-brand-purple to-purple-800 text-white overflow-hidden gradient-animate">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-20 bg-cover bg-center"></div>
      
      {/* Decorative elements */}
      <HeroDecorations />
      
      {/* Main content */}
      <HeroContent />
    </section>
  );
};

export default Hero;
