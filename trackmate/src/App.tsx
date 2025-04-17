/**
 * @fileoverview Main application component for the TrackMate mobile app.
 * @author TrackMate Team
 * @module App
 * @description Root component that sets up the application structure, including
 * routing, navigation, and platform-specific configurations.
 * 
 * @note Developer Handover
 * The following can be customized:
 * 1. Navigation
 *    - Tab bar configuration in IonTabs
 *    - Route definitions in IonRouterOutlet
 *    - Path mappings and redirects
 * 2. Platform Features
 *    - Platform detection via isPlatform
 *    - Native integrations setup
 * 3. App State
 *    - First launch detection
 *    - Onboarding flow control
 *    - Global state management
 * 4. Theme
 *    - Dark/light mode preferences
 *    - Platform-specific styling
 */

import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  isPlatform,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  qrCode,
  documentText,
  warning,
  helpCircle,
  home,
} from "ionicons/icons";

import { StatusBar, Style } from "@capacitor/status-bar";
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { AnimatePresence, motion } from 'framer-motion';

// Import pages
import QRScanner from "./pages/QR/QR";
import { SurveyTab } from "./pages/Survey/SurveyTab";
import IssuesTab from "./pages/IssueReport/IssuesTab";
import FAQ from "./pages/FAQ/FAQ";
import MainMenu from "./pages/MainMenu/MainMenu";
import OnboardingScreen from "./pages/Onboarding/OnboardingScreen";

// Import QR Code section pages
import DarlingRange from "./pages/QR/DarlingRange";
import Dwellingup from "./pages/QR/Dwellingup";
import Collie from "./pages/QR/Collie";
import Balingup from "./pages/QR/Balingup";
import DonnellyRiver from "./pages/QR/DonnellyRiver";
import Pemberton from "./pages/QR/Pemberton";
import Northcliffe from "./pages/QR/Northcliffe";
import Walpole from "./pages/QR/Walpole";
import Denmark from "./pages/QR/Denmark";

// Import SplashScreen component
import SplashScreen from "./components/SplashScreen/SplashScreen";
import Menu from "./components/Menu/Menu";
import WeatherWidget from "./components/WeatherWidget/WeatherWidget";

/* Core CSS */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme CSS */
import "./theme/variables.css";
import "./theme/edge-to-edge.css";

// Initialize Ionic React with configuration
setupIonicReact({
  mode: 'md',
  animated: true
});

// Force light mode for the entire app
document.body.classList.remove('dark');

/**
 * @component App
 * @description Root application component that orchestrates the entire app structure
 * Features include:
 * - Ionic framework integration
 * - Tab-based navigation
 * - Platform-specific adaptations
 * - First launch detection
 * - Splash screen management
 * - Onboarding flow
 * - Dark/light theme support
 * 
 * @returns {JSX.Element} Root application component
 */
