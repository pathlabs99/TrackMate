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

const SurveyCard: React.FC<SurveyCardProps> = ({ 
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
              <path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 18C5.6 18 2 14.4 2 10C2 5.6 5.6 2 10 2C14.4 2 18 5.6 18 10C18 14.4 14.4 18 10 18Z" fill="#F2C94C"/>
              <path d="M9 5H11V11H9V5Z" fill="#F2C94C"/>
              <path d="M9 13H11V15H9V13Z" fill="#F2C94C"/>
            </svg>
          </span>
          <span>For visits within the last 4 weeks only</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 18C5.6 18 2 14.4 2 10C2 5.6 5.6 2 10 2C14.4 2 18 5.6 18 10C18 14.4 14.4 18 10 18Z" fill="#EB5757"/>
              <path d="M15 9H11V5H9V9H5V11H9V15H11V11H15V9Z" fill="#EB5757"/>
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
        This survey helps us understand track usage, economic impact, and health benefits. Your insights will support track improvements and funding.
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
              localStorage.removeItem('surveyProgress');
              onStartSurvey();
            }}
          >
            Start New Survey
          </button>
        </div>
      ) : (
        <button 
          className="continue-button"
          onClick={onStartSurvey}
        >
          Continue Survey
        </button>
      )}

      <div className="nav-bar">
        <div className="nav-item">
          <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Home</span>
        </div>
        <div className="nav-item nav-active">
          <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>Survey</span>
        </div>
        <div className="nav-item">
          <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
          <span>Scan</span>
        </div>
        <div className="nav-item">
          <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>Issues</span>
        </div>
        <div className="nav-item">
          <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>FAQ</span>
        </div>
      </div>
    </IonContent>
  );
};

export default SurveyCard; 