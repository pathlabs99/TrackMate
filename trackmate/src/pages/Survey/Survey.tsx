/**
 * @fileoverview Main survey component for the TrackMate application.
 * @author Abdullah
 * @date 2025-04-13
 * @filename Survey.tsx
 *
 * This file contains the Survey component which handles the survey UI,
 * navigation, submission, and offline capabilities.
 */

import React, { useState, useEffect, useCallback } from "react";
import { IonModal, IonToast } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { surveyQuestions } from "./questions";
import { SurveyQuestion } from "./components/SurveyQuestion";
import { SurveyCompletion } from './components/SurveyCompletion';
import { useSurveyForm } from "./hooks/useSurveyForm";
import { generateCSV, generateSurveyId, formatSubmissionDate } from "./utils/CSV";
import { sendCSVToServer, syncPendingSubmissions, checkNetworkStatus, addNetworkListener, removeNetworkListener } from './utils/Network';
import { getPendingSubmissions, saveOfflineSubmission } from './utils/Storage';
import SurveyCard from "./components/SurveyCard";
import "./Survey.css";

/**
 * Survey component that manages the entire survey flow
 */
export const Survey: React.FC = () => {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [, setSubmissionProgress] = useState<{ status: string; progress: number } | null>(null);
  const [, setIsOnline] = useState(true);
  const [, setPendingCount] = useState(0);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [showResumeToast, setShowResumeToast] = useState(false);

  const {
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
    validateCurrentQuestion,
    clearProgress
  } = useSurveyForm(surveyQuestions);

  /**
   * Show exit confirmation modal
   */
  const handleExit = () => {
    setShowExitModal(true);
  };

  /**
   * Save current progress and exit the survey
   */
  const handleSaveAndExit = () => {
    const progressData = {
      formData,
      currentQuestion
    };
    localStorage.setItem('surveyProgress', JSON.stringify(progressData));
    
    setShowExitModal(false);
    setCurrentQuestion(-1);
  };

  /**
   * Discard current progress and exit the survey
   */
  const handleDiscardAndExit = () => {
    clearProgress();
    setShowExitModal(false);
    setCurrentQuestion(-1);
  };

  /**
   * Handle form input changes
   * 
   * @param questionId - ID of the question being answered
   * @param value - New value for the question
   */
  const handleCustomInputChange = (questionId: string, value: string | string[]) => {
    setFormData(prev => {
      const newFormData = { ...prev };

      if (questionId === 'otherTransport') {
        newFormData.otherTransport = value as string;
      } else {
        const question = surveyQuestions.find((q) => q.id === questionId);
        if (question?.type === "checkbox") {
          newFormData[questionId] = Array.isArray(value) ? value : [value];
        } else if (question?.type === "number") {
          newFormData[questionId] = value;
        } else {
          newFormData[questionId] = value as string;
          if (questionId === 'transportUsed' && value !== 'other') {
            newFormData.otherTransport = '';
          }
        }
      }

      return newFormData;
    });

    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  /**
   * Get the current value for a question
   * 
   * @param questionId - ID of the question
   * @returns The current value for the question
   */
  const getQuestionValue = (questionId: string): string | string[] => {
    try {
      const value = formData[questionId];
      if (Array.isArray(value)) return value;
      if (value === null || value === undefined) return '';
      return String(value);
    } catch (e) {
      return '';
    }
  };

  /**
   * Handle survey submission
   */
  const handleSubmit = async () => {
    if (!validateCurrentQuestion()) return;

    if (currentQuestion === 0 && formData.visitedLastFourWeeks === 'no') {
      history.push('/menu');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmissionProgress({ status: 'preparing', progress: 0 });

    try {
      const timestamp = new Date().toISOString();
      const surveyId = generateSurveyId();
      const formattedDate = formatSubmissionDate(timestamp);

      const submissionData = {
        ...formData,
        surveyId,
        submissionDate: formattedDate,
        timestamp
      };

      const csvData = await generateCSV(submissionData);
      const fileName = `survey_${surveyId}`;

      const networkStatus = await checkNetworkStatus();
      if (networkStatus) {
        await sendCSVToServer(csvData, fileName, (progress) => {
          setSubmissionProgress(progress);
        });

        localStorage.setItem('surveyFormData', JSON.stringify(submissionData));
        setIsSubmitted(true);
      } else {
        await saveOfflineSubmission(submissionData);
        setPendingCount(prev => prev + 1);
        setShowOfflineToast(true);
        setIsSubmitted(true);
      }
    } catch (error) {
      const networkStatus = await checkNetworkStatus();
      if (!networkStatus) {
        setShowOfflineToast(true);
      } else {
        setSubmitError('Failed to submit survey. Please try again.');
      }
      setSubmissionProgress(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Navigate to the next question
   */
  const handleNext = useCallback(() => {
    if (validateCurrentQuestion()) {
      const currentQ = visibleQuestions[currentQuestion];
      if (currentQ.id === 'visitedLastFourWeeks' && formData.visitedLastFourWeeks === 'no') {
        history.push('/menu');
      } else {
        setCurrentQuestion(prev => Math.min(prev + 1, visibleQuestions.length - 1));
        setErrors({});
      }
    }
  }, [validateCurrentQuestion, visibleQuestions, currentQuestion, formData.visitedLastFourWeeks, history]);

  /**
   * Navigate to the previous question
   */
  const handlePrevious = useCallback(() => {
    setCurrentQuestion(prev => Math.max(prev - 1, 0));
    setErrors({});
  }, []);

  /**
   * Check network status and pending submissions on mount
   */
  useEffect(() => {
    let isSubscribed = true;
    let syncTimeout: NodeJS.Timeout | null = null;

    const checkStatus = async () => {
      if (!isSubscribed) return;

      const networkStatus = await checkNetworkStatus();
      setIsOnline(networkStatus);

      const pending = await getPendingSubmissions();
      setPendingCount(pending.length);
    };

    checkStatus();

    const handleNetworkChange = (connected: boolean) => {
      if (!isSubscribed) return;
      
      setIsOnline(connected);
      
      if (syncTimeout) {
        clearTimeout(syncTimeout);
      }

      if (connected) {
        syncTimeout = setTimeout(() => {
          syncPendingSubmissions()
            .then(count => {
              if (count > 0 && isSubscribed) {
                setSubmitError(`${count} pending survey(s) synced successfully`);
                getPendingSubmissions().then(pending => {
                  if (isSubscribed) {
                    setPendingCount(pending.length);
                  }
                });
              }
            })
            .catch(() => {
              // Error handling
            });
        }, 2000);
      }
    };

    addNetworkListener(handleNetworkChange);

    return () => {
      isSubscribed = false;
      if (syncTimeout) {
        clearTimeout(syncTimeout);
      }
      removeNetworkListener(handleNetworkChange);
    };
  }, []);

  /**
   * Continue a saved survey and show feedback toast
   */
  const handleContinueWithFeedback = () => {
    try {
      const saved = localStorage.getItem('surveyProgress');
      if (saved) {
        const { currentQuestion } = JSON.parse(saved);
        if (typeof currentQuestion === 'number' && currentQuestion >= 0) {
          handleContinueSurvey();
          
          setTimeout(() => {
            setShowResumeToast(true);
          }, 300);
          return;
        }
      }
    } catch (e) {
      // Error handling
    }
    
    handleContinueSurvey();
    setShowResumeToast(true);
  };

  /**
   * Render the submission progress screen
   */
  const renderSubmissionScreen = () => {
    return (
      <div className="submission-screen">
        <h2 className="submission-title">Submitting Survey</h2>
        <div className="submission-progress-bar">
          <div className="submission-progress-fill" />
        </div>
        <p>Please wait a moment...</p>
      </div>
    );
  };

  return (
    <>
      {(() => {
        try {
          return (
            <div className="survey-container">
              <div className="survey-header">
                {currentQuestion >= 0 && (
                  <button className="exit-button" onClick={handleExit}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Exit
                  </button>
                )}
                {currentQuestion >= 0 && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${((currentQuestion + 1) / surveyQuestions.length) * 100}%` }}
                      />
                    </div>
                    <div className="question-number">
                      Question {currentQuestion + 1} of {surveyQuestions.length}
                    </div>
                  </div>
                )}
              </div>

              <div className="survey-content">
                {currentQuestion === -1 ? (
                  <SurveyCard 
                    onStartSurvey={handleStartSurvey} 
                    onContinueSurvey={handleContinueWithFeedback}
                  />
                ) : isSubmitted ? (
                  <SurveyCompletion 
                    onReset={() => {
                      clearProgress();
                      setIsSubmitted(false);
                      setCurrentQuestion(-1);
                      setSubmitError(null);
                      setSubmissionProgress(null);
                    }} 
                  />
                ) : visibleQuestions.length === 0 || currentQuestion >= visibleQuestions.length ? (
                  <SurveyCard 
                    onStartSurvey={handleStartSurvey}
                    onContinueSurvey={handleContinueWithFeedback}
                  />
                ) : (
                  <div className="question-container">
                    <SurveyQuestion
                      question={visibleQuestions[currentQuestion]}
                      value={getQuestionValue(visibleQuestions[currentQuestion].id)}
                      onChange={handleCustomInputChange}
                      error={errors[visibleQuestions[currentQuestion].id]}
                      formData={formData}
                    />
                    
                    <div className="navigation-buttons">
                      {currentQuestion > 0 && (
                        <button className="nav-button" onClick={handlePrevious}>
                          Previous
                        </button>
                      )}
                      <button 
                        className="nav-button next-button"
                        onClick={currentQuestion === visibleQuestions.length - 1 ? handleSubmit : handleNext}
                        disabled={!!errors[visibleQuestions[currentQuestion].id]}
                      >
                        {currentQuestion === 0 && formData.visitedLastFourWeeks === 'no' 
                          ? 'Back to homepage'
                          : currentQuestion === visibleQuestions.length - 1
                            ? 'Submit' 
                            : 'Next'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        } catch (error) {
          localStorage.removeItem('surveyProgress');
          
          return (
            <div className="survey-container">
              <div className="survey-content">
                <SurveyCard 
                  onStartSurvey={() => {
                    window.location.reload();
                  }}
                  onContinueSurvey={() => {
                    window.location.reload();
                  }}
                />
              </div>
            </div>
          );
        }
      })()}

      <IonToast
        isOpen={showOfflineToast}
        onDidDismiss={() => setShowOfflineToast(false)}
        message="You are currently offline. Your survey has been saved and will be submitted automatically when you're back online."
        duration={4000}
        position="bottom"
        color="warning"
        buttons={[
          {
            text: 'OK',
            role: 'cancel',
          }
        ]}
      />

      <IonToast
        isOpen={showResumeToast}
        onDidDismiss={() => setShowResumeToast(false)}
        message="Resuming your survey from where you left off."
        duration={3000}
        position="bottom"
        color="success"
        buttons={[
          {
            text: 'OK',
            role: 'cancel',
          }
        ]}
      />

      <IonModal
        isOpen={isSubmitting}
        className="submission-modal"
        backdropDismiss={false}
        breakpoints={[1.0]}
        initialBreakpoint={1.0}
        showBackdrop={false}
      >
        <div className="submission-overlay" />
        {renderSubmissionScreen()}
      </IonModal>

      <IonModal 
        isOpen={showExitModal} 
        onDidDismiss={() => setShowExitModal(false)}
        className="save-progress-modal"
      >
        <div className="save-progress-content">
          <div className="save-progress-icon">
            <span>⚠️</span>
          </div>
          <h2 className="save-progress-title">Save Your Progress?</h2>
          <p className="save-progress-message">
            You can continue where you left off next time you open the survey.
          </p>
          <div className="save-progress-buttons">
            <button 
              className="discard-exit-button"
              onClick={handleDiscardAndExit}
            >
              Discard & Exit
            </button>
            <button 
              className="save-exit-button"
              onClick={handleSaveAndExit}
            >
              Save & Exit
            </button>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default Survey;
