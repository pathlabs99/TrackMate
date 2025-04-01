import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';

export const NumberQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const { question: questionText, min, max } = question;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow empty string or valid numbers
    if (newValue === '' || !isNaN(Number(newValue))) {
      onChange(question.id, newValue);
    }
  };

  return (
    <div className="question-container">
      <div className="question-text">{questionText}</div>
      <input
        type="number"
        id={question.id}
        min={min}
        max={max}
        value={value === undefined || value === null ? '' : value}
        onChange={handleChange}
        className="number-input"
      />
    </div>
  );
};
