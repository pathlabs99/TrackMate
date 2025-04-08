import {
  IonContent,
  IonPage,
} from "@ionic/react";
import "./Tab3.css";

const Tab3: React.FC = () => {
  return (
    <IonPage className="issue-report-page">
      {/* White bar that stays fixed at top */}
      <div className="top-safe-area"></div>
      
      <IonContent fullscreen>
        <div className="content-container">
          {/* Offline status banner */}
          <div className="offline-banner">
            <span className="offline-icon">📨</span>
            <span>You're offline. Report will be saved locally and sent when online.</span>
          </div>

          {/* Main content */}
          <div className="report-card">
            <h1>Report an Issue</h1>
            <p className="subtitle">
              Your reports help us keep the Bibbulmun Track in great condition.
              Please note: in case of an emergency, always contact local authorities.
            </p>
            
            {/* Form content */}
            <div className="form-content">
              {/* Your existing form elements */}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3; 