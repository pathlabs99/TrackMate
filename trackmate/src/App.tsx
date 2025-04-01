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

// Import pages
import QRScanner from "./pages/QR/QR";
import { SurveyTab } from "./pages/Survey/SurveyTab";
import IssuesTab from "./pages/IssueReport/IssuesTab";
import FAQ from "./pages/FAQ/FAQ";
import MainMenu from "./pages/MainMenu/MainMenu";
import Onboarding from "./components/Onboarding/Onboarding";

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
import "./theme/variables.css";
import "./theme/edge-to-edge.css";

setupIonicReact({
  mode: 'md',
});

const App: React.FC = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(
    localStorage.getItem('onboardingCompleted') === 'true'
  );

  useEffect(() => {
    const setupApp = async () => {
      if (Capacitor.getPlatform() === 'android') {
        try {
          await StatusBar.setOverlaysWebView({ overlay: true });
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#00000000' });
        } catch (err) {
          console.log('Error setting up status bar:', err);
        }
      }
    };

    setupApp();

    const handleResume = () => {
      setupApp();
    };

    CapacitorApp.addListener('resume', handleResume);

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);

  return (
    <IonApp className={isPlatform('android') ? 'android-platform' : ''}>
      <IonReactRouter>
        {!hasCompletedOnboarding ? (
          <Route path="/" exact>
            <Onboarding onComplete={() => setHasCompletedOnboarding(true)} />
          </Route>
        ) : (
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
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;