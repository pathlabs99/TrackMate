import { FormData } from '../models/FormData';

export interface Submission extends FormData {
  timestamp: string;
  surveyId: string;
}

const PENDING_SURVEYS_KEY = 'trackmate_pending_surveys';

/**
 * Save a survey submission for offline storage
 */
export const saveOfflineSubmission = async (submission: Submission): Promise<void> => {
  try {
    const pendingSubmissions = await getPendingSubmissions();
    pendingSubmissions.push(submission);
    localStorage.setItem(PENDING_SURVEYS_KEY, JSON.stringify(pendingSubmissions));
    console.log('Survey saved offline:', submission);
  } catch (error) {
    console.error('Error saving offline submission:', error);
    throw error;
  }
};

/**
 * Get all pending survey submissions
 */
export const getPendingSubmissions = async (): Promise<Submission[]> => {
  try {
    const stored = localStorage.getItem(PENDING_SURVEYS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting pending submissions:', error);
    return [];
  }
};

/**
 * Update the list of pending submissions
 */
export const updatePendingSubmissions = async (submissions: Submission[]): Promise<void> => {
  try {
    localStorage.setItem(PENDING_SURVEYS_KEY, JSON.stringify(submissions));
  } catch (error) {
    console.error('Error updating pending submissions:', error);
    throw error;
  }
};

/**
 * Clear all pending submissions
 */
export const clearPendingSubmissions = async (): Promise<void> => {
  try {
    localStorage.removeItem(PENDING_SURVEYS_KEY);
  } catch (error) {
    console.error('Error clearing pending submissions:', error);
    throw error;
  }
};

/**
 * Reset all survey-related storage to fix any corrupted state
 */
export const resetSurveyStorage = () => {
  localStorage.removeItem('surveyProgress');
  localStorage.removeItem('surveyFormData');
};

// Add a window-level emergency reset function
(window as any).resetTrackMateSurvey = () => {
  resetSurveyStorage();
  console.log('Survey data has been reset');
  window.location.reload();
};