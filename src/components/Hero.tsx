
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        delay: 0.5 
      }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  const rotatingVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity
      }
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
    <section className="relative bg-gradient-to-br from-brand-purple to-purple-800 text-white overflow-hidden gradient-animate">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-20 bg-cover bg-center"></div>
      
      {/* Decorative elements - now with motion */}
      <motion.div 
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-brand-gold/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.5, duration: 1.5 }}
        variants={floatingVariants}
      />
      
      <motion.div 
        className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full bg-brand-gold/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1, duration: 1.5 }}
        variants={floatingVariants}
      />
      
      <motion.div 
        className="absolute top-1/3 right-10 w-24 h-24 rounded-full bg-brand-gold/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        variants={floatingVariants}
      />
      
      <motion.div 
        className="absolute top-40 right-1/4 w-32 h-32 rounded-full border-2 border-brand-purple/10"
        variants={rotatingVariants}
        initial="initial"
        animate="animate"
      />
      
      <motion.div 
        className="absolute bottom-40 left-20 w-40 h-40 rounded-full border-2 border-brand-purple/10"
        variants={rotatingVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: "2s" }}
      />
      
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
                <Button variant="outline" className="border-white text-white hover:bg-white/10 transform transition-all duration-300 hover-glow">
                  Contact Us
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Floating sparkle icon with motion */}
        <motion.div 
          className="absolute top-1/4 right-1/4"
          variants={floatingVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <Sparkles className="h-8 w-8 text-brand-gold" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Wave decoration at the bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320" 
          className="w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <path fill="#ffffff" fillOpacity="1" d="M0,224L48,218.7C96,213,192,203,288,202.7C384,203,480,213,576,229.3C672,245,768,267,864,266.7C960,267,1056,245,1152,234.7C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </motion.svg>
      </div>
    </section>
  );
};

export default Hero;
