/**
 * @fileoverview Number question component for the TrackMate survey.
 * @author Abdullah
 * @date 2025-04-13
 * @filename NumberQuestion.tsx
 *
 * This file contains the NumberQuestion component which renders a number input
 * for collecting numeric information in the survey with validation.
 */

import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';
import './NumberQuestion.css';

/**
 * NumberQuestion component that renders a number input field
 * for collecting numeric information in the survey
 * 
 * @param question - The question configuration object
 * @param value - Current value of the question response
 * @param onChange - Callback function when the question value changes
 * @param error - Validation error message if any
 */
export const NumberQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const { question: questionText, min, max } = question;

  /**
   * Handle number input change events with validation
   * 
   * @param e - Change event from the number input element
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow empty string or valid numbers
    if (newValue === '' || !isNaN(Number(newValue))) {
      onChange(question.id, newValue);
    }
  };

  return (
    <div className="question-container">
      <div className="question-text">{questionText}</div>
      {question.description && <div className="question-description">{question.description}</div>}
      {question.subtext && <div className="question-subtext" dangerouslySetInnerHTML={{ __html: question.subtext }} />}
      
      <div className="number-input-container">
        <input
          type="number"
          id={question.id}
          min={min}
          max={max}
          value={value === undefined || value === null || value === 'null' ? '' : value}
          onChange={handleChange}
          className="number-input"
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>
      
      {error && (
        <div className="error-message" role="alert">
          <span className="error-text">{error}</span>
        </div>
      )}
    </div>
  );
};
