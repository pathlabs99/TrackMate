import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonButton,
} from "@ionic/react";
import "./SurveyCard.css";

interface SurveyCardProps {
  onStartSurvey: () => void;
  onContinueSurvey: () => void;
}

const DemoSurveyCard: React.FC<SurveyCardProps> = ({ 
  onStartSurvey,
  onContinueSurvey
}) => {
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  useEffect(() => {
    const savedProgress = localStorage.getItem('demoSurveyProgress');
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
      <div className="welcome-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" className="survey-icon-bg"/>
          <path d="M9 13h6M9 17h6M9 9h6"/>
        </svg>
      </div>
      
      <div className="title-group">
        <h1>Bibbulmun Track</h1>
        <span className="subtitle">User Survey</span>
      </div>
      
      <div className="feature-list">
        <div className="feature-item">
          <span className="feature-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9" stroke="#F2C94C" strokeWidth="2"/>
              <path d="M10 5V11" stroke="#F2C94C" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="14" r="1" fill="#F2C94C"/>
            </svg>
          </span>
          <span>For visits within the last 4 weeks only</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9" stroke="#EB5757" strokeWidth="2"/>
              <path d="M10 5V10" stroke="#EB5757" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5 10H10" stroke="#EB5757" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 10L14 10" stroke="#EB5757" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <span>Help improve track design & management</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8H15V6C15 3.2 12.8 1 10 1C7.2 1 5 3.2 5 6V8H4C2.9 8 2 8.9 2 10V17C2 18.1 2.9 19 4 19H16C17.1 19 18 18.1 18 17V10C18 8.9 17.1 8 16 8ZM7 6C7 4.3 8.3 3 10 3C11.7 3 13 4.3 13 6V8H7V6ZM16 17H4V10H16V17Z" fill="#2F80ED"/>
              <path d="M10 14C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12C9.44772 12 9 12.4477 9 13C9 13.5523 9.44772 14 10 14Z" fill="#2F80ED"/>
            </svg>
          </span>
          <span>Confidential & independently analyzed</span>
        </div>
      </div>

      <p className="welcome-description">
        <span className="emoji">📊</span> This survey helps us understand track usage, economic impact, and health benefits. Your insights will support track improvements and funding.
      </p>

      {hasSavedProgress ? (
        <div className="button-group">
          <button 
            className="continue-button"
            onClick={onContinueSurvey}
          >
            Continue Survey
          </button>
          <button 
            className="start-new-button"
            onClick={() => {
              localStorage.removeItem('demoSurveyProgress');
              onStartSurvey();
            }}
          >
            Start New Survey
          </button>
        </div>
      ) : (
        <button 
          className="start-button"
          onClick={onStartSurvey}
        >
          Start Survey
        </button>
      )}
    </IonContent>
  );
};

export default DemoSurveyCard;
