import React from 'react';
import { motion } from 'framer-motion';

const FallenLog: React.FC = () => {
  return (
    <motion.svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background with trees */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Trees */}
        {[50, 150, 250].map((x, i) => (
          <motion.g
            key={i}
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <path
              d={`M${x} 120 L${x-30} 180 L${x+30} 180 Z`}
              fill="#90BE6D"
            />
            <rect
              x={x-5}
              y="180"
              width="10"
              height="20"
              fill="#6B4423"
            />
          </motion.g>
        ))}
      </motion.g>

      {/* Path */}
      <motion.path
        d="M50 200 C100 190, 200 210, 250 200"
        stroke="#D4A276"
        strokeWidth="20"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Fallen log */}
      <motion.g
        initial={{ x: -100, rotate: -20 }}
        animate={{ x: 0, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 50,
          delay: 1
        }}
      >
        <motion.path
          d="M100 160 L200 160"
          stroke="#8B4513"
          strokeWidth="25"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        />
        {/* Log details */}
        {[1, 2, 3, 4].map((_, i) => (
          <motion.path
            key={i}
            d={`M${120 + i * 20} 150 Q${120 + i * 20} 170, ${120 + i * 20} 170`}
            stroke="#6B4423"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2 + i * 0.1 }}
          />
        ))}
      </motion.g>

      {/* Warning exclamation marks */}
      {[
        { x: 80, y: 120 },
        { x: 150, y: 100 },
        { x: 220, y: 120 }
      ].map((pos, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.5 + i * 0.2 }}
        >
          <text
            x={pos.x}
            y={pos.y}
            fontSize="24"
            fill="rgb(255, 99, 71)"
            textAnchor="middle"
          >
            !
          </text>
        </motion.g>
      ))}
    </motion.svg>
  );
};

export default FallenLog;
