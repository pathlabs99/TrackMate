import React from 'react';
import { Question } from '../../questions';
import { QuestionComponentProps } from './BaseQuestion';

interface FormData {
  walkDurationNights?: string;
  transportUsedOther?: string;
  [key: string]: string | string[] | undefined;
}

export const RadioQuestion: React.FC<QuestionComponentProps> = ({ 
  question, 
  value, 
  onChange, 
  error 
}) => {
  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    if (question.id === 'walkDuration') {
      // Only allow positive integers for walkDuration
      inputValue = inputValue.replace(/[^0-9]/g, '');
    }
    const fieldName = question.id === 'walkDuration' ? 'walkDurationNights' : 'transportUsedOther';
    
    // Update both the main value and the other value
    onChange(question.id, question.id === 'walkDuration' ? 'overnight' : 'other');
    onChange(fieldName, inputValue);
    
    // Update localStorage
    const currentData = JSON.parse(localStorage.getItem('surveyFormData') || '{}');
    localStorage.setItem('surveyFormData', JSON.stringify({
      ...currentData,
      [question.id]: question.id === 'walkDuration' ? 'overnight' : 'other',
      [fieldName]: inputValue
    }));
  };

  // Get the form data values
  const formData: FormData = localStorage.getItem('surveyFormData') ? 
    JSON.parse(localStorage.getItem('surveyFormData') || '{}') : {};
  const otherValue = question.id === 'walkDuration' ? 
    formData.walkDurationNights || '' : 
    formData.transportUsedOther || '';

  return (
    <>
      <div className="question-text">{question.question}</div>
      {question.subtext && <div className="question-subtext">{question.subtext}</div>}
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
              {((question.id === 'transportUsed' && option.value === 'other' && value === 'other') ||
                (question.id === 'walkDuration' && option.value === 'overnight' && value === 'overnight')) && (
                <div className="other-input-container">
                  <input
                    type={question.id === 'walkDuration' ? 'number' : 'text'}
                    min={question.id === 'walkDuration' ? '0' : undefined}
                    value={otherValue}
                    onChange={handleOtherTextChange}
                    placeholder={question.id === 'walkDuration' ? 'Enter number of nights' : 'Please specify'}
                    className="other-input"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
