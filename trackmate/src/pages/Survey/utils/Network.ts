/**
 * @fileoverview Network utility functions for TrackMate application.
 * @author TrackMate Team
 * @date 2025-04-13
 * @filename Network.ts
 *
 * This file contains functions for network status monitoring, API communication,
 * and offline data synchronization.
 */

import { Network as CapacitorNetwork } from '@capacitor/network';
import { generateCSV } from './CSV';
import { getPendingSubmissions, updatePendingSubmissions } from './Storage';

/**
 * The base URL for API requests
 */
const API_URL = 'https://trackmateserver.onrender.com';

/**
 * Check if the device is currently online
 * 
 * @returns Promise that resolves to a boolean indicating if the device is connected
 */
export const checkNetworkStatus = async (): Promise<boolean> => {
  const status = await CapacitorNetwork.getStatus();
  return status.connected;
};

/**
 * Add network status change listener
 * 
 * @param callback - Function to call when network status changes
 */
export const addNetworkListener = (callback: (isConnected: boolean) => void): void => {
  CapacitorNetwork.addListener('networkStatusChange', (status) => {
    callback(status.connected);
  });
};

/**
 * Remove network status change listener
 * 
 * @param callback - Function to remove from network status change listeners
 */
export const removeNetworkListener = (callback: (isConnected: boolean) => void): void => {
  CapacitorNetwork.removeAllListeners();
};

/**
 * Interface representing the progress of a submission
 */
interface SubmissionProgress {
  /**
   * The current status of the submission
   */
  status: 'preparing' | 'uploading' | 'processing' | 'complete';
  /**
   * The current progress of the submission (0-100)
   */
  progress: number;
}

/**
 * Type representing a callback function for submission progress updates
 */
type ProgressCallback = (progress: SubmissionProgress) => void;

/**
 * Send CSV data to server with progress tracking
 * 
 * @param csvData - The CSV data to send to the server
 * @param surveyId - The ID of the survey
 * @param onProgress - Optional callback function for progress updates
 */
export const sendCSVToServer = async (
  csvData: string, 
  surveyId: string,
  onProgress?: ProgressCallback
): Promise<void> => {
  try {
    if (!await checkNetworkStatus()) {
      throw new Error('No internet connection');
    }

    onProgress?.({ status: 'preparing', progress: 0 });
    
    const fileName = `survey_${surveyId}.csv`;
    
    onProgress?.({ status: 'preparing', progress: 10 });

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

    onProgress?.({ status: 'processing', progress: 80 });
    await new Promise(resolve => setTimeout(resolve, 300));
    onProgress?.({ status: 'processing', progress: 90 });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    onProgress?.({ status: 'complete', progress: 100 });
  } catch (error) {
    throw error;
  }
};

let isSyncing = false;

/**
 * Sync pending surveys with the server
 * 
 * @param onProgress - Optional callback function for progress updates
 * @returns The number of surveys synced
 */
export const syncPendingSubmissions = async (onProgress?: ProgressCallback): Promise<number> => {
  if (isSyncing) {
    return 0;
  }

  try {
    isSyncing = true;

    if (!await checkNetworkStatus()) {
      throw new Error('No internet connection');
    }

    const pendingSubmissions = await getPendingSubmissions();
    if (pendingSubmissions.length === 0) {
      return 0;
    }

    let syncedCount = 0;
    const successfulSubmissions: string[] = [];

    for (const submission of pendingSubmissions) {
      try {
        if (successfulSubmissions.includes(submission.surveyId)) {
          continue;
        }

        const csvData = await generateCSV(submission);
        const surveyId = submission.surveyId;

        await sendCSVToServer(csvData, surveyId, onProgress);
        syncedCount++;
        successfulSubmissions.push(surveyId);

        const remaining = pendingSubmissions.filter(s => !successfulSubmissions.includes(s.surveyId));
        await updatePendingSubmissions(remaining);
      } catch (error) {
        throw error;
      }
    }

    return syncedCount;
  } catch (error) {
    throw error;
  } finally {
    isSyncing = false;
  }
};