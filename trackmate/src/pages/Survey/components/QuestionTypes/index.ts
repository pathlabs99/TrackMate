import React from 'react';
export * from './BaseQuestion';
export * from './RadioQuestion';
export * from './CheckboxQuestion';
export * from './TextQuestion';
export * from './DateQuestion';
export * from './NumberWithSubQuestions';
export * from './NumberQuestion';
export * from './SelectQuestion';
export * from './MatrixQuestion';

import { QuestionType } from '../../questions';
import { RadioQuestion } from './RadioQuestion';
import { CheckboxQuestion } from './CheckboxQuestion';
import { TextQuestion } from './TextQuestion';
import { DateQuestion } from './DateQuestion';
import { NumberWithSubQuestions } from './NumberWithSubQuestions';
import { NumberQuestion } from './NumberQuestion';
import { SelectQuestion } from './SelectQuestion';
import { MatrixQuestion } from './MatrixQuestion';

export const questionComponents: Record<QuestionType, React.ComponentType<any>> = {
  radio: RadioQuestion,
  checkbox: CheckboxQuestion,
  text: TextQuestion,
  textarea: TextQuestion,
  date: DateQuestion,
  number: NumberQuestion,
  numberWithSub: NumberWithSubQuestions,
  select: SelectQuestion,
  matrix: MatrixQuestion
};
