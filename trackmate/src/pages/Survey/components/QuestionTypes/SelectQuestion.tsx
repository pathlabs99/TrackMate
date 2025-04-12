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
  
  // Handle both string values and object values
  let selectValues: SelectValues = {};
  try {
    if (typeof value === 'string' && value) {
      // For standalone select questions
      if (subQuestions.length === 0) {
        selectValues = { main: value };
      } else {
        // For select questions with subquestions
        selectValues = JSON.parse(value);
      }
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
        {/* Render main select if no subquestions */}
        {subQuestions.length === 0 && (
          <div className="select-wrapper">
            <select
              id={id}
              value={selectValues.main || ''}
              onChange={(e) => onChange(id, e.target.value)}
              className="select-input"
              required={question.required}
            >
              <option value="">Select an option</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Render subquestions if any */}
        {subQuestions.map((subQ) => (
          <div key={subQ.id} className="select-option">
            <label htmlFor={subQ.id}>{subQ.label}</label>
            {subQ.type === 'select' ? (
              <div className="select-wrapper">
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
                  {subQ.options ? subQ.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  )) : options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
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