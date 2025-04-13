/**
 * @fileoverview Survey question component for the TrackMate application.
 * @author Abdullah
 * @date 2025-04-13
 * @filename SurveyQuestion.tsx
 *
 * This file contains the SurveyQuestion component which renders different
 * question types based on the question configuration and handles validation.
 */

import React from 'react';
import { Question } from '../questions';
import { questionComponents } from './QuestionTypes';
import { FormData } from '../models/FormData';

/**
 * Props interface for the SurveyQuestion component
 */
interface SurveyQuestionProps {
  /** The question configuration object */
  question: Question;
  /** Current value of the question response */
  value: string | string[];
  /** Callback function when the question value changes */
  onChange: (questionId: string, value: string | string[]) => void;
  /** Validation error message if any */
  error?: string;
  /** Current form data state */
  formData: FormData;
}

/**
 * SurveyQuestion component that renders the appropriate question type component
 * based on the question configuration and handles validation errors
 * 
 * @param question - The question configuration object
 * @param value - Current value of the question response
 * @param onChange - Callback function when the question value changes
 * @param error - Validation error message if any
 * @param formData - Current form data state
 */
export const SurveyQuestion: React.FC<SurveyQuestionProps> = ({
  question,
  value,
  onChange,
  error,
  formData
}) => {
  const QuestionComponent = questionComponents[question.type];

  if (!QuestionComponent) {
    // Return a fallback UI instead of logging to console
    return (
      <div className="question-container">
        <div className="question-error">
          <p>Unable to display this question type: {question.type}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="question-container">
      <QuestionComponent
        question={question}
        value={value}
        onChange={onChange}
        error={error}
        formData={formData}
      />
      {error && (
        <div className="validation-error" role="alert">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}
    </div>
  );
};
