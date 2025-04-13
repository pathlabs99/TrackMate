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
import Menu from "./components/Menu";
import WeatherWidget from "./components/WeatherWidget";

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

setupIonicReact({
  mode: 'md',
  animated: true,
});

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const setupApp = async () => {
      if (Capacitor.getPlatform() === 'android') {
        try {
          // Handle status bar appearance
          await StatusBar.setOverlaysWebView({ overlay: false });
          await StatusBar.setBackgroundColor({ color: '#ffffff' });
          await StatusBar.setStyle({ style: Style.Light });
          
          // Get actual status bar height and set it as CSS variable
          const statusBarHeight = await StatusBar.getHeight();
          document.documentElement.style.setProperty(
            '--actual-status-bar-height',
            `${statusBarHeight.height}px`
          );
          
          // Add additional padding for devices with notches
          const topInset = window.innerHeight - document.documentElement.clientHeight;
          if (topInset > 0) {
            document.documentElement.style.setProperty(
              '--safe-area-inset-top',
              `${Math.max(topInset, statusBarHeight.height)}px`
            );
          }
        } catch (err) {
          console.error('Error setting up status bar:', err);
          // Fallback values if we can't get actual heights
          document.documentElement.style.setProperty('--actual-status-bar-height', '24px');
          document.documentElement.style.setProperty('--safe-area-inset-top', '32px');
        }
      }
    };

    setupApp();

    // Handle orientation changes and resizes
    const handleResize = async () => {
      if (Capacitor.getPlatform() === 'android') {
        try {
          const statusBarHeight = await StatusBar.getHeight();
          document.documentElement.style.setProperty(
            '--actual-status-bar-height',
            `${statusBarHeight.height}px`
          );
          
          const topInset = window.innerHeight - document.documentElement.clientHeight;
          document.documentElement.style.setProperty(
            '--safe-area-inset-top',
            `${Math.max(topInset, statusBarHeight.height)}px`
          );
        } catch (error) {
          console.error('Error updating status bar height:', error);
        }
      }
    };

    const handleResume = () => {
      setupApp();
    };

    window.addEventListener('resize', handleResize);
    CapacitorApp.addListener('resume', handleResume);

    return () => {
      window.removeEventListener('resize', handleResize);
      CapacitorApp.removeAllListeners();
    };
  }, []);

  const handleSplashComplete = () => {
    setIsTransitioning(true);
    setShowOnboarding(true);
    // Add a small delay before hiding splash to ensure exit animation plays
    setTimeout(() => {
      setShowSplash(false);
      setIsTransitioning(false);
    }, 600);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} isVisible={!isTransitioning} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showOnboarding && !hasCompletedOnboarding && (
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

      <AnimatePresence>
        {!showSplash && hasCompletedOnboarding && (
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
                      <>
                        <WeatherWidget />
                        <MainMenu />
                      </>
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