import React from 'react';
import { motion } from 'framer-motion';

const QRScanner: React.FC = () => {
  return (
    <motion.svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Phone outline */}
      <motion.rect
        x="75"
        y="40"
        width="150"
        height="220"
        rx="20"
        fill="none"
        stroke="#333"
        strokeWidth="8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Screen */}
      <motion.rect
        x="85"
        y="50"
        width="130"
        height="200"
        rx="10"
        fill="#fff"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      />

      {/* QR Code scanning frame */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <rect
          x="105"
          y="90"
          width="90"
          height="90"
          fill="none"
          stroke="rgb(255, 99, 71)"
          strokeWidth="4"
        />
        
        {/* Scanning line */}
        <motion.line
          x1="105"
          y1="120"
          x2="195"
          y2="120"
          stroke="rgb(255, 99, 71)"
          strokeWidth="2"
          initial={{ y1: 90, y2: 90 }}
          animate={{ y1: 180, y2: 180 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.g>

      {/* Corner markers */}
      {[
        { x: 105, y: 90 },
        { x: 195, y: 90 },
        { x: 105, y: 180 },
        { x: 195, y: 180 }
      ].map((pos, i) => (
        <motion.path
          key={i}
          d={`M${pos.x-10},${pos.y} L${pos.x},${pos.y} L${pos.x},${pos.y+10}`}
          stroke="rgb(255, 99, 71)"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.2 + i * 0.1 }}
        />
      ))}
    </motion.svg>
  );
};

export default QRScanner;
