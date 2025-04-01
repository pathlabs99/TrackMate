import { useState, useCallback, useMemo, useEffect } from 'react';
import { Question } from '../questions';
import { FormData } from '../models/FormData';

interface Errors {
  [key: string]: string;
}

interface SavedProgress {
  formData: FormData;
  currentQuestion: number;
}

export const useSurveyForm = (questions: Question[]) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('surveyProgress');
      if (saved) {
        const { currentQuestion } = JSON.parse(saved) as SavedProgress;
        return currentQuestion;
      }
    } catch (e) {
      console.error('Error loading saved question:', e);
    }
    return -1;
  });

  const [formData, setFormData] = useState<FormData>(() => {
    try {
      // Try to load saved progress
      const saved = localStorage.getItem('surveyProgress');
      if (saved) {
        const { formData } = JSON.parse(saved) as SavedProgress;
        return formData;
      }
    } catch (e) {
      console.error('Error loading saved progress:', e);
    }

    // Initialize with empty form data if no saved progress
    const initialData: FormData = {};
    questions.forEach(question => {
      if (question.type === 'checkbox') {
        initialData[question.id] = [];
      } else {
        initialData[question.id] = '';
      }
    });
    return initialData;
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Save progress whenever formData or currentQuestion changes
  useEffect(() => {
    if (currentQuestion >= -1 && !isSubmitted) {
      const progress: SavedProgress = {
        formData,
        currentQuestion
      };
      localStorage.setItem('surveyProgress', JSON.stringify(progress));
    }
  }, [formData, currentQuestion, isSubmitted]);

  const getVisibleQuestions = useCallback(() => {
    // If they answered "no" to first question, only show that question
    if (formData.visitedLastFourWeeks === 'no') {
      return questions.slice(0, 1);
    }

    return questions.filter((question) => {
      if (!question.condition) return true;

      const { questionId, value } = question.condition;
      const currentValue = formData[questionId];

      // Handle checkbox conditions
      if (Array.isArray(value)) {
        if (!Array.isArray(currentValue)) return false;
        return value.some(v => currentValue.includes(v));
      }

      // Handle 'other' transport special case
      if (questionId === 'transportUsed' && value === 'other') {
        return currentValue === 'other';
      }

      // Handle residence questions
      if (questionId === 'placeOfResidence') {
        // For state/territory question, show only if user selected Australia
        if (question.id === 'stateTerritory') {
          return currentValue === 'australia';
        }
        // For overseas country question, show only if user selected overseas
        if (question.id === 'overseasCountry') {
          return currentValue === 'overseas';
        }
      }

      return currentValue === value;
    });
  }, [formData, questions]);

  const visibleQuestions = useMemo(() => getVisibleQuestions(), [getVisibleQuestions]);

  const validateCurrentQuestion = useCallback(() => {
    const currentQ = visibleQuestions[currentQuestion];
    if (!currentQ) return true;

    const answer = formData[currentQ.id];

    // For required questions
    if (currentQ.required) {
      if (!answer) {
        setErrors(prev => ({
          ...prev,
          [currentQ.id]: `Please ${currentQ.type === 'checkbox' ? 'select at least one option' : 'answer this question'}`
        }));
        return false;
      }

      // For checkbox questions, ensure at least one option is selected
      if (currentQ.type === 'checkbox') {
        const selectedValues = Array.isArray(answer) ? answer : [];
        if (selectedValues.length === 0) {
          setErrors(prev => ({
            ...prev,
            [currentQ.id]: 'Please select at least one option'
          }));
          return false;
        }
      }
    }

    // Date validation - must be within last 4 weeks
    if (currentQ.type === 'date' && answer) {
      if (typeof answer !== 'string') {
        setErrors(prev => ({
          ...prev,
          [currentQ.id]: 'Invalid date format'
        }));
        return false;
      }
      const selectedDate = new Date(answer);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      
      const fourWeeksAgo = new Date(today);
      fourWeeksAgo.setDate(today.getDate() - 28); // 4 weeks = 28 days

      if (selectedDate > today) {
        setErrors(prev => ({
          ...prev,
          [currentQ.id]: 'Date cannot be in the future'
        }));
        return false;
      } else if (selectedDate < fourWeeksAgo) {
        setErrors(prev => ({
          ...prev,
          [currentQ.id]: 'Date must be within the last 4 weeks'
        }));
        return false;
      }
    }

    // Special validation for "Other" transport
    if (currentQ.id === 'transportUsed' && answer === 'other') {
      if (!formData.otherTransport) {
        setErrors(prev => ({
          ...prev,
          [currentQ.id]: 'Please specify other transport method'
        }));
        return false;
      }
    }

    // Special validation for "Overnight" duration
    if (currentQ.id === 'tripDuration' && answer === 'overnight') {
      if (!formData.tripDurationOvernight) {
        setErrors(prev => ({
          ...prev,
          [currentQ.id]: 'Please specify number of nights'
        }));
        return false;
      }
    }

    // Special validation for overseas country "Other" option
    if (currentQ.id === 'overseasCountry' && answer === 'other') {
      if (!formData.overseasCountryOther) {
        setErrors(prev => ({
          ...prev,
          [currentQ.id]: 'Please specify your country'
        }));
        return false;
      }
    }

    // Special validation for totalKilometers to ensure it's a valid number
    if (currentQ.id === 'totalKilometers') {
      const kilometers = Number(answer);
      if (isNaN(kilometers) || kilometers <= 0) {
        setErrors(prev => ({
          ...prev,
          [currentQ.id]: 'Please enter a valid distance greater than 0'
        }));
        return false;
      }
    }

    // Check if 'other' is selected but no specification provided
    if (formData.transportUsed?.includes('other')) {
      if (!formData.otherTransport) {
        errors.transportUsed = 'Please specify other transport method';
      }
    }

    // Clear any existing errors for this question
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[currentQ.id];
      return newErrors;
    });

    return true;
  }, [currentQuestion, formData, visibleQuestions]);

  const handleStartSurvey = useCallback(() => {
    setCurrentQuestion(0);
  }, []);

  const handleNext = useCallback(() => {
    if (validateCurrentQuestion()) {
      setCurrentQuestion(prev => Math.min(prev + 1, visibleQuestions.length - 1));
      setErrors({});
    }
  }, [validateCurrentQuestion, visibleQuestions.length]);

  const handlePrevious = useCallback(() => {
    setCurrentQuestion(prev => Math.max(prev - 1, 0));
    setErrors({});
  }, []);

  const clearProgress = useCallback(() => {
    localStorage.removeItem('surveyProgress');
    setFormData({} as FormData);
    setCurrentQuestion(-1);
    setErrors({});
    setIsSubmitted(false);
  }, []);

  return {
    formData,
    currentQuestion,
    errors,
    isSubmitted,
    visibleQuestions,
    setFormData,
    setCurrentQuestion,
    setIsSubmitted,
    setErrors,
    handleStartSurvey,
    handleNext,
    handlePrevious,
    validateCurrentQuestion,
    clearProgress
  };
};
