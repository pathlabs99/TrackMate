/**
 * @fileoverview Onboarding screen component for the TrackMate mobile app.
 * @author Marwa
 * @module pages/Onboarding
 * @description A slideshow component that introduces new users to TrackMate's
 * key features through interactive, animated slides.
 * 
 * @note Developer Handover
 * The following can be customized:
 * 1. Slide Content
 *    - Modify onboardingData array to update content
 *    - Add/remove slides as needed
 * 2. Animations
 *    - Uses Framer Motion for transitions
 *    - Customize animation variants in code
 * 3. Styling
 *    - Styles defined in onboarding.css
 *    - Supports dark/light mode
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IonIcon } from "@ionic/react";
import {
  footsteps,
  qrCode,
  warning,
  chatbubbles,
} from "ionicons/icons";

// Import illustrations
import welcomeIllustration from '../../assets/onboarding/onboarding-welcome.png';
import scanIllustration from '../../assets/onboarding/onboarding-scan.png';
import reportIllustration from '../../assets/onboarding/onboarding-report.png';
import feedbackIllustration from '../../assets/onboarding/onboarding-feedback.png';

// Import styles
import "./onboarding.css";

/**
 * @interface OnboardingData
 * @description Data structure for each onboarding slide
 */
interface OnboardingData {
  /** Unique identifier for the slide */
  id: string;
  /** Main heading text */
  title: string;
  /** Secondary heading text */
  subtitle: string;
  /** Detailed slide description */
  description: string;
  /** Icon name from Ionicons */
  icon: string;
  /** Path to the illustration image */
  illustration: string;
}

/**
 * @constant onboardingData
 * @description Configuration for all onboarding slides
 * Each slide introduces a key feature of TrackMate
 * @type {OnboardingData[]}
 */
const onboardingData: OnboardingData[] = [
  {
    id: "welcome",
    title: "Welcome to TrackMate",
    subtitle: "Your guide along the Bibbulmun Track",
    description: "Whether it's a quick wander or the full 1000km trek, TrackMate keeps you on track, shares local stories, and helps you enjoy every step of your journey.",
    icon: footsteps,
    illustration: welcomeIllustration,
  },
  {
    id: "scan",
    title: "Scan QR Codes",
    subtitle: "Learn as you walk",
    description: "Scan codes along the trail to access local stories, safety tips, and information about nearby facilities when you need them most.",
    icon: qrCode,
    illustration: scanIllustration,
  },
  {
    id: "report",
    title: "Report Track Issues",
    subtitle: "Help us look after the track",
    description: "Spot a hazard or damaged sign? Take a photo and submit a quick report—even offline. Your input helps keep the track safe for everyone.",
    icon: warning,
    illustration: reportIllustration,
  },
  {
    id: "feedback",
    title: "Participate in our Survey",
    subtitle: "Help shape the future of the Bibbulmun Track",
    description: "Your feedback helps us understand visitor experiences and supports improvements to track design, management, and funding.",
    icon: chatbubbles,
    illustration: feedbackIllustration,
  },
];

/**
 * @interface OnboardingScreenProps
 * @description Props for the OnboardingScreen component
 */
interface OnboardingScreenProps {
  /** Callback function triggered when onboarding is completed */
  onComplete: () => void;
}

/**
 * @component OnboardingScreen
 * @description Interactive slideshow that introduces new users to TrackMate's features
 * Features include:
 * - Animated slide transitions
 * - Progress indicators
 * - Skip/Continue navigation
 * - Responsive layout
 * - Accessible controls
 * 
 * @param {OnboardingScreenProps} props - Component props
 * @returns {JSX.Element} Onboarding screen component
 */
const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  /**
   * Handles navigation to the next slide or completes onboarding
   */
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ 
              opacity: 0,
              x: 100,
              scale: 0.95
            }}
            animate={{ 
              opacity: 1,
              x: 0,
              scale: 1,
              transition: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }
            }}
            exit={{ 
              opacity: 0,
              x: -100,
              scale: 0.95,
              transition: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }
            }}
            className="onboarding-slide"
          >
            <motion.div 
              className="illustration-container"
              animate={{ 
                rotateY: [0, -10, 10, -10, 10, 0],
                transition: {
                  duration: 5,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            >
              <motion.img 
                src={onboardingData[currentIndex].illustration}
                alt={onboardingData[currentIndex].title}
                className="onboarding-illustration"
                initial={{ scale: 0.5 }}
                animate={{ 
                  scale: 1,
                  transition: {
                    delay: 0.2,
                    duration: 0.4,
                    ease: "easeOut"
                  }
                }}
              />
            </motion.div>
            <motion.div 
              className="content-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.3,
                  duration: 0.4,
                  ease: "easeOut"
                }
              }}
            >
              <h1>{onboardingData[currentIndex].title}</h1>
              <h2>{onboardingData[currentIndex].subtitle}</h2>
              <p>{onboardingData[currentIndex].description}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="navigation-container">
        <div className="navigation-dots">
          {onboardingData.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>

        <div className="button-container">
          {currentIndex < onboardingData.length - 1 ? (
            <>
              <button className="skip-button" onClick={onComplete}>
                Skip
              </button>
              <button className="next-button" onClick={handleNext}>
                Next
              </button>
            </>
          ) : (
            <button className="get-started-button" onClick={onComplete}>
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
