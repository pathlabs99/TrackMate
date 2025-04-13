/**
 * @fileoverview Survey completion component for the TrackMate application.
 * @author Abdullah
 * @date 2025-04-13
 * @filename SurveyCompletion.tsx
 *
 * This file contains the SurveyCompletion component which displays a success message
 * after a survey has been submitted or a processing indicator while submission is in progress.
 */

import React from 'react';
import { useHistory } from 'react-router-dom';
import './SurveyCompletion.css';

/**
 * Props interface for the SurveyCompletion component
 */
interface SurveyCompletionProps {
  /** Flag indicating if the user exited the survey early */
  isEarlyExit?: boolean;
  /** Callback function to reset the survey state */
  onReset: () => void;
  /** Flag indicating if the survey is currently being submitted */
  isSubmitting?: boolean;
}

/**
 * SurveyCompletion component that displays a success message after survey submission
 * or a processing indicator while submission is in progress
 * 
 * @param isEarlyExit - Flag indicating if the user exited the survey early, defaults to false
 * @param onReset - Callback function to reset the survey state
 * @param isSubmitting - Flag indicating if the survey is currently being submitted, defaults to false
 */
export const SurveyCompletion: React.FC<SurveyCompletionProps> = ({ 
  isEarlyExit = false, 
  onReset,
  isSubmitting = false 
}) => {
  const history = useHistory();

  /**
   * Handle returning to the home screen and resetting the survey
   */
  const handleReturn = () => {
    onReset();
    history.push('/');
  };

  // Show processing indicator while submitting
  if (isSubmitting) {
    return (
      <div className="processing-overlay">
        <div className="processing-card">
          <div className="processing-spinner"></div>
          <div className="processing-content">
            <h3>Submitting Response</h3>
            <p>Submitting...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show completion message after successful submission
  return (
    <div className="completion-overlay">
      <div className="completion-card">
        <div className="completion-icon">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#4CAF50"
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div className="completion-content">
          <h2>Thank You!</h2>
          <p>Your response has been recorded successfully.</p>
          <button onClick={handleReturn} className="completion-button">
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};
