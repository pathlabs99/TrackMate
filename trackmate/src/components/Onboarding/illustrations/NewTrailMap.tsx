import React from 'react';
import { motion } from 'framer-motion';
import svgImage from './ChatGPT Image 1 apr. 2025 10_26_16.svg';

const NewTrailMap: React.FC = () => {
  return (
    <motion.div
      className="svg-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: '300px', height: '300px' }}
    >
      <img 
        src={svgImage} 
        alt="Trail Map"
        style={{ width: '100%', height: '100%' }}
      />
    </motion.div>
  );
};

export default NewTrailMap;
