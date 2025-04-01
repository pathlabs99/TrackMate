import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';
import './MatrixQuestion.css';

interface MatrixValues {
  [key: string]: string;
}

export const MatrixQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const { id, subQuestions = [] } = question;
  
  // Safely parse the value
  let matrixValues: MatrixValues = {};
  try {
    if (typeof value === 'string' && value) {
      matrixValues = JSON.parse(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      matrixValues = value as MatrixValues;
    }
  } catch (e) {
    console.error('Error parsing matrix values:', e);
  }

  // Get unique options from the first subquestion (they should all be the same)
  const options = subQuestions[0]?.options || [];

  return (
    <div className="question-container">
      <div className="question-text">{question.question}</div>
      <div className="matrix-table">
        <table>
          <thead>
            <tr>
              <th></th>
              {options.map((option) => (
                <th key={option.value} className="option-header">
                  {option.label.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subQuestions.map((subQ) => (
              <tr key={subQ.id}>
                <td className="statement">{subQ.label}</td>
                {options.map((option) => (
                  <td key={`${subQ.id}-${option.value}`}>
                    <input
                      type="radio"
                      name={subQ.id}
                      value={option.value}
                      checked={matrixValues[subQ.id] === option.value}
                      onChange={(e) => {
                        const newValues = { ...matrixValues };
                        newValues[subQ.id] = e.target.value;
                        // Update both the combined JSON and individual field
                        onChange(id, JSON.stringify(newValues));
                        onChange(subQ.id, e.target.value);
                      }}
                      required={subQ.required}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 