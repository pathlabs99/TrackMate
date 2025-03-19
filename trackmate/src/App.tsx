import React, { useEffect } from "react";
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
import {
  qrCode,
  helpCircle,
  home,
  documentText,
  alertCircle,
} from "ionicons/icons";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

// Import pages
import FAQ from "./pages/FAQ/FAQ";
import MainMenu from "./pages/MainMenu/MainMenu";
import Survey from "./pages/Survey/Survey";
import QR from "./pages/QR/QR";
import IssueReport from "./pages/IssueReport/IssueReport";
import Balingup from "./pages/QR/Balingup";
import Collie from "./pages/QR/Collie";
import DarlingRange from "./pages/QR/DarlingRange";
import Denmark from "./pages/QR/Denmark";
import DonnellyRiver from "./pages/QR/DonnellyRiver";
import Dwellingup from "./pages/QR/Dwellingup";
import Northcliffe from "./pages/QR/Northcliffe";
import Pemberton from "./pages/QR/Pemberton";
import Walpole from "./pages/QR/Walpole";

// Core CSS
import "@ionic/react/css/core.css";
import "./theme/variables.css";
import "./pages/QR/LocationPages.css"; 

setupIonicReact({ mode: "md", animated: true });

const App: React.FC = () => {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setBackgroundColor({ color: "#FFA725" });
      StatusBar.setStyle({ style: Style.Light });
    }
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/menu" component={MainMenu} />
            <Route exact path="/faq" component={FAQ} />
            <Route exact path="/survey" component={Survey} />
            <Route exact path="/qr" component={QR} />
            <Route exact path="/issue-report" component={IssueReport} />
            <Route exact path="/qr/balingup" component={Balingup} />
            <Route exact path="/qr/collie" component={Collie} />
            <Route exact path="/qr/darling-range" component={DarlingRange} />
            <Route exact path="/qr/denmark" component={Denmark} />
            <Route exact path="/qr/donnelly-river" component={DonnellyRiver} />
            <Route exact path="/qr/dwellingup" component={Dwellingup} />
            <Route exact path="/qr/northcliffe" component={Northcliffe} />
            <Route exact path="/qr/pemberton" component={Pemberton} />
            <Route exact path="/qr/walpole" component={Walpole} />
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
            <IonTabButton tab="qr" href="/qr">
              <IonIcon icon={qrCode} />
              <IonLabel>QR</IonLabel>
            </IonTabButton>
            <IonTabButton tab="issue-report" href="/issue-report">
              <IonIcon icon={alertCircle} />
              <IonLabel>Issue Report</IonLabel>
            </IonTabButton>
            <IonTabButton tab="faq" href="/faq">
              <IonIcon icon={helpCircle} />
              <IonLabel>FAQ</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;