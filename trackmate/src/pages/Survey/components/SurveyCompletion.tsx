import React from 'react';
import { useHistory } from 'react-router-dom';
import './SurveyCompletion.css';

interface SurveyCompletionProps {
  isEarlyExit?: boolean;
  onReset: () => void;
  isSubmitting?: boolean;
}

export const SurveyCompletion: React.FC<SurveyCompletionProps> = ({ 
  isEarlyExit = false, 
  onReset,
  isSubmitting = false 
}) => {
  const history = useHistory();

  const handleReturn = () => {
    onReset();
    history.push('/');
  };

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
