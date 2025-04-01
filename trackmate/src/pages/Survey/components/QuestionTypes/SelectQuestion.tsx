import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';
import './SelectQuestion.css';

interface SelectValues {
  [key: string]: string;
}

export const SelectQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const { id, options = [], subQuestions = [] } = question;
  
  // Safely parse the value
  let selectValues: SelectValues = {};
  try {
    if (typeof value === 'string' && value) {
      selectValues = JSON.parse(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      selectValues = value as SelectValues;
    }
  } catch (e) {
    console.error('Error parsing select values:', e);
  }

  return (
    <div className="question-container">
      <div className="question-text">{question.question}</div>
      {question.description && <div className="question-description">{question.description}</div>}
      {question.subtext && <div dangerouslySetInnerHTML={{ __html: question.subtext }} />}
      
      <div className="select-group">
        {subQuestions.map((subQ) => (
          <div key={subQ.id} className="select-option">
            <label htmlFor={subQ.id}>{subQ.label}</label>
            {subQ.type === 'select' ? (
              <select
                id={subQ.id}
                value={selectValues[subQ.id] || ''}
                onChange={(e) => {
                  const newValues = { ...selectValues };
                  newValues[subQ.id] = e.target.value;
                  onChange(id, JSON.stringify(newValues));
                }}
                className="select-input"
                required={subQ.required}
              >
                <option value="">Select an option</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                id={subQ.id}
                value={selectValues[subQ.id] || ''}
                onChange={(e) => {
                  const newValues = { ...selectValues };
                  newValues[subQ.id] = e.target.value;
                  onChange(id, JSON.stringify(newValues));
                }}
                className="text-input"
                placeholder="Enter custom point"
                required={subQ.required}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 