import { FormData } from '../models/FormData';
import { generateCSV } from '../utils/CSV'; // Import the generateCSV function

const API_URL = 'https://trackmate-server-0uvc.onrender.com';

class SurveyService {
  /**
   * Submit survey data to the server as CSV
   */
  static async submitSurvey(formData: FormData): Promise<any> {
    try {
      const csvContent = await generateCSV(formData);

      // Create a Blob with proper encoding
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      const response = await fetch(`${API_URL}/send-survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/csv;charset=utf-8;', // Ensure proper encoding
          Accept: 'application/json',
        },
        body: blob, // Send Blob instead of raw string
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Submit error:', error);
      throw error;
    }
  }
  /**
   * Save survey data offline as CSV
   */
  static async saveOffline(formData: FormData): Promise<void> {
    try {
      // Generate CSV content
      const csvContent = await generateCSV(formData);

      // Get existing offline surveys
      const offlineSurveys = JSON.parse(localStorage.getItem('offlineSurveys') || '[]');

      // Add timestamp to submission and store as CSV
      const submissionWithTimestamp = {
        csv: csvContent,
        timestamp: new Date().toISOString(),
      };

      // Add new survey to the list
      offlineSurveys.push(submissionWithTimestamp);

      // Save updated list
      localStorage.setItem('offlineSurveys', JSON.stringify(offlineSurveys));

      console.log('Survey saved offline as CSV:', submissionWithTimestamp);
    } catch (error) {
      console.error('Error saving offline:', error);
      throw error;
    }
  }

  /**
   * Get pending offline surveys
   */
  static async getPendingSurveys(): Promise<any[]> {
    try {
      const pendingSurveys = JSON.parse(localStorage.getItem('offlineSurveys') || '[]');
      return pendingSurveys;
    } catch (error) {
      console.error('Error getting pending surveys:', error);
      return [];
    }
  }

  /**
   * Update pending surveys after some have been synced
   */
  static async updatePendingSurveys(updatedSurveys: any[]): Promise<void> {
    try {
      localStorage.setItem('offlineSurveys', JSON.stringify(updatedSurveys));
    } catch (error) {
      console.error('Error updating pending surveys:', error);
    }
  }
}

export default SurveyService;