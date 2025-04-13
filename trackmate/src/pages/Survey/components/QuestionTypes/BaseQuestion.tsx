/**
 * @fileoverview Base question component for the TrackMate survey application.
 * @author Abdullah
 * @date 2025-04-13
 * @filename BaseQuestion.tsx
 *
 * This file contains the BaseQuestion component which serves as the foundation
 * for different question type implementations in the survey system.
 */

import React from 'react';
import { Question } from '../../questions';
import { FormData } from '../../models/FormData';

/**
 * Props interface for the BaseQuestion component
 */
interface BaseQuestionProps {
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
 * BaseQuestion component that provides the foundation for different question types
 * Renders a standard text input field with question text and validation
 * 
 * @param question - The question configuration object
 * @param value - Current value of the question response
 * @param onChange - Callback function when the question value changes
 * @param error - Validation error message if any
 * @param formData - Current form data state
 */
export const BaseQuestion: React.FC<BaseQuestionProps> = ({
  question,
  value,
  onChange,
  error,
  formData,
}) => {
  const { id, placeholder } = question;

  /**
   * Handle input change events and pass the updated value to the parent component
   * 
   * @param e - Change event from the input element
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    onChange(id, e.target.value);
  };

  return (
    <div className="question-container">
      <div className="question-text">{question.question}</div>
      {question.subtext && (
        <div className="question-subtext">{question.subtext}</div>
      )}
      <div className="question-content">
        <input
          type="text"
          id={id}
          value={value as string}
          onChange={handleChange}
          placeholder={placeholder}
          className="text-input"
        />
      </div>
      {error && (
        <div className="validation-error" role="alert">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}
    </div>
  );
};

/**
 * Common props interface for all question type components
 * This interface is exported for use by other question type components
 */
export interface QuestionComponentProps {
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
