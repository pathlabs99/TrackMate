import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';

export const AccommodationQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
}) => {
  const values = value ? JSON.parse(value as string) : {};

  const handleNightsChange = (optionValue: string, nights: string) => {
    if (nights === '') {
      const updatedValues = { ...values };
      delete updatedValues[optionValue];
      onChange(question.id, JSON.stringify(updatedValues));
    } else {
      const updatedValues = {
        ...values,
        [optionValue]: nights
      };
      onChange(question.id, JSON.stringify(updatedValues));
    }
  };

  return (
    <div className="question-container">
      <div className="question-text">{question.question}</div>
      {question.subtext && <div className="question-subtext">{question.subtext}</div>}
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
