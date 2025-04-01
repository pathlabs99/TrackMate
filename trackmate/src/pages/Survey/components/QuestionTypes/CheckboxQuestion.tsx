import React from 'react';
import { QuestionComponentProps } from './BaseQuestion';
import './RadioQuestion.css';  // We can reuse the RadioQuestion styles

interface FormData {
  [key: string]: string | string[] | undefined;
}

export const CheckboxQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  error,
  formData,
}) => {
  const { id, options = [] } = question;
  const selectedValues = Array.isArray(value) ? value : [value];

  // Safely parse JSON data for numberOfNights and trackExpenditure
  const parseJsonData = (data: string | undefined): Record<string, string> => {
    if (!data) return {};
    try {
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  };

  const handleChange = (optionValue: string, checked: boolean) => {
    // Special handling for accommodation nights and expenditure
    if (id === 'numberOfNights' || id === 'trackExpenditure') {
      const jsonData = selectedValues.length > 0 ? parseJsonData(selectedValues[0]) : {};
      if (checked) {
        jsonData[optionValue] = id === 'numberOfNights' ? '1' : '0'; // Default to 1 night or 0 dollars
      } else {
        delete jsonData[optionValue];
      }
      // Only store if there are values
      if (Object.keys(jsonData).length > 0) {
        onChange(id, [JSON.stringify(jsonData)]);
      } else {
        onChange(id, []);
      }
      return;
    }

    // Regular checkbox handling
    const newValues = checked
      ? [...selectedValues, optionValue]
      : selectedValues.filter(v => v !== optionValue);
    onChange(id, newValues);
  };

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

  // Get value for numberOfNights or trackExpenditure
  const getJsonValue = (optionValue: string): string => {
    if ((id === 'numberOfNights' || id === 'trackExpenditure') && selectedValues.length > 0) {
      const jsonData = parseJsonData(selectedValues[0]);
      return jsonData[optionValue] || '';
    }
    return '';
  };

  // Handle changes for numberOfNights or trackExpenditure
  const handleJsonChange = (optionValue: string, value: string) => {
    if (id === 'numberOfNights' || id === 'trackExpenditure') {
      const jsonData = selectedValues.length > 0 ? parseJsonData(selectedValues[0]) : {};
      if (value === '' || value === '0') {
        delete jsonData[optionValue];
      } else {
        jsonData[optionValue] = value;
      }
      // Only store if there are values
      if (Object.keys(jsonData).length > 0) {
        onChange(id, [JSON.stringify(jsonData)]);
      } else {
        onChange(id, []);
      }
    }
  };

  // Check if an option is checked
  const isOptionChecked = (optionValue: string): boolean => {
    if (id === 'numberOfNights' || id === 'trackExpenditure') {
      if (selectedValues.length === 0) return false;
      const jsonData = parseJsonData(selectedValues[0]);
      return jsonData[optionValue] !== undefined;
    }
    return selectedValues.includes(optionValue);
  };

  return (
    <>
      <div className="question-text">{question.question}</div>
      {question.description && <div className="question-description">{question.description}</div>}
      {question.subtext && <div dangerouslySetInnerHTML={{ __html: question.subtext }} />}
      
      <div className="checkbox-group">
        {options.map((option) => (
          <div key={option.value} className="checkbox-option">
            <input
              type="checkbox"
              id={`${question.id}-${option.value}`}
              checked={selectedValues.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
            />
            <label htmlFor={`${question.id}-${option.value}`} className="checkbox-label">
              {option.label}
            </label>
            {/* Special handling for accommodation nights and expenditure */}
            {(id === 'numberOfNights' || id === 'trackExpenditure') && (
              <div className="other-input-container">
                <input
                  type="number"
                  min="0"
                  value={getJsonValue(option.value)}
                  onChange={(e) => handleJsonChange(option.value, e.target.value)}
                  placeholder="0"
                  className="other-input"
                />
              </div>
            )}
            {/* Regular subquestions handling */}
            {question.subQuestions?.map((subQuestion) => (
              subQuestion.condition?.value === option.value && selectedValues.includes(option.value) && (
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
    </>
  );
};
