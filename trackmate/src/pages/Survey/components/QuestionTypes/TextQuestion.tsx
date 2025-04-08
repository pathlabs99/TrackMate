import React from 'react';
import { Question } from '../../questions';
import { QuestionComponentProps } from './BaseQuestion';

export const TextQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(question.id, e.target.value);
  };

  return (
    <div className="question-container">
      <label htmlFor={question.id}>{question.question}</label>
      {question.subtext && <p className="question-subtext">{question.subtext}</p>}
      <div className="question-content">
        <textarea
          id={question.id}
          value={value as string}
          onChange={handleChange}
          placeholder={question.subtext}
          className="text-input textarea"
          style={{ height: '36px', padding: '6px 10px', fontSize: '13px' }}
        />
      </div>
    </div>
  );
};
