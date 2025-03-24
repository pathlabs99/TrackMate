// services/SurveyService.ts
import { FormData } from '../models/FormData';
import { generateCSV, generateReportId } from '../utils/CSV';
import { checkNetworkStatus, sendCSVToServer } from '../utils/Network';
import { saveOfflineSubmission, Submission } from '../utils/Storage';
import { retryPendingSubmissions } from '../utils/Sync';

/**
 * Service to handle survey submission and storage
 */
class SurveyService {
  /**
   * Submit survey to the server
   */
  submitSurvey = async (formData: FormData): Promise<void> => {
    try {
      // Generate report ID and add submission date
      const reportId = generateReportId();
      const timestamp = new Date().toISOString();
      const enrichedData: Submission = {
        ...formData,
        reportId,
        timestamp
      };

      // Generate CSV
      const csv = await generateCSV(enrichedData);
      const fileName = `survey_${reportId}_${timestamp.split('T')[0]}`;

      // Check if online
      if (await checkNetworkStatus()) {
        // Submit to server
        await sendCSVToServer(csv, fileName);
        console.log('Survey submitted successfully');
      } else {
        // Store offline if no connection
        await saveOfflineSubmission(enrichedData);
        console.log('Survey saved offline');
      }
    } catch (error) {
      console.error('Failed to submit survey:', error);
      throw error;
    }
  };

  /**
   * Try to submit any pending surveys
   */
  submitPendingSurveys = async (): Promise<number> => {
    return retryPendingSubmissions();
  };

  /**
   * Validate survey fields
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