/**
 * @fileoverview Splash screen component for the TrackMate mobile app.
 * @author Marwa
 * @module components/SplashScreen
 * @description This component displays a branded loading screen when the application
 * first launches, featuring the TrackMate logo and a smooth fade-out animation.
 * 
 * @note Developer Handover
 * The following can be customized:
 * 1. Visual Elements
 *    - Logo can be updated in assets/onboarding/Logo.svg
 *    - Animation styles can be modified in SplashScreen.css
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../assets/onboarding/Logo.svg';
import './SplashScreen.css';

/**
 * @interface SplashScreenProps
 * @description Props for configuring the splash screen behavior
 */
interface SplashScreenProps {
  /** Function called when splash screen animation completes */
  onComplete: () => void;
  /** Controls visibility of the splash screen */
  isVisible: boolean;
}

/**
 * @component SplashScreen
 * @description Displays an animated splash screen on app launch
 * Features include:
 * - Centered logo display
 * - Timed auto-dismiss
 * - Fade-out animation
 * 
 * @param {object} props - Component props
 * @param {Function} props.onComplete - Called when animation finishes
 * @param {boolean} props.isVisible - Controls component visibility
 * @returns {JSX.Element} Animated splash screen component
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
