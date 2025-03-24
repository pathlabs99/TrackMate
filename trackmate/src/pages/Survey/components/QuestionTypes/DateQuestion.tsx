import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';

export const DateQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
}) => {
  const { id, placeholder, description, question: questionText } = question;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    onChange(id, newDate);
  };

  return (
    <div className="question-field">
      <div className="question-text">
        {questionText}
        {description && <span className="question-description">{description}</span>}
      </div>
      <div className="date-input-wrapper">
        <div className="date-field">
          <input
            type="date"
            id={id}
            name={id}
            value={value as string || ''}
            onChange={handleChange}
            placeholder={placeholder}
            className="date-input"
            max={new Date().toISOString().split('T')[0]} // Prevent future dates in native picker
          />
        </div>
      </div>
    </div>
  );
};
