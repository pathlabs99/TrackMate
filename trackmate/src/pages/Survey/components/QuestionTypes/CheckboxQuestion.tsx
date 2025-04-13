/**
 * @fileoverview Checkbox question component for the TrackMate survey application.
 * @author Abdullah
 * @date 2025-04-13
 * @filename CheckboxQuestion.tsx
 *
 * This file contains the CheckboxQuestion component which renders a group of checkbox
 * inputs for multiple-selection questions, with support for special handling of
 * accommodation nights and expenditure data.
 */

import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';
import './RadioQuestion.css';  // We can reuse the RadioQuestion styles

interface FormData {
  [key: string]: string | string[] | undefined;
}

/**
 * CheckboxQuestion component that renders a group of checkbox inputs
 * for multiple-selection questions in the survey
 * 
 * @param question - The question configuration object
 * @param value - Current value of the question response
 * @param onChange - Callback function when the question value changes
 * @param error - Validation error message if any
 * @param formData - Current form data state
 */
export const CheckboxQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  error,
  formData,
}) => {
  const { id, options = [] } = question;
  const selectedValues = Array.isArray(value) ? value : [value];

  /**
   * Safely parse JSON data for numberOfNights and trackExpenditure
   * 
   * @param data - JSON string to parse
   * @returns Parsed object or empty object if parsing fails
   */
  const parseJsonData = (data: string | undefined): Record<string, string> => {
    if (!data) return {};
    try {
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  };

  /**
   * Handle checkbox change events
   * 
   * @param optionValue - Value of the selected option
   * @param checked - Whether the checkbox is checked
   */
  const handleChange = (optionValue: string, checked: boolean) => {
    // Special handling for accommodation nights and expenditure
    if (id === 'numberOfNights' || id === 'trackExpenditure') {
      const jsonData = selectedValues.length > 0 ? parseJsonData(selectedValues[0]) : {};
      if (checked) {
        jsonData[optionValue] = id === 'numberOfNights' ? '1' : '0'; // Default to 1 night or 0 dollars
      } else {
        delete jsonData[optionValue];
      }
      // Only store if there are values
      if (Object.keys(jsonData).length > 0) {
        onChange(id, [JSON.stringify(jsonData)]);
      } else {
        onChange(id, []);
      }
      return;
    }

    // Regular checkbox handling
    const newValues = checked
      ? [...selectedValues, optionValue]
      : selectedValues.filter(v => v !== optionValue);
    onChange(id, newValues);
  };

  /**
   * Handle changes for sub-questions
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

  /**
   * Get value for numberOfNights or trackExpenditure
   * 
   * @param optionValue - Value of the selected option
   * @returns Current value for the option
   */
  const getJsonValue = (optionValue: string): string => {
    if ((id === 'numberOfNights' || id === 'trackExpenditure') && selectedValues.length > 0) {
      const jsonData = parseJsonData(selectedValues[0]);
      return jsonData[optionValue] || '';
    }
    return '';
  };

  /**
   * Handle changes for numberOfNights or trackExpenditure
   * 
   * @param optionValue - Value of the selected option
   * @param value - New value for the option
   */
  const handleJsonChange = (optionValue: string, value: string) => {
    if (id === 'numberOfNights' || id === 'trackExpenditure') {
      const jsonData = selectedValues.length > 0 ? parseJsonData(selectedValues[0]) : {};
      if (value === '' || value === '0') {
        delete jsonData[optionValue];
      } else {
        jsonData[optionValue] = value;
      }
      // Only store if there are values
      if (Object.keys(jsonData).length > 0) {
        onChange(id, [JSON.stringify(jsonData)]);
      } else {
        onChange(id, []);
      }
    }
  };

  /**
   * Check if an option is checked
   * 
   * @param optionValue - Value of the option to check
   * @returns Whether the option is checked
   */
  const isOptionChecked = (optionValue: string): boolean => {
    if (id === 'numberOfNights' || id === 'trackExpenditure') {
      if (selectedValues.length === 0) return false;
      const jsonData = parseJsonData(selectedValues[0]);
      return jsonData[optionValue] !== undefined;
    }
    return selectedValues.includes(optionValue);
  };

  return (
    <>
      <div className="question-text">{question.question}</div>
      {question.description && <div className="question-description">{question.description}</div>}
      {question.subtext && <div dangerouslySetInnerHTML={{ __html: question.subtext }} />}
      
      <div className="checkbox-group">
        {options.map((option) => (
          <div key={option.value} className="checkbox-option">
            <div className="checkbox-label-container">
              <input
                type="checkbox"
                id={`${id}-${option.value}`}
                checked={isOptionChecked(option.value)}
                onChange={(e) => handleChange(option.value, e.target.checked)}
              />
              <label htmlFor={`${id}-${option.value}`} className="checkbox-label">
                {option.label}
              </label>
            </div>
            {question.subQuestions?.map((subQuestion) => (
              subQuestion.condition?.value === option.value && isOptionChecked(option.value) && (
                <div key={subQuestion.id} className="other-input-container">
                  <input
                    type={subQuestion.type === 'number' ? 'number' : 'text'}
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
    </>
  );
};
