/**
 * @fileoverview Welcome page component for the TrackMate survey application.
 * @author Abdullah
 * @date 2025-04-13
 * @filename WelcomePage.tsx
 *
 * This file contains the WelcomePage component which displays the survey welcome screen
 * with information about the survey and options to start or continue a survey.
 */

import React, { useState, useEffect } from "react";
import { IonContent } from "@ionic/react";
import "./WelcomePage.css";

/**
 * Props interface for the WelcomePage component
 */
interface WelcomePageProps {
  /** Callback function to start a new survey */
  onStartSurvey: () => void;
  /** Callback function to continue a previously saved survey */
  onContinueSurvey: () => void;
}

/**
 * WelcomePage component that displays the welcome screen for the survey
 * with information about the survey purpose and buttons to start or continue
 * 
 * @param onStartSurvey - Callback function to start a new survey
 * @param onContinueSurvey - Callback function to continue a previously saved survey
 */
const WelcomePage: React.FC<WelcomePageProps> = ({ 
  onStartSurvey,
  onContinueSurvey
}) => {
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  /**
   * Check if there is saved survey progress on component mount
   */
  useEffect(() => {
    const savedProgress = localStorage.getItem('surveyProgress');
    if (savedProgress) {
      try {
        const { formData } = JSON.parse(savedProgress);
        setHasSavedProgress(Object.keys(formData).length > 0);
      } catch (e) {
        // Error handling for invalid saved progress
        localStorage.removeItem('surveyProgress');
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