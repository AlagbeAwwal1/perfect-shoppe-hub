
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroContent: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 50, delay: 0.3 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
      <motion.div 
        className="max-w-2xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
          variants={itemVariants}
        >
          Modest Fashion <br/>
          <motion.span 
            className="text-brand-gold drop-shadow-md shimmer"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
          >
            Elegantly Crafted
          </motion.span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl mb-8 text-gray-200"
          variants={itemVariants}
        >
          Discover our premium collection of Islamic wear that combines modesty with contemporary style and comfort.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          variants={fadeInUpVariants}
        >
          <Link to="/products">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-gradient-to-r from-brand-gold to-yellow-500 text-black hover:from-yellow-500 hover:to-brand-gold shadow-lg hover:shadow-xl transform transition-all duration-300 group">
                Browse Collection
                <ShoppingBag className="ml-2 h-4 w-4 group-hover:animate-pulse" />
              </Button>
            </motion.div>
          </Link>
          
          <Link to="/contact">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="border-white text-brand-purple hover:bg-white/10 hover:text-white transform transition-all duration-300 hover-glow">
                Contact Us
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroContent;
