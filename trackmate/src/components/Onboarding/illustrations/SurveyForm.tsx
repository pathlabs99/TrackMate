import React from 'react';
import { motion } from 'framer-motion';

const SurveyForm: React.FC = () => {
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
        fill="#fff"
        stroke="#333"
        strokeWidth="8"
        initial={{ y: -300 }}
        animate={{ y: 40 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
      />

      {/* Survey elements */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* Title */}
        <motion.text
          x="150"
          y="80"
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Survey
        </motion.text>

        {/* Checkbox question */}
        <motion.g
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <rect
            x="95"
            y="100"
            width="20"
            height="20"
            fill="none"
            stroke="#ddd"
            strokeWidth="2"
          />
          <motion.path
            d="M98 110 L105 117 L115 103"
            stroke="rgb(255, 99, 71)"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.2 }}
          />
          <motion.line
            x1="125"
            y1="110"
            x2="205"
            y2="110"
            stroke="#ddd"
            strokeWidth="2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.1 }}
          />
        </motion.g>

        {/* Emoji ratings */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[
            { x: 110, mood: '☹️' },
            { x: 150, mood: '😐' },
            { x: 190, mood: '😊' }
          ].map((emoji, i) => (
            <motion.g
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5 + i * 0.2 }}
            >
              <text
                x={emoji.x}
                y="160"
                fontSize="24"
                textAnchor="middle"
                style={{ cursor: 'pointer' }}
              >
                {emoji.mood}
              </text>
              {emoji.mood === '😊' && (
                <motion.circle
                  cx={emoji.x}
                  cy="160"
                  r="15"
                  fill="none"
                  stroke="rgb(255, 99, 71)"
                  strokeWidth="2"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 2.2 }}
                />
              )}
            </motion.g>
          ))}
        </motion.g>

        {/* Submit button */}
        <motion.g
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <rect
            x="95"
            y="200"
            width="110"
            height="40"
            rx="20"
            fill="rgb(255, 99, 71)"
          />
          <text
            x="150"
            y="225"
            fontSize="16"
            fill="white"
            textAnchor="middle"
          >
            Submit
          </text>
        </motion.g>
      </motion.g>
    </motion.svg>
  );
};

export default SurveyForm;
