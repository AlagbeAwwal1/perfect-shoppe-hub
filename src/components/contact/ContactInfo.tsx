
import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import BusinessHours from './BusinessHours';

const ContactInfo = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="bg-white p-8 rounded-lg shadow-sm h-full text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-2xl font-bold text-brand-purple mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Get in Touch
      </motion.h2>
      
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex flex-col items-center" variants={itemVariants}>
          <motion.div 
            className="bg-brand-purple/10 p-3 rounded-full mb-3"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(109, 76, 156, 0.2)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <MapPin className="h-6 w-6 text-white" />
          </motion.div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
            <p className="text-gray-600">24, Babatunde Fadiya St., Akute, Ogun State</p>
          </div>
        </motion.div>
        
        <motion.div className="flex flex-col items-center" variants={itemVariants}>
          <motion.div 
            className="bg-brand-purple/10 p-3 rounded-full mb-3"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(109, 76, 156, 0.2)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Phone className="h-6 w-6 text-white" />
          </motion.div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
            <p className="text-gray-600">+234 903 563 6061</p>
          </div>
        </motion.div>
        
        <motion.div className="flex flex-col items-center" variants={itemVariants}>
          <motion.div 
            className="bg-brand-purple/10 p-3 rounded-full mb-3"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(109, 76, 156, 0.2)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Mail className="h-6 w-6 text-white" />
          </motion.div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
            <p className="text-gray-600">faosiatolamide2017@gmail.com</p>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <BusinessHours />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ContactInfo;
