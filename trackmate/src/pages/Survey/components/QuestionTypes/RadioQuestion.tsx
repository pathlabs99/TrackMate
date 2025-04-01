import React from 'react';
import { Question } from '../../questions';
import { QuestionComponentProps } from './BaseQuestion';
import './RadioQuestion.css';

interface FormData {
  [key: string]: string | string[] | undefined;
}

export const RadioQuestion: React.FC<QuestionComponentProps> = ({ 
  question, 
  value, 
  onChange, 
  error,
  formData 
}) => {
  const handleSubQuestionChange = (e: React.ChangeEvent<HTMLInputElement>, subQuestion: any) => {
    let inputValue = e.target.value;
    
    // For number inputs, only allow positive integers
    if (subQuestion.type === 'number') {
      inputValue = inputValue.replace(/[^0-9]/g, '');
    }
    
    onChange(subQuestion.id, inputValue);
  };

  const getSubQuestionValue = (subQuestionId: string): string => {
    return (formData?.[subQuestionId] as string) || '';
  };

  return (
    <>
      <div className="question-text">{question.question}</div>
      {question.description && <div className="question-description">{question.description}</div>}
      {question.subtext && <div dangerouslySetInnerHTML={{ __html: question.subtext }} />}
      {question.options && (
        <div className="radio-group">
          {question.options.map((option) => (
            <div key={option.value} className="radio-option">
              <input
                type="radio"
                id={`${question.id}-${option.value}`}
                name={question.id}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(question.id, e.target.value)}
              />
              <label htmlFor={`${question.id}-${option.value}`} className="radio-label">
                {option.label}
              </label>
              {question.subQuestions?.map((subQuestion) => (
                subQuestion.condition?.value === option.value && value === option.value && (
                  <div key={subQuestion.id} className="other-input-container">
                    <input
                      id={subQuestion.id}
                      type={subQuestion.type === 'number' ? 'number' : 'text'}
                      min={subQuestion.min}
                      max={subQuestion.max}
                      value={getSubQuestionValue(subQuestion.id)}
                      onChange={(e) => handleSubQuestionChange(e, subQuestion)}
                      placeholder="Please specify"
                      className="other-input"
                      required={subQuestion.required}
                    />
                  </div>
                )
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
