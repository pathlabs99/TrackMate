/**
 * @fileoverview Number with sub-questions component for the TrackMate survey.
 * @author Abdullah
 * @date 2025-04-13
 * @filename NumberWithSubQuestions.tsx
 *
 * This file contains the NumberWithSubQuestions component which renders a group of
 * number inputs for collecting multiple related numeric values in the survey.
 */

import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';

/**
 * NumberWithSubQuestions component that renders multiple number input fields
 * for collecting related numeric information in the survey
 * 
 * @param question - The question configuration object with subQuestions array
 * @param value - Current value of the question response (JSON string of values)
 * @param onChange - Callback function when the question value changes
 * @param error - Validation error message if any
 */
export const NumberWithSubQuestions: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const { subQuestions = [], question: questionText } = question;
  const values = value ? JSON.parse(value as string) : {};

  /**
   * Handle sub-question input change events with validation
   * 
   * @param subQuestionId - ID of the sub-question being changed
   * @param newValue - New value for the sub-question
   */
  const handleSubQuestionChange = (subQuestionId: string, newValue: string) => {
    // Only update if the value is valid
    if (newValue === '' || !isNaN(Number(newValue))) {
      const updatedValues = {
        ...values,
        [subQuestionId]: newValue === '' ? '' : Number(newValue)
      };
      onChange(question.id, JSON.stringify(updatedValues));
    }
  };

  return (
    <div className="question-container">
      <div className="question-text">{questionText}</div>
      <div className="sub-questions-group">
        {question.subQuestions?.map((subQ) => (
          <div key={subQ.id} className="sub-question-block">
            <div className="sub-question-label">
              {subQ.label}
            </div>
            <input
              type="number"
              id={subQ.id}
              min={subQ.min}
              max={subQ.max}
              value={values[subQ.id] || ''}
              onChange={(e) => handleSubQuestionChange(subQ.id, e.target.value)}
              className="number-input"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
