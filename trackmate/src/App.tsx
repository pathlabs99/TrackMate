import React, { useEffect } from 'react';
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
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { qrCode, documentText, warning, helpCircle, menu } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";
import FAQ from "./pages/FAQ/FAQ";
import MainMenu from "./pages/MainMenu/MainMenu";
import QR1 from "./pages/QR/QR1";
import QR2 from "./pages/QR/QR2";
import QR3 from "./pages/QR/QR3";
import QR4 from "./pages/QR/QR4";
import QR5 from "./pages/QR/QR5";
import QR6 from "./pages/QR/QR6";
import QR7 from "./pages/QR/QR7";
import QR8 from "./pages/QR/QR8";
import QR9 from "./pages/QR/QR9";

// Import Capacitor plugins
import { StatusBar, Style } from '@capacitor/status-bar';

/* Core CSS required for Ionic components to work properly */
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
import "@ionic/react/css/palettes/dark.system.css";
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    const setupStatusBar = async () => {
      try {
        // Configure status bar
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
      } catch (err) {
        console.log('Status bar setup error:', err);
      }
    };
    
    // Initialize status bar settings
    setupStatusBar();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/menu">
              <MainMenu />
            </Route>
            <Route exact path="/tab1">
              <Tab1 />
            </Route>
            <Route exact path="/tab2">
              <Tab2 />
            </Route>
            <Route exact path="/tab3">
              <Tab3 />
            </Route>
            <Route exact path="/faq">
              <FAQ />
            </Route>
            <Route exact path="/qr1">
              <QR1 />
            </Route>
            <Route exact path="/qr2">
              <QR2 />
            </Route>
            <Route exact path="/qr3">
              <QR3 />
            </Route>
            <Route exact path="/qr4">
              <QR4 />
            </Route>
            <Route exact path="/qr5">
              <QR5 />
            </Route>
            <Route exact path="/qr6">
              <QR6 />
            </Route>
            <Route exact path="/qr7">
              <QR7 />
            </Route>
            <Route exact path="/qr8">
              <QR8 />
            </Route>
            <Route exact path="/qr9">
              <QR9 />
            </Route>
            <Route exact path="/">
              <Redirect to="/menu" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="menu" href="/menu">
              <IonIcon aria-hidden="true" icon={menu} />
              <IonLabel>Menu</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab1" href="/tab1">
              <IonIcon aria-hidden="true" icon={qrCode} />
              <IonLabel>QR Code</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon aria-hidden="true" icon={documentText} />
              <IonLabel>Survey</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/tab3">
              <IonIcon aria-hidden="true" icon={warning} />
              <IonLabel>Issues</IonLabel>
            </IonTabButton>
            <IonTabButton tab="faq" href="/faq">
              <IonIcon aria-hidden="true" icon={helpCircle} />
              <IonLabel>FAQ</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;