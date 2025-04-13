/**
 * @fileoverview Accommodation question component for the TrackMate survey application.
 * @author Abdullah
 * @date 2025-04-13
 * @filename AccommodationQuestion.tsx
 *
 * This file contains the AccommodationQuestion component which renders a specialized
 * input for collecting accommodation data with nights spent at different locations.
 */

import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';

/**
 * AccommodationQuestion component that renders a specialized input
 * for collecting accommodation data with nights spent at different locations
 * 
 * @param question - The question configuration object
 * @param value - Current value of the question response
 * @param onChange - Callback function when the question value changes
 * @param error - Validation error message if any
 */
export const AccommodationQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
}) => {
  // Parse the current values or initialize an empty object
  const values = value ? JSON.parse(value as string) : {};

  /**
   * Handle changes to the number of nights for a specific accommodation option
   * 
   * @param optionValue - The value identifier for the accommodation option
   * @param nights - The number of nights spent at this accommodation
   */
  const handleNightsChange = (optionValue: string, nights: string) => {
    if (nights === '') {
      // If nights is empty, remove this option from values
      const updatedValues = { ...values };
      delete updatedValues[optionValue];
      onChange(question.id, JSON.stringify(updatedValues));
    } else {
      // Otherwise update the values with the new nights count
      const updatedValues = {
        ...values,
        [optionValue]: nights
      };
      onChange(question.id, JSON.stringify(updatedValues));
    }
  };

  return (
    <div className="question-container">
      {/* Question text and optional subtext */}
      <div className="question-text">{question.question}</div>
      {question.subtext && <div className="question-subtext">{question.subtext}</div>}
      
      {/* Accommodation options list */}
      <div className="accommodation-options">
        {question.options?.map((option) => (
          <div key={option.value} className="accommodation-option">
            <div className="accommodation-input-group">
              <label className="accommodation-label">{option.label}</label>
              <input
                type="number"
                className="number-input"
                min="0"
                value={values[option.value] || ''}
                onChange={(e) => handleNightsChange(option.value, e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
