
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategorySection from '@/components/CategorySection';
import { ShoppingBag, Star, Truck } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Index = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <div>
      <Hero />
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.div 
              className="flex flex-col items-center text-center p-6 hover:shadow-lg rounded-lg transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <motion.div 
                className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-4"
                variants={iconVariants}
              >
                <ShoppingBag className="h-8 w-8 text-brand-purple" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">We use only high-quality materials for all our products.</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center p-6 hover:shadow-lg rounded-lg transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <motion.div 
                className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-4"
                variants={iconVariants}
              >
                <Star className="h-8 w-8 text-brand-purple" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Modest Design</h3>
              <p className="text-gray-600">Our designs respect Islamic values while staying fashionable.</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center p-6 hover:shadow-lg rounded-lg transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <motion.div 
                className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-4"
                variants={iconVariants}
              >
                <Truck className="h-8 w-8 text-brand-purple" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">We offer nationwide shipping with tracking options.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      <FeaturedProducts />
      <CategorySection />
    </div>
  );
};

export default Index;
