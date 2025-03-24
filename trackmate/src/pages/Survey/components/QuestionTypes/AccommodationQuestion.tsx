import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';

export const AccommodationQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
}) => {
  const values = value ? JSON.parse(value as string) : {};

  const handleChange = (updatedValues: { [key: string]: string }) => {
    onChange(question.id, JSON.stringify(updatedValues));
  };

  const handleNightsChange = (optionValue: string, nights: string) => {
    const updatedValues = {
      ...values,
      [optionValue]: nights
    };
    handleChange(updatedValues);
  };

  const handleSubQuestionChange = (subQuestionId: string, value: string) => {
    const newValues = { ...values };
    newValues[subQuestionId] = value;
    handleChange(newValues);
  };

  return (
    <div className="question-container">
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
