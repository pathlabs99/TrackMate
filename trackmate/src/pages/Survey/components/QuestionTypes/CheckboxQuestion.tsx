import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';

interface FormData {
  [key: string]: string | string[] | undefined;
}

export const CheckboxQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  error,
  formData,
}) => {
  const { id, options = [] } = question;
  const selectedValues = Array.isArray(value) ? value : [value];

  const handleChange = (optionValue: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, optionValue]
      : selectedValues.filter(v => v !== optionValue);
    onChange(id, newValues);
  };

  const handleNightsChange = (optionValue: string, nights: string) => {
    // Only allow non-negative integers
    const validatedValue = nights.replace(/[^0-9]/g, '');
    onChange(`${id}_${optionValue}_nights`, validatedValue);
  };

  // Only show nights input for accommodation question
  const showNightsInput = id === 'accommodation';

  return (
    <>
      <div className="question-text">{question.question}</div>
      {question.subtext && <div className="question-subtext">{question.subtext}</div>}
      <div className="checkbox-group">
        {options.map((option) => (
          <div key={option.value} className="checkbox-option">
            <input
              type="checkbox"
              id={`${id}-${option.value}`}
              name={id}
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
            />
            <label htmlFor={`${id}-${option.value}`} className="checkbox-label">
              {option.label}
            </label>
            {showNightsInput && selectedValues.includes(option.value) && (
              <div className="other-input-container">
                <input
                  type="number"
                  min="0"
                  value={(formData[`${id}_${option.value}_nights`] as string) ?? ''}
                  onChange={(e) => handleNightsChange(option.value, e.target.value)}
                  placeholder="Number of nights"
                  className="text-input"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
