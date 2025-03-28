import React from 'react';
import { useHistory } from 'react-router-dom';

interface SurveyCompletionProps {
  isEarlyExit?: boolean;
  onReset: () => void;
}

export const SurveyCompletion: React.FC<SurveyCompletionProps> = ({ isEarlyExit = false, onReset }) => {
  const history = useHistory();

  const handleReturn = () => {
    onReset();
    history.push('/');
  };

  return (
    <div className="survey-container">
      <div className="survey-content">
        <div className="survey-card completion-screen">
          <div className="completion-icon">
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#FF9800"
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1>{isEarlyExit ? 'Thank You' : 'Thank You for Your Feedback!'}</h1>
          <div className="completion-text">
            {isEarlyExit ? (
              <p>Thank you for your interest in the Bibbulmun Track survey.</p>
            ) : (
              <>
                <p>Your response has been recorded successfully.</p>
                <p>Your feedback will help us improve the Bibbulmun Track experience for everyone.</p>
              </>
            )}
          </div>
          <button onClick={handleReturn} className="home-button">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ marginRight: '8px' }}
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};
