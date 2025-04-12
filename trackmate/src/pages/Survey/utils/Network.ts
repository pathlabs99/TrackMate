// utils/Network.ts
import { Network as CapacitorNetwork } from '@capacitor/network';
import { generateCSV } from './CSV';
import { getPendingSubmissions, updatePendingSubmissions } from './Storage';

const API_URL = 'https://trackmateserver.onrender.com';

/**
 * Check if the device is currently online
 */
export const checkNetworkStatus = async (): Promise<boolean> => {
  const status = await CapacitorNetwork.getStatus();
  return status.connected;
};

/**
 * Add network status change listener
 */
export const addNetworkListener = (callback: (isConnected: boolean) => void): void => {
  CapacitorNetwork.addListener('networkStatusChange', (status) => {
    callback(status.connected);
  });
};

/**
 * Remove network status change listener
 */
export const removeNetworkListener = (callback: (isConnected: boolean) => void): void => {
  CapacitorNetwork.removeAllListeners();
};

interface SubmissionProgress {
  status: 'preparing' | 'uploading' | 'processing' | 'complete';
  progress: number;
}

type ProgressCallback = (progress: SubmissionProgress) => void;

/**
 * Send CSV data to server with progress tracking
 */
export const sendCSVToServer = async (
  csvData: string, 
  surveyId: string,
  onProgress?: ProgressCallback
): Promise<void> => {
  try {
    // Check network status
    if (!await checkNetworkStatus()) {
      throw new Error('No internet connection');
    }

    // Update progress: Preparing data (0-10%)
    onProgress?.({ status: 'preparing', progress: 0 });
    
    // Prepare data for server request
    const fileName = `survey_${surveyId}.csv`; // Ensure .csv extension
    
    onProgress?.({ status: 'preparing', progress: 10 });

    // Start actual server request (70-90%)
    onProgress?.({ status: 'processing', progress: 70 });
    
    const response = await fetch(`${API_URL}/send-survey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        csvData,
        fileName,
        surveyId
      })
    });

    // Update progress during processing
    onProgress?.({ status: 'processing', progress: 80 });
    await new Promise(resolve => setTimeout(resolve, 300));
    onProgress?.({ status: 'processing', progress: 90 });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    // Complete
    onProgress?.({ status: 'complete', progress: 100 });
    console.log('Survey submitted successfully');
  } catch (error) {
    console.error('Error sending CSV to server:', error);
    throw error;
  }
};

// Add a sync lock to prevent multiple simultaneous syncs
let isSyncing = false;

/**
 * Sync pending surveys with the server
 */
export const syncPendingSubmissions = async (onProgress?: ProgressCallback): Promise<number> => {
  // Prevent multiple simultaneous sync operations
  if (isSyncing) {
    console.log('Sync already in progress, skipping...');
    return 0;
  }

  try {
    isSyncing = true;

    // Check if we're online
    if (!await checkNetworkStatus()) {
      throw new Error('No internet connection');
    }

    // Get pending submissions
    const pendingSubmissions = await getPendingSubmissions();
    if (pendingSubmissions.length === 0) {
      return 0;
    }

    let syncedCount = 0;
    const successfulSubmissions: string[] = []; // Track successfully synced submissions by surveyId

    // Try to sync each submission
    for (const submission of pendingSubmissions) {
      try {
        // Skip if already synced
        if (successfulSubmissions.includes(submission.surveyId)) {
          continue;
        }

        // Generate CSV for this submission
        const csvData = await generateCSV(submission);
        const surveyId = submission.surveyId;

        // Send to server
        await sendCSVToServer(csvData, surveyId, onProgress);
        syncedCount++;
        successfulSubmissions.push(surveyId);

        // Remove successful submission from pending list immediately
        const remaining = pendingSubmissions.filter(s => !successfulSubmissions.includes(s.surveyId));
        await updatePendingSubmissions(remaining);
      } catch (error) {
        console.error('Error syncing submission:', error);
        // Continue with next submission
      }
    }

    return syncedCount;
  } catch (error) {
    console.error('Error syncing pending submissions:', error);
    throw error;
  } finally {
    isSyncing = false;
  }
};