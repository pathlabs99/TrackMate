/**
 * @fileoverview Synchronization utilities for TrackMate offline survey data.
 * @author TrackMate Team
 * @date 2025-04-13
 * @filename Sync.ts
 *
 * This file contains functions for synchronizing offline survey data
 * with the server when network connectivity is restored.
 */

import { checkNetworkStatus as isOnline, sendCSVToServer } from './Network';
import { getPendingSubmissions, updatePendingSubmissions, clearPendingSubmissions, Submission } from './Storage';
import { generateCSV } from './CSV';

/**
 * Try to submit all pending surveys
 * 
 * @returns Promise that resolves to the number of successfully submitted surveys
 */
export const retryPendingSubmissions = async (): Promise<number> => {
  try {
    const isConnected = await isOnline();
    if (!isConnected) {
      return 0;
    }

    const pendingSubmissions = await getPendingSubmissions();
    if (pendingSubmissions.length === 0) {
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
        remainingSubmissions.push(submission);
      }
    }

    if (remainingSubmissions.length > 0) {
      await updatePendingSubmissions(remainingSubmissions);
    } else {
      await clearPendingSubmissions();
    }

    return successCount;
  } catch (error) {
    throw error;
  }
};

/**
 * Start the background synchronization process
 * Attempts to sync pending submissions every 5 minutes when online
 */
export const startSyncProcess = async () => {
  setInterval(async () => {
    const isConnected = await isOnline();
    if (isConnected) {
      await retryPendingSubmissions();
    }
  }, 5 * 60 * 1000); // Sync every 5 minutes
};

// Start the sync process when the module is loaded
startSyncProcess();