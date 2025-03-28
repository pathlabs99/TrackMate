import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonButton,
} from "@ionic/react";
import "./SurveyCard.css";

interface SurveyCardProps {
  onStartSurvey: () => void;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ onStartSurvey }) => {
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
    <IonContent className="survey-welcome">
      <div className="welcome-container">
        <div className="welcome-content">
          <div className="welcome-header">
            <div className="welcome-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" className="survey-icon-bg"/>
                <path d="M7 9H17M7 12H14M7 15H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="title-group">
              <span className="subtitle">Dear trail user,</span>
              <h1>Bibbulmun Track<br />User Survey</h1>
            </div>
          </div>
          
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">⚠️</span>
              <span>For visits within the last 4 weeks only</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <span>Help improve track design & management</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Confidential & independently analyzed</span>
            </div>
          </div>

          <div className="divider"></div>

          <p className="welcome-description">
            This survey helps us understand track usage, economic impact, and health benefits. Your insights will support track improvements and funding.
            <br /><br />
            <span className="highlight">Note: Please answer for yourself only.</span>
          </p>
        </div>

        {hasSavedProgress ? (
          <div className="button-group">
            <button 
              className="continue-button"
              onClick={onStartSurvey}
            >
              Continue Survey
            </button>
            <button 
              className="start-new-button"
              onClick={() => {
                localStorage.removeItem('surveyProgress');
                onStartSurvey();
              }}
            >
              Start New Survey
            </button>
          </div>
        ) : (
          <IonButton 
            expand="block" 
            className="start-button"
            color="primary"
            onClick={onStartSurvey}
          >
            Start Survey
          </IonButton>
        )}
      </div>
    </IonContent>
  );
};

export default SurveyCard;
