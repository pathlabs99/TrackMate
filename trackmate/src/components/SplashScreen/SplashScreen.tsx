import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../assets/onboarding/Logo.svg';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
  isVisible: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, isVisible }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isVisible) {
        onComplete();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete, isVisible]);

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
