import React, { useState, useEffect, useCallback } from "react";
import { IonModal, IonToast } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { surveyQuestions } from "./questions";
import { SurveyQuestion } from "./components/SurveyQuestion";
import { SurveyCompletion } from './components/SurveyCompletion';
import { useSurveyForm } from "./hooks/useSurveyForm";
import { FormData } from "./models/FormData";
import { generateCSV, generateReportId } from "./utils/CSV";
import { sendCSVToServer, syncPendingSubmissions, checkNetworkStatus, addNetworkListener, removeNetworkListener } from './utils/Network';
import { getPendingSubmissions, saveOfflineSubmission } from './utils/Storage';
import SurveyCard from "./components/SurveyCard";
import "./Survey.css";

export const Survey: React.FC = () => {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState<{ status: string; progress: number } | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [showOfflineToast, setShowOfflineToast] = useState(false);

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
    validateCurrentQuestion,
    clearProgress
  } = useSurveyForm(surveyQuestions);

  const handleExit = () => {
    setShowExitModal(true);
  };

  const handleSaveAndExit = () => {
    setShowExitModal(false);
    setCurrentQuestion(-1); // Go back to survey card
  };

  const handleDiscardAndExit = () => {
    clearProgress();
    setShowExitModal(false);
    setCurrentQuestion(-1); // Go back to survey card
  };

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
          // Don't convert to number yet - keep as string until submission
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

  const getQuestionValue = (questionId: string): string | string[] => {
    const value = formData[questionId];
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const handleSubmit = async () => {
    if (!validateCurrentQuestion()) return;

    // If user selected "No" in first question, navigate to main menu
    if (currentQuestion === 0 && formData.visitedLastFourWeeks === 'no') {
      history.push('/menu');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmissionProgress({ status: 'preparing', progress: 0 });

    try {
      // Generate reportId and timestamp
      const timestamp = new Date().toISOString();
      const reportId = generateReportId();

      // Update form data with submission info
      const submissionData = {
        ...formData,
        reportId,
        submissionDate: timestamp,
        timestamp // Add timestamp for offline sync
      };

      // Generate CSV data
      const csvData = await generateCSV(submissionData);
      const fileName = `survey_${reportId}`;

      const networkStatus = await checkNetworkStatus();
      if (networkStatus) {
        // Online submission
        await sendCSVToServer(csvData, fileName, (progress) => {
          setSubmissionProgress(progress);
        });

        // Save final state to local storage
        localStorage.setItem('surveyFormData', JSON.stringify(submissionData));
        setIsSubmitted(true);
      } else {
        // Offline submission
        await saveOfflineSubmission(submissionData);
        setPendingCount(prev => prev + 1);
        setShowOfflineToast(true);
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
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

  const handleNext = useCallback(() => {
    if (validateCurrentQuestion()) {
      const currentQ = visibleQuestions[currentQuestion];
      // If we're on the first question and user hasn't visited, go back to homepage
      if (currentQ.id === 'visitedLastFourWeeks' && formData.visitedLastFourWeeks === 'no') {
        history.push('/menu');
      } else {
        setCurrentQuestion(prev => Math.min(prev + 1, visibleQuestions.length - 1));
        setErrors({});
      }
    }
  }, [validateCurrentQuestion, visibleQuestions, currentQuestion, formData.visitedLastFourWeeks, history]);

  const handlePrevious = useCallback(() => {
    setCurrentQuestion(prev => Math.max(prev - 1, 0));
    setErrors({});
  }, []);

  // Check network status and pending submissions on mount
  useEffect(() => {
    let isSubscribed = true; // Track if component is mounted
    let syncTimeout: NodeJS.Timeout | null = null;

    const checkStatus = async () => {
      if (!isSubscribed) return;

      // Check network status
      const networkStatus = await checkNetworkStatus();
      setIsOnline(networkStatus);

      // Check pending submissions
      const pending = await getPendingSubmissions();
      setPendingCount(pending.length);
    };

    checkStatus();

    // Add network status listeners with debounce for sync
    const handleNetworkChange = (connected: boolean) => {
      if (!isSubscribed) return;
      
      setIsOnline(connected);
      
      // Clear any existing sync timeout
      if (syncTimeout) {
        clearTimeout(syncTimeout);
      }

      if (connected) {
        // Delay sync process to avoid multiple rapid attempts
        syncTimeout = setTimeout(() => {
          syncPendingSubmissions()
            .then(count => {
              if (count > 0 && isSubscribed) {
                setSubmitError(`${count} pending survey(s) synced successfully`);
                // Update pending count after successful sync
                getPendingSubmissions().then(pending => {
                  if (isSubscribed) {
                    setPendingCount(pending.length);
                  }
                });
              }
            })
            .catch(console.error);
        }, 2000); // 2 second delay before attempting sync
      }
    };

    addNetworkListener(handleNetworkChange);

    // Cleanup function
    return () => {
      isSubscribed = false;
      if (syncTimeout) {
        clearTimeout(syncTimeout);
      }
      removeNetworkListener(handleNetworkChange);
    };
  }, []);

  return (
    <>
      <div className="survey-container">
        <div className="survey-header">
          {currentQuestion >= 0 && (
            <button className="exit-button" onClick={handleExit}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
            <SurveyCard onStartSurvey={handleStartSurvey} />
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

      <IonModal
        isOpen={isSubmitting}
        className="submission-modal"
        breakpoints={[0, 1]}
        initialBreakpoint={1}
      >
        <div className="submission-modal-content">
          <div className="submission-modal-header">
            <h2>Submitting Survey</h2>
          </div>
          {submissionProgress && (
            <div className="submission-progress">
              <div className="submission-progress-bar">
                <div 
                  className="submission-progress-fill" 
                  style={{ width: `${submissionProgress.progress}%` }}
                />
              </div>
              <div className="submission-status">
                {submissionProgress.status === 'preparing' ? 'Preparing submission...' :
                 submissionProgress.status === 'uploading' ? `Uploading... ${Math.round(submissionProgress.progress)}%` :
                 'Processing...'}
              </div>
            </div>
          )}
          {submitError && (
            <div className="submission-error">
              {submitError}
            </div>
          )}
        </div>
      </IonModal>

      <IonModal
        isOpen={showExitModal}
        onDidDismiss={() => setShowExitModal(false)}
        className="exit-modal"
        breakpoints={[0, 1]}
        initialBreakpoint={1}
      >
        <div className="exit-modal-content">
          <div className="exit-modal-header">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h2>Save Your Progress?</h2>
          </div>
          <p>You can continue where you left off next time you open the survey.</p>
          <div className="exit-modal-buttons">
            <button 
              className="modal-button discard-button"
              onClick={handleDiscardAndExit}
            >
              Discard & Exit
            </button>
            <button 
              className="modal-button save-button"
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
