import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';
import './NumberQuestion.css';

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
      {question.description && <div className="question-description">{question.description}</div>}
      {question.subtext && <div className="question-subtext" dangerouslySetInnerHTML={{ __html: question.subtext }} />}
      
      <div className="number-input-container">
        <input
          type="number"
          id={question.id}
          min={min}
          max={max}
          value={value === undefined || value === null || value === 'null' ? '' : value}
          onChange={handleChange}
          className="number-input"
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>
      
      {error && (
        <div className="error-message" role="alert">
          <span className="error-text">{error}</span>
        </div>
      )}
    </div>
  );
};
