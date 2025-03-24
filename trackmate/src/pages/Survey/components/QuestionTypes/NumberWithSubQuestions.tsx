import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';

export const NumberWithSubQuestions: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const { subQuestions = [], question: questionText } = question;
  const values = value ? JSON.parse(value as string) : {};

  const handleSubQuestionChange = (subQuestionId: string, newValue: string) => {
    const updatedValues = {
      ...values,
      [subQuestionId]: newValue
    };
    onChange(question.id, JSON.stringify(updatedValues));
  };

  return (
    <div className="question-container">
      <div className="question-text">{questionText}</div>
      <div className="sub-questions-group">
        {question.subQuestions?.map((subQ) => (
          <div key={subQ.id} className="sub-question-block">
            <div className="sub-question-label">
              {subQ.label}
            </div>
            <input
              type="number"
              id={subQ.id}
              min={subQ.min}
              max={subQ.max}
              value={values[subQ.id] || ''}
              onChange={(e) => handleSubQuestionChange(subQ.id, e.target.value)}
              className="number-input"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
