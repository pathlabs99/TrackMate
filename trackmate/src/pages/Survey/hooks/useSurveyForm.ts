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
  // Initialize an empty form data object
  const initialData: FormData = {};
  
  // Set default values for fields
  const [currentQuestion, setCurrentQuestion] = useState<number>(-1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load saved progress once on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('surveyProgress');
      if (saved) {
        const savedData = JSON.parse(saved);
        if (savedData && savedData.formData) {
          setFormData(savedData.formData);
          // Only set current question to welcome screen (-1)
          setCurrentQuestion(-1);
          console.log('Loaded saved progress, form data restored');
        }
      }
    } catch (e) {
      // If there's an error, just start fresh
      console.error('Error loading saved progress:', e);
      localStorage.removeItem('surveyProgress');
    }
  }, []);

  // Save progress whenever formData or currentQuestion changes
  useEffect(() => {
    if (!isSubmitted) {
      // Never save a welcome screen state (-1) as the current question
      // This ensures we always save the actual question number
      const questionToSave = currentQuestion >= 0 ? currentQuestion : 
        // If we're at welcome screen, try to get the previously saved question
        getSavedQuestionFromStorage();
      
      // Only save if we have a valid question number (>= 0)
      if (questionToSave >= 0) {
        const progress: SavedProgress = {
          formData,
          currentQuestion: questionToSave
        };
        localStorage.setItem('surveyProgress', JSON.stringify(progress));
        console.log(`Saved progress at question ${questionToSave + 1}`);
      }
    }
  }, [formData, currentQuestion, isSubmitted]);

  // Helper to read saved question directly from localStorage
  const getSavedQuestionFromStorage = (): number => {
    try {
      const saved = localStorage.getItem('surveyProgress');
      if (saved) {
        const { currentQuestion } = JSON.parse(saved);
        return typeof currentQuestion === 'number' && currentQuestion >= 0 ? 
          currentQuestion : 0;
      }
    } catch (e) {
      console.error('Error getting saved question:', e);
    }
    return 0; // Default to first question if nothing saved
  };

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
      if (questionId === 'residence') {
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
    setCurrentQuestion(0); // Always start from the beginning for new surveys
  }, []);

  const handleContinueSurvey = useCallback(() => {
    // Simple direct implementation - read from localStorage and set current question
    try {
      const saved = localStorage.getItem('surveyProgress');
      if (saved) {
        const { currentQuestion: savedQuestion } = JSON.parse(saved);
        
        if (typeof savedQuestion === 'number' && savedQuestion >= 0) {
          // Calculate visible questions based on form data
          const visible = getVisibleQuestions();
          
          if (visible.length === 0) {
            console.error('No visible questions available');
            setCurrentQuestion(0);
            return;
          }
          
          // Ensure the question is within bounds
          const validQuestion = Math.min(savedQuestion, visible.length - 1);
          console.log(`Resuming survey directly at question ${validQuestion + 1}`);
          
          // IMPORTANT: Directly set the question number
          setCurrentQuestion(validQuestion);
          return;
        }
      }
    } catch (e) {
      console.error('Error in handleContinueSurvey:', e);
    }
    
    // If anything fails, start from the beginning
    console.log('Fallback to first question');
    setCurrentQuestion(0);
  }, [getVisibleQuestions]);

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
    setFormData({});
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
    handleContinueSurvey,
    handleNext,
    handlePrevious,
    validateCurrentQuestion,
    clearProgress
  };
};