const App: React.FC = () => {
  /**
   * @state showSplash
   * @description Controls splash screen visibility based on first launch
   */
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    const hasLaunched = localStorage.getItem('hasLaunchedBefore');
    return !hasLaunched;
  });

  /**
   * @state hasCompletedOnboarding
   * @description Tracks whether user has completed onboarding flow
   */
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);

  /**
   * @state isTransitioning
   * @description Controls animation states between screens
   */
  const [isTransitioning, setIsTransitioning] = useState(false);

  /**
   * @state showOnboarding
   * @description Controls onboarding screen visibility
   */
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    const hasLaunched = localStorage.getItem('hasLaunchedBefore');
    return !hasLaunched; // Show onboarding if this is the first launch
  });

  /**
   * @state isInitialized
   * @description Tracks whether the app has been properly initialized
   */
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * @effect platformSetup
   * @description Sets up platform-specific configurations and event handlers
   */
  useEffect(() => {
    /**
     * Set up platform-specific configurations for Android
     */
    const setupApp = async () => {
      if (Capacitor.getPlatform() === 'android') {
        try {
          // Handle status bar appearance - simplified approach
          await StatusBar.setOverlaysWebView({ overlay: false });
          await StatusBar.setBackgroundColor({ color: '#ffffff' });
          await StatusBar.setStyle({ style: Style.Light });
          
          // Set fixed values for status bar height
          document.documentElement.style.setProperty('--actual-status-bar-height', '24px');
          document.documentElement.style.setProperty('--safe-area-inset-top', '32px');
        } catch (err) {
          console.error('Status bar error:', err);
          // Fallback values
          document.documentElement.style.setProperty('--actual-status-bar-height', '24px');
          document.documentElement.style.setProperty('--safe-area-inset-top', '32px');
        }
      } else {
        // For web and iOS, set default values
        document.documentElement.style.setProperty('--actual-status-bar-height', '0px');
        document.documentElement.style.setProperty('--safe-area-inset-top', '0px');
      }
      
      // If this is not the first launch, mark as initialized
      const hasLaunched = localStorage.getItem('hasLaunchedBefore');
      if (hasLaunched) {
        setHasCompletedOnboarding(true);
        setIsInitialized(true);
      } else {
        // For first launch, show onboarding after splash screen
        setShowOnboarding(true);
      }
    };

    setupApp();

    /**
     * Handle orientation changes and resizes
     */
    const handleResize = () => {
      // Use fixed values instead of trying to calculate dynamically
      if (Capacitor.getPlatform() === 'android') {
        document.documentElement.style.setProperty('--actual-status-bar-height', '24px');
        document.documentElement.style.setProperty('--safe-area-inset-top', '32px');
      }
    };

    /**
     * Handle app resume events
     */
    const handleResume = () => {
      setupApp();
    };

    // Set up event listeners
    window.addEventListener('resize', handleResize);
    CapacitorApp.addListener('resume', handleResume);

    // Clean up event listeners
    return () => {
      window.removeEventListener('resize', handleResize);
      CapacitorApp.removeAllListeners();
    };
  }, []);

  /**
   * Handle splash screen completion and transition to onboarding
   */
  const handleSplashComplete = () => {
    setIsTransitioning(true);
    setShowOnboarding(true);
    // Mark that the app has been launched before
    localStorage.setItem('hasLaunchedBefore', 'true');
    // Add a small delay before hiding splash to ensure exit animation plays
    setTimeout(() => {
      setShowSplash(false);
      setIsTransitioning(false);
      setIsInitialized(true);
    }, 600);
  };

  return (
    <>
      {/* Splash screen with animation */}
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} isVisible={!isTransitioning} />
        )}
      </AnimatePresence>

      {/* Onboarding screen with animation */}
      <AnimatePresence mode="wait">
        {!showSplash && showOnboarding && !hasCompletedOnboarding && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'white',
              zIndex: 999
            }}
          >
            <IonApp className={isPlatform('android') ? 'android-platform' : ''}>
              <OnboardingScreen onComplete={() => setHasCompletedOnboarding(true)} />
            </IonApp>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main application with animation */}
      <AnimatePresence>
        {isInitialized && !showSplash && hasCompletedOnboarding && (
          <motion.div
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <IonApp className={isPlatform('android') ? 'android-platform' : ''}>
              <IonReactRouter>
                <Menu />
                <IonTabs>
                  <IonRouterOutlet>
                    <Route exact path="/menu">
                      <MainMenu />
                    </Route>
                    <Route exact path="/scan">
                      <QRScanner />
                    </Route>
                    <Route exact path="/survey">
                      <SurveyTab />
                    </Route>
                    <Route exact path="/issues">
                      <IssuesTab />
                    </Route>
                    <Route exact path="/faq">
                      <FAQ />
                    </Route>

                    {/* QR Code section routes */}
                    <Route exact path="/DarlingRange">
                      <DarlingRange />
                    </Route>
                    <Route exact path="/Dwellingup">
                      <Dwellingup />
                    </Route>
                    <Route exact path="/Collie">
                      <Collie />
                    </Route>
                    <Route exact path="/Balingup">
                      <Balingup />
                    </Route>
                    <Route exact path="/DonnellyRiver">
                      <DonnellyRiver />
                    </Route>
                    <Route exact path="/Pemberton">
                      <Pemberton />
                    </Route>
                    <Route exact path="/Northcliffe">
                      <Northcliffe />
                    </Route>
                    <Route exact path="/Walpole">
                      <Walpole />
                    </Route>
                    <Route exact path="/Denmark">
                      <Denmark />
                    </Route>

                    <Route exact path="/">
                      <Redirect to="/menu" />
                    </Route>
                  </IonRouterOutlet>

                  {/* Bottom tab navigation */}
                  <IonTabBar slot="bottom" className="custom-tab-bar">
                    <IonTabButton tab="menu" href="/menu">
                      <IonIcon icon={home} />
                      <IonLabel>Home</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="survey" href="/survey">
                      <IonIcon icon={documentText} />
                      <IonLabel>Survey</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="scan" href="/scan" className="qr-tab-button">
                      <IonIcon icon={qrCode} />
                      <IonLabel>Scan</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="issues" href="/issues">
                      <IonIcon icon={warning} />
                      <IonLabel>Issues</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="faq" href="/faq">
                      <IonIcon icon={helpCircle} />
                      <IonLabel>FAQ</IonLabel>
                    </IonTabButton>
                  </IonTabBar>
                </IonTabs>
              </IonReactRouter>
            </IonApp>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;