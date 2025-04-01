import React, { useState } from 'react';
import { IonContent, IonPage, IonIcon, IonButton } from '@ionic/react';
import { motion, AnimatePresence } from 'framer-motion';
import './Onboarding.css';
import { footsteps, qrCode, warning, chatbubbles, arrowForward } from 'ionicons/icons';

// Import Lottie animations
import TrailAnimation from './animations/TrailAnimation';
import QRAnimation from './animations/QRAnimation';
import LogAnimation from './animations/LogAnimation';
import SurveyAnimation from './animations/SurveyAnimation';

// Screen data
const screens = [
  {
    icon: footsteps,
    illustration: TrailAnimation,
    title: 'Welcome to TrackMate',
    subtitle: 'Your guide to the Bibbulmun Track',
    description: 'Explore Western Australia\'s iconic 1000km walking trail with ease. TrackMate gives you everything you need to navigate, learn, and enjoy each step of your journey — whether you\'re hiking for a day or tackling the full trek.',
  },
  {
    icon: qrCode,
    illustration: QRAnimation,
    title: 'Scan QR Codes',
    subtitle: 'Unlock location-specific insights',
    description: 'Use your phone to scan QR codes on trail signs to instantly access historical facts, safety info, nearby facilities, and hidden gems — all tied to your exact location on the track.',
  },
  {
    icon: warning,
    illustration: LogAnimation,
    title: 'Report Track Issues',
    subtitle: 'Keep the trail safe and open',
    description: 'Spotted a fallen tree, damaged sign, or hazard? Snap a photo and submit a report instantly — even when offline. Your feedback helps rangers and volunteers take action faster and preserve the track for all.',
  },
  {
    icon: chatbubbles,
    illustration: SurveyAnimation,
    title: 'Give Quick Feedback',
    subtitle: 'Improve the track with your voice',
    description: 'Help us enhance shelters, signage, and track conditions by answering short in-app surveys. Your insights help rangers and volunteers better understand hikers\' needs — all in just a few taps.',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideNext = () => {
    setDirection(1);
    if (currentIndex < screens.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const slidePrev = () => {
    setDirection(-1);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const skip = () => {
    onComplete();
  };

  const getStarted = () => {
    onComplete();
  };

  const currentScreen = screens[currentIndex];

  return (
    <IonPage>
      <IonContent>
        <div className="onboarding">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="onboarding-content"
            >
              <div className="illustration-container">
                {React.createElement(currentScreen.illustration)}
              </div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentScreen.title}
              </motion.h1>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentScreen.subtitle}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {currentScreen.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <div className="navigation">
            <div className="dots">
              {screens.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                />
              ))}
            </div>
            <div className="buttons">
              {currentIndex < screens.length - 1 ? (
                <>
                  <IonButton 
                    fill="clear" 
                    className="skip" 
                    onClick={skip}
                  >
                    Skip
                  </IonButton>
                  <IonButton 
                    className="next" 
                    onClick={slideNext}
                    color="danger"
                  >
                    Next
                    <IonIcon slot="end" icon={arrowForward} />
                  </IonButton>
                </>
              ) : (
                <IonButton 
                  className="get-started" 
                  onClick={getStarted}
                  expand="block"
                  color="danger"
                >
                  Get Started
                </IonButton>
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
