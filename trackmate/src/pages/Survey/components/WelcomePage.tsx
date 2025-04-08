import React, { useState, useEffect } from "react";
import { IonContent } from "@ionic/react";
import "./WelcomePage.css";

interface WelcomePageProps {
  onStartSurvey: () => void;
  onContinueSurvey: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ 
  onStartSurvey,
  onContinueSurvey
}) => {
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  useEffect(() => {
    const savedProgress = localStorage.getItem('surveyProgress');
    if (savedProgress) {
      try {
        const { formData } = JSON.parse(savedProgress);
        setHasSavedProgress(Object.keys(formData).length > 0);
      } catch (e) {
        console.error('Error checking saved progress:', e);
      }
    }
  }, []);

  return (
    <IonContent className="welcome-page">
      <div className="welcome-content">
        <div className="header-section">
          <h1 className="brand-name">Bibbulmun Track</h1>
          <p className="brand-subtitle">User Survey</p>
        </div>
        
        <div className="content-section">
          <h2 className="headline">Help improve the track with your feedback</h2>
          <p className="subheadline">Your insights help us enhance trail maintenance and user experience</p>
          
          <div className="key-points">
            <div className="key-point">
              <div className="key-icon">⏱️</div>
              <div className="key-text">Recent Visits Only</div>
            </div>
            <div className="key-point">
              <div className="key-icon">🔍</div>
              <div className="key-text">5 Min Survey</div>
            </div>
            <div className="key-point">
              <div className="key-icon">🔒</div>
              <div className="key-text">Anonymous</div>
            </div>
          </div>
        </div>
        
        <div className="button-container">
          {hasSavedProgress ? (
            <>
              <button 
                className="continue-button"
                onClick={onContinueSurvey}
              >
                Continue Survey
              </button>
              <button 
                className="new-button"
                onClick={() => {
                  localStorage.removeItem('surveyProgress');
                  onStartSurvey();
                }}
              >
                Start New Survey
              </button>
            </>
          ) : (
            <button 
              className="start-button"
              onClick={onStartSurvey}
            >
              Start Survey
            </button>
          )}
        </div>
      </div>
    </IonContent>
  );
};

export default WelcomePage; 