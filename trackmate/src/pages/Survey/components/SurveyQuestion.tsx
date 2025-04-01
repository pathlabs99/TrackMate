import React from 'react';
import { Question } from '../questions';
import { questionComponents } from './QuestionTypes';
import { FormData } from '../models/FormData';

interface SurveyQuestionProps {
  question: Question;
  value: string | string[];
  onChange: (questionId: string, value: string | string[]) => void;
  error?: string;
  formData: FormData;
}

export const SurveyQuestion: React.FC<SurveyQuestionProps> = ({
  question,
  value,
  onChange,
  error,
  formData
}) => {
  const QuestionComponent = questionComponents[question.type];

  if (!QuestionComponent) {
    console.warn(`No component found for question type: ${question.type}`);
    return null;
  }

  return (
    <div className="question-container">
      <QuestionComponent
        question={question}
        value={value}
        onChange={onChange}
        error={error}
        formData={formData}
      />
      {error && (
        <div className="validation-error" role="alert">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}
    </div>
  );
};
