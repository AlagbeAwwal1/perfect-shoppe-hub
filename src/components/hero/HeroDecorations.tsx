
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const HeroDecorations: React.FC = () => {
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

  return (
    <>
      {/* Decorative elements with motion */}
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
    </>
  );
};

export default HeroDecorations;
