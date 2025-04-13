/**
 * @fileoverview Radio question component for the TrackMate survey.
 * @author Abdullah
 * @date 2025-04-13
 * @filename RadioQuestion.tsx
 *
 * This file contains the RadioQuestion component which renders a group of radio
 * buttons for single-selection questions, with support for conditional sub-questions.
 */

import React from 'react';
import { Question } from '../../questions';
import { QuestionComponentProps } from './BaseQuestion';
import './RadioQuestion.css';

/**
 * Form data interface for accessing form values
 */
interface FormData {
  [key: string]: string | string[] | undefined;
}

/**
 * RadioQuestion component that renders a group of radio buttons
 * for single-selection questions in the survey
 * 
 * @param question - The question configuration object
 * @param value - Current value of the question response
 * @param onChange - Callback function when the question value changes
 * @param error - Validation error message if any
 * @param formData - Current form data state
 */
export const RadioQuestion: React.FC<QuestionComponentProps> = ({ 
  question, 
  value, 
  onChange, 
  error,
  formData 
}) => {
  /**
   * Handle sub-question input change events
   * 
   * @param e - Change event from the input element
   * @param subQuestion - Sub-question configuration
   */
  const handleSubQuestionChange = (e: React.ChangeEvent<HTMLInputElement>, subQuestion: any) => {
    let inputValue = e.target.value;
    
    // For number inputs, only allow positive integers
    if (subQuestion.type === 'number') {
      inputValue = inputValue.replace(/[^0-9]/g, '');
    }
    
    onChange(subQuestion.id, inputValue);
  };

  /**
   * Get the current value for a sub-question
   * 
   * @param subQuestionId - ID of the sub-question
   * @returns Current value of the sub-question
   */
  const getSubQuestionValue = (subQuestionId: string): string => {
    return (formData?.[subQuestionId] as string) || '';
  };

  return (
    <>
      <div className="question-text">{question.question}</div>
      {question.description && <div className="question-description">{question.description}</div>}
      {question.subtext && <div dangerouslySetInnerHTML={{ __html: question.subtext }} />}
      {question.options && (
        <div className="radio-group">
          {question.options.map((option) => (
            <div key={option.value} className="radio-option">
              <div className="radio-label-container">
                <input
                  type="radio"
                  id={`${question.id}-${option.value}`}
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(question.id, e.target.value)}
                />
                <label htmlFor={`${question.id}-${option.value}`} className="radio-label">
                  {option.label}
                </label>
              </div>
              {question.subQuestions?.map((subQuestion) => (
                subQuestion.condition?.value === option.value && value === option.value && (
                  <div key={subQuestion.id} className="other-input-container">
                    <input
                      id={subQuestion.id}
                      type={subQuestion.type === 'number' ? 'number' : 'text'}
                      min={subQuestion.min}
                      max={subQuestion.max}
                      value={getSubQuestionValue(subQuestion.id)}
                      onChange={(e) => handleSubQuestionChange(e, subQuestion)}
                      placeholder="Please specify"
                      className="other-input"
                    />
                  </div>
                )
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
