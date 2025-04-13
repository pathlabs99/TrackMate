/**
 * @fileoverview Date question component for the TrackMate survey application.
 * @author Abdullah
 * @date 2025-04-13
 * @filename DateQuestion.tsx
 *
 * This file contains the DateQuestion component which renders a date input
 * for collecting date information in the survey.
 */

import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';

/**
 * DateQuestion component that renders a date input field
 * for collecting date information in the survey
 * 
 * @param question - The question configuration object
 * @param value - Current value of the question response
 * @param onChange - Callback function when the question value changes
 */
export const DateQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
}) => {
  const { id, placeholder, description, question: questionText } = question;

  /**
   * Handle date input change events
   * 
   * @param e - Change event from the date input element
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    onChange(id, newDate);
  };

  return (
    <div className="question-field">
      <div className="question-text">
        {questionText}
        {description && <span className="question-description">{description}</span>}
      </div>
      <div className="date-input-wrapper">
        <div className="date-field">
          <input
            type="date"
            id={id}
            name={id}
            value={value as string || ''}
            onChange={handleChange}
            placeholder={placeholder}
            className="date-input"
            max={new Date().toISOString().split('T')[0]} // Prevent future dates in native picker
          />
        </div>
      </div>
    </div>
  );
};
