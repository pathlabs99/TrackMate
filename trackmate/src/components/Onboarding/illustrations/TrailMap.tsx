import React from 'react';
import { motion } from 'framer-motion';

const TrailMap: React.FC = () => {
  return (
    <motion.svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background */}
      <rect x="0" y="0" width="300" height="300" fill="#FFF5EB" />
      
      {/* Ocean */}
      <motion.path
        d="M0 50 L100 50 L100 250 L0 250 Z"
        fill="#E6F3F8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />

      {/* Green areas */}
      <motion.path
        d="M90 40 Q120 60 110 100 T130 150 T110 200 T130 250"
        fill="#90BE6D"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Trail path */}
      <motion.path
        d="M100 40 Q130 60 120 100 T140 150 T120 200 T140 250"
        stroke="rgb(255, 99, 71)"
        strokeWidth="4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Cities */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.5 }}
      >
        <circle cx="100" cy="60" r="4" fill="#333" />
        <text x="110" y="65" fontSize="12">Perth</text>
        <circle cx="120" cy="240" r="4" fill="#333" />
        <text x="130" y="245" fontSize="12">Albany</text>
      </motion.g>

      {/* Route markers */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, staggerChildren: 0.1 }}
      >
        {[80, 120, 160, 200].map((y, i) => (
          <motion.circle
            key={i}
            cx="125"
            cy={y}
            r="2"
            fill="rgb(255, 99, 71)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2 + i * 0.1 }}
          />
        ))}
      </motion.g>
    </motion.svg>
  );
};

export default TrailMap;
