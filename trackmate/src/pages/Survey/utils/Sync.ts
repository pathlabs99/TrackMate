import { isOnline } from './Network';
import { getPendingSubmissions, updatePendingSubmissions } from './Storage';
import { generateCSV } from './CSV';
import { FormData } from '../models/FormData';
import SurveyService from '../services/SurveyService';

interface Submission extends FormData {
  timestamp: string;
}

export const retryPendingSubmissions = async () => {
  try {
    const isConnected = await isOnline();
    if (!isConnected) {
      console.log('Device is offline. Skipping retry of pending submissions.');
      return;
    }

    const pendingSubmissions: Submission[] = await getPendingSubmissions();
    if (pendingSubmissions.length === 0) {
      console.log('No pending submissions to retry.');
      return;
    }

    const updatedPending: Submission[] = [];
    for (const submission of pendingSubmissions) {
      try {
        const csv = await generateCSV(submission);
        await SurveyService.submitSurvey(submission);
        console.log('Successfully synced submission:', submission);
      } catch (error) {
        console.error('Failed to sync submission:', error);
        updatedPending.push(submission);
      }
    }

    await updatePendingSubmissions(updatedPending);
    console.log('Pending submissions updated after retry.');
  } catch (error) {
    console.error('Error during retryPendingSubmissions:', error);
  }
};

export const startSyncProcess = async () => {
  setInterval(async () => {
    const isConnected = await isOnline();
    if (isConnected) {
      console.log('Device is online. Attempting to sync pending submissions...');
      await retryPendingSubmissions();
    }
  }, 5 * 60 * 1000); // Sync every 5 minutes
};

// Start the sync process when the module is loaded
startSyncProcess();