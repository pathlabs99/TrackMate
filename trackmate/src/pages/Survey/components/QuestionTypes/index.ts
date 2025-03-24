import React from 'react';
export * from './BaseQuestion';
export * from './RadioQuestion';
export * from './CheckboxQuestion';
export * from './TextQuestion';
export * from './DateQuestion';
export * from './NumberWithSubQuestions';

import { QuestionType } from '../../questions';
import { RadioQuestion } from './RadioQuestion';
import { CheckboxQuestion } from './CheckboxQuestion';
import { TextQuestion } from './TextQuestion';
import { DateQuestion } from './DateQuestion';
import { NumberWithSubQuestions } from './NumberWithSubQuestions';

export const questionComponents: Record<QuestionType, React.ComponentType<any>> = {
  radio: RadioQuestion,
  checkbox: CheckboxQuestion,
  text: TextQuestion,
  textarea: TextQuestion,
  date: DateQuestion,
  number: NumberWithSubQuestions,
  select: RadioQuestion
};
