import { checkNetworkStatus as isOnline, sendCSVToServer } from './Network';
import { getPendingSubmissions, updatePendingSubmissions, clearPendingSubmissions, Submission } from './Storage';
import { generateCSV } from './CSV';

/**
 * Try to submit all pending surveys
 */
export const retryPendingSubmissions = async (): Promise<number> => {
  try {
    const isConnected = await isOnline();
    if (!isConnected) {
      console.log('Device is offline. Skipping retry of pending submissions.');
      return 0;
    }

    const pendingSubmissions = await getPendingSubmissions();
    if (pendingSubmissions.length === 0) {
      console.log('No pending submissions to retry.');
      return 0;
    }

    let successCount = 0;
    const remainingSubmissions: Submission[] = [];

    for (const submission of pendingSubmissions) {
      try {
        const csv = await generateCSV(submission);
        const fileName = `survey_${submission.reportId}_${submission.timestamp.split('T')[0]}`;
        await sendCSVToServer(csv, fileName);
        successCount++;
      } catch (error) {
        console.error('Failed to submit survey:', error);
        remainingSubmissions.push(submission);
      }
    }

    if (remainingSubmissions.length > 0) {
      await updatePendingSubmissions(remainingSubmissions);
    } else {
      await clearPendingSubmissions();
    }

    console.log(`Successfully submitted ${successCount} out of ${pendingSubmissions.length} surveys`);
    return successCount;
  } catch (error) {
    console.error('Error during retry of pending submissions:', error);
    throw error;
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