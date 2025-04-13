/**
 * @fileoverview Custom hook for managing survey form state and validation.
 * @author Abdullah
 * @date 2025-04-13
 * @filename useSurveyForm.ts
 *
 * This file contains the useSurveyForm hook which handles form state management,
 * validation, navigation, and progress persistence for the TrackMate survey.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Question } from '../questions';
import { FormData } from '../models/FormData';

/**
 * Interface for tracking validation errors
 */
interface Errors {
  [key: string]: string;
}

/**
 * Interface for storing survey progress in local storage
 */
interface SavedProgress {
  /**
   * The current form data
   */
  formData: FormData;
  
  /**
   * The current question index
   */
  currentQuestion: number;
}

/**
 * Custom hook for managing survey form state and navigation
 * 
 * @param questions - Array of survey questions
 * @returns Object containing form state and methods for manipulating it
 */
export const useSurveyForm = (questions: Question[]) => {
  const initialData: FormData = {};
  
  const [currentQuestion, setCurrentQuestion] = useState<number>(-1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Load saved progress from local storage on component mount
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('surveyProgress');
      if (saved) {
        const savedData = JSON.parse(saved);
        if (savedData && savedData.formData) {
          setFormData(savedData.formData);
          setCurrentQuestion(-1);
        }
      }
    } catch (e) {
      localStorage.removeItem('surveyProgress');
    }
  }, []);

  /**
   * Save progress to local storage when form data or current question changes
   */
  useEffect(() => {
    if (!isSubmitted) {
      const questionToSave = currentQuestion >= 0 ? currentQuestion : 
        getSavedQuestionFromStorage();
      
      if (questionToSave >= 0) {
        const progress: SavedProgress = {
          formData,
          currentQuestion: questionToSave
        };
        localStorage.setItem('surveyProgress', JSON.stringify(progress));
      }
    }
  }, [formData, currentQuestion, isSubmitted]);

  /**
   * Helper to read saved question directly from localStorage
   * 
   * @returns The saved question index or 0 if none found
   */
  const getSavedQuestionFromStorage = (): number => {
    try {
      const saved = localStorage.getItem('surveyProgress');
      if (saved) {
        const { currentQuestion } = JSON.parse(saved);
        return typeof currentQuestion === 'number' && currentQuestion >= 0 ? 
          currentQuestion : 0;
      }
    } catch (e) {
      // Error handling
    }
    return 0;
  };

  /**
   * Filter questions based on conditional logic and previous answers
   * 
   * @returns Array of questions that should be visible
   */
  const getVisibleQuestions = useCallback(() => {
    if (formData.visitedLastFourWeeks === 'no') {
      return questions.slice(0, 1);
    }

    return questions.filter((question) => {
      if (!question.condition) return true;

      const { questionId, value } = question.condition;
      const currentValue = formData[questionId];

      if (Array.isArray(value)) {
        if (!Array.isArray(currentValue)) return false;
        return value.some(v => currentValue.includes(v));
      }

      if (questionId === 'transportUsed' && value === 'other') {
        return currentValue === 'other';
      }

      if (questionId === 'residence') {
        if (question.id === 'stateTerritory') {
          return currentValue === 'australia';
        }
        if (question.id === 'overseasCountry') {
          return currentValue === 'overseas';
        }
      }

      return currentValue === value;
    });
  }, [formData, questions]);

  const visibleQuestions = useMemo(() => getVisibleQuestions(), [getVisibleQuestions]);

  /**
   * Validate the current question
   * 
   * @returns True if validation passes, false otherwise
   */
  const validateCurrentQuestion = useCallback(() => {
    const currentQ = visibleQuestions[currentQuestion];
    if (!currentQ) return true;

    const answer = formData[currentQ.id];

    if (currentQ.required) {
      if (!answer) {
        setErrors(prev => ({
          ...prev,
          [currentQ.id]: `Please ${currentQ.type === 'checkbox' ? 'select at least one option' : 'answer this question'}`
        }));
        return false;
      }

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
      today.setHours(0, 0, 0, 0);
      
      const fourWeeksAgo = new Date(today);
      fourWeeksAgo.setDate(today.getDate() - 28);

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

    if (currentQ.id === 'transportUsed' && answer === 'other') {
      if (!formData.otherTransport) {
        setErrors(prev => ({
          ...prev,
          [currentQ.id]: 'Please specify other transport method'
        }));
        return false;
      }
    }

    if (currentQ.id === 'tripDuration' && answer === 'overnight') {
      if (!formData.tripDurationOvernight) {
        setErrors(prev => ({
          ...prev,
          [currentQ.id]: 'Please specify number of nights'
        }));
        return false;
      }
    }

    if (currentQ.id === 'overseasCountry' && answer === 'other') {
      if (!formData.overseasCountryOther) {
        setErrors(prev => ({
          ...prev,
          [currentQ.id]: 'Please specify your country'
        }));
        return false;
      }
    }

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

    if (formData.transportUsed?.includes('other')) {
      if (!formData.otherTransport) {
        errors.transportUsed = 'Please specify other transport method';
      }
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[currentQ.id];
      return newErrors;
    });

    return true;
  }, [currentQuestion, formData, visibleQuestions]);

  /**
   * Start a new survey from the beginning
   */
  const handleStartSurvey = useCallback(() => {
    setCurrentQuestion(0);
  }, []);

  /**
   * Continue a previously saved survey
   */
  const handleContinueSurvey = useCallback(() => {
    try {
      const saved = localStorage.getItem('surveyProgress');
      if (saved) {
        const { currentQuestion: savedQuestion } = JSON.parse(saved);
        
        if (typeof savedQuestion === 'number' && savedQuestion >= 0) {
          const visible = getVisibleQuestions();
          
          if (visible.length === 0) {
            setCurrentQuestion(0);
            return;
          }
          
          const validQuestion = Math.min(savedQuestion, visible.length - 1);
          setCurrentQuestion(validQuestion);
          return;
        }
      }
    } catch (e) {
      // Error handling
    }
    
    setCurrentQuestion(0);
  }, [getVisibleQuestions]);

  /**
   * Move to the next question
   */
  const handleNext = useCallback(() => {
    if (validateCurrentQuestion()) {
      setCurrentQuestion(prev => Math.min(prev + 1, visibleQuestions.length - 1));
      setErrors({});
    }
  }, [validateCurrentQuestion, visibleQuestions.length]);

  /**
   * Move to the previous question
   */
  const handlePrevious = useCallback(() => {
    setCurrentQuestion(prev => Math.max(prev - 1, 0));
    setErrors({});
  }, []);

  /**
   * Clear all saved progress and reset the form
   */
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
