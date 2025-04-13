/**
 * @fileoverview Splash screen component for the TrackMate mobile app.
 * @author Marwa
 * @date 2025-04-13
 * @filename SplashScreen.tsx
 *
 * This file contains the SplashScreen component which displays a branded
 * loading screen with animation when the application first launches.
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../assets/onboarding/Logo.svg';
import './SplashScreen.css';

/**
 * Interface for SplashScreen component props
 */
interface SplashScreenProps {
  /** Callback function to execute when splash screen animation completes */
  onComplete: () => void;
  /** Boolean flag to control visibility of the splash screen */
  isVisible: boolean;
}

/**
 * SplashScreen component that displays an animated splash screen
 * when the application first launches
 * 
 * @param onComplete - Callback function to execute when animation completes
 * @param isVisible - Boolean flag to control visibility of the splash screen
 */
const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, isVisible }) => {
  /**
   * Effect hook to handle the splash screen timing and cleanup
   */
  useEffect(() => {
    // Set a timer to trigger the onComplete callback after 2 seconds
    const timer = setTimeout(() => {
      if (isVisible) {
        onComplete();
      }
    }, 2000);

    // Cleanup function to clear the timeout when component unmounts
    return () => clearTimeout(timer);
  }, [onComplete, isVisible]);

  /**
   * Animation variants for the container background
   */
  const containerVariants = {
    initial: { 
      opacity: 1,
      background: 'linear-gradient(135deg, rgb(255, 99, 71) 0%, rgb(255, 71, 89) 100%)'
    },
    exit: { 
      opacity: 0,
      background: 'linear-gradient(135deg, rgb(255, 99, 71) 0%, rgb(255, 71, 89) 100%)',
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  /**
   * Animation variants for the logo element
   */
  const logoVariants = {
    initial: { 
      scale: 0.8,
      opacity: 0,
      rotate: -10
    },
    animate: { 
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1]
      }
    },
    exit: { 
      scale: 1.2,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="splash-container"
          variants={containerVariants}
          initial="initial"
          animate="initial"
          exit="exit"
        >
          <motion.div
            className="logo-container"
            variants={logoVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <img src={Logo} alt="TrackMate Logo" className="logo" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
