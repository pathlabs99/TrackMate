/**
 * @fileoverview Service for handling survey submission and storage.
 * @author Abdullah
 * @date 2025-04-13
 * @filename SurveyService.ts
 *
 * This file contains the SurveyService class which manages survey submissions,
 * including online/offline handling and validation.
 */

import { FormData } from '../models/FormData';
import { generateCSV, generateSurveyId } from '../utils/CSV';
import { checkNetworkStatus, sendCSVToServer } from '../utils/Network';
import { saveOfflineSubmission, Submission } from '../utils/Storage';
import { retryPendingSubmissions } from '../utils/Sync';

/**
 * Service to handle survey submission and storage
 */
class SurveyService {
  /**
   * Submit survey to the server or save offline if no connection
   * 
   * @param formData - The form data to submit
   * @returns Promise that resolves when the submission is complete
   */
  submitSurvey = async (formData: FormData): Promise<void> => {
    try {
      const surveyId = generateSurveyId();
      const timestamp = new Date().toISOString();
      const enrichedData: Submission = {
        ...formData,
        surveyId,
        timestamp
      };

      const csv = await generateCSV(enrichedData);
      const fileName = `survey_${surveyId}_${timestamp.split('T')[0]}`;

      if (await checkNetworkStatus()) {
        await sendCSVToServer(csv, fileName);
      } else {
        await saveOfflineSubmission(enrichedData);
      }
    } catch (error) {
      throw error;
    }
  };

  /**
   * Try to submit any pending surveys
   * 
   * @returns Promise that resolves to the number of successfully submitted surveys
   */
  submitPendingSurveys = async (): Promise<number> => {
    return retryPendingSubmissions();
  };

  /**
   * Validate survey fields
   * 
   * @param name - The name of the field to validate
   * @param value - The value to validate
   * @returns Promise that resolves to an error message (empty string if valid)
   */
  validateField = async (name: string, value: any): Promise<string> => {
    if (name === 'lastVisitDate') {
      if (!value) return 'Please select a date.';

      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today to midnight
      const fourWeeksAgo = new Date(today);
      fourWeeksAgo.setDate(today.getDate() - 28); // 28 days = 4 weeks

      if (selectedDate > today) return 'The date cannot be in the future.';
      if (selectedDate < fourWeeksAgo) return 'The date must be within the last four weeks.';
    }
    return '';
  };
}

export default new SurveyService();