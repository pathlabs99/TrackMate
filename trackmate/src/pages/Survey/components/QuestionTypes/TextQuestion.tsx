/**
 * @fileoverview Text question component for the TrackMate survey.
 * @author Abdullah
 * @date 2025-04-13
 * @filename TextQuestion.tsx
 *
 * This file contains the TextQuestion component which renders a textarea
 * for collecting free-form text responses in the survey.
 */

import React from 'react';
import { Question } from '../../questions';
import { QuestionComponentProps } from './BaseQuestion';

/**
 * TextQuestion component that renders a textarea input
 * for collecting free-form text responses in the survey
 * 
 * @param question - The question configuration object
 * @param value - Current value of the question response
 * @param onChange - Callback function when the question value changes
 * @param error - Validation error message if any
 */
export const TextQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  /**
   * Handle textarea input change events
   * 
   * @param e - Change event from the textarea element
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(question.id, e.target.value);
  };

  return (
    <div className="question-container">
      <label htmlFor={question.id}>{question.question}</label>
      {question.subtext && <p className="question-subtext">{question.subtext}</p>}
      <div className="question-content">
        <textarea
          id={question.id}
          value={value as string}
          onChange={handleChange}
          placeholder={question.subtext}
          className="text-input textarea"
          style={{ height: '36px', padding: '6px 10px', fontSize: '13px' }}
        />
      </div>
    </div>
  );
};
