/**
 * @fileoverview Storage utility functions for TrackMate survey data.
 * @author TrackMate Team
 * @date 2025-04-13
 * @filename Storage.ts
 *
 * This file contains functions for managing offline survey storage,
 * including saving, retrieving, and managing pending submissions.
 */

import { FormData } from '../models/FormData';

/**
 * Interface representing a survey submission
 */
export interface Submission extends FormData {
  /**
   * Timestamp when the submission was created
   */
  timestamp: string;
  
  /**
   * Unique identifier for the survey
   */
  surveyId: string;
}

/**
 * Key used for storing pending surveys in local storage
 */
const PENDING_SURVEYS_KEY = 'trackmate_pending_surveys';

/**
 * Save a survey submission for offline storage
 * 
 * @param submission - The survey submission to save
 */
export const saveOfflineSubmission = async (submission: Submission): Promise<void> => {
  try {
    const pendingSubmissions = await getPendingSubmissions();
    pendingSubmissions.push(submission);
    localStorage.setItem(PENDING_SURVEYS_KEY, JSON.stringify(pendingSubmissions));
  } catch (error) {
    throw error;
  }
};

/**
 * Get all pending survey submissions
 * 
 * @returns Promise that resolves to an array of pending submissions
 */
export const getPendingSubmissions = async (): Promise<Submission[]> => {
  try {
    const stored = localStorage.getItem(PENDING_SURVEYS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

/**
 * Update the list of pending submissions
 * 
 * @param submissions - The new array of pending submissions
 */
export const updatePendingSubmissions = async (submissions: Submission[]): Promise<void> => {
  try {
    localStorage.setItem(PENDING_SURVEYS_KEY, JSON.stringify(submissions));
  } catch (error) {
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

/**
 * Emergency reset function attached to window object
 * Resets survey storage and reloads the page
 */
(window as any).resetTrackMateSurvey = () => {
  resetSurveyStorage();
  window.location.reload();
};