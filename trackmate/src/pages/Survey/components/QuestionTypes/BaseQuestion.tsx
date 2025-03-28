import React from 'react';
import { Question } from '../../questions';
import { FormData } from '../../models/FormData';

interface BaseQuestionProps {
  question: Question;
  value: string | string[];
  onChange: (questionId: string, value: string | string[]) => void;
  error?: string;
  formData: FormData;
}

export const BaseQuestion: React.FC<BaseQuestionProps> = ({
  question,
  value,
  onChange,
  error,
  formData,
}) => {
  const { id, placeholder } = question;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    onChange(id, e.target.value);
  };

  return (
    <div className="question-container">
      <div className="question-text">{question.question}</div>
      {question.subtext && (
        <div className="question-subtext">{question.subtext}</div>
      )}
      <div className="question-content">
        <input
          type="text"
          id={id}
          value={value as string}
          onChange={handleChange}
          placeholder={placeholder}
          className="text-input"
        />
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export interface QuestionComponentProps {
  question: Question;
  value: string | string[];
  onChange: (questionId: string, value: string | string[]) => void;
  error?: string;
  formData: FormData;
}
