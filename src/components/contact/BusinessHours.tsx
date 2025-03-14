
import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
};

const BusinessHours = () => {
  return (
    <div className="flex flex-col items-center">
      <motion.div 
        className="bg-brand-purple/10 p-3 rounded-full mb-3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Clock className="h-6 w-6 text-white" />
      </motion.div>
      <div className="text-center">
        <h3 className="font-semibold text-gray-800 mb-1">Business Hours</h3>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-1"
        >
          <motion.p variants={item} className="text-gray-600">Monday - Friday: 9am - 5pm</motion.p>
          <motion.p variants={item} className="text-gray-600">Saturday: 10am - 4pm</motion.p>
          <motion.p variants={item} className="text-gray-600">Sunday: Closed</motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessHours;
