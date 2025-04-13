/**
 * @fileoverview Background synchronization service for the TrackMate issue reporting system.
 * @author Marwa
 * @date 2025-04-13
 * @filename BackgroundSync.ts
 *
 * This file contains the BackgroundSync service which provides functionality
 * for synchronizing offline issue reports when network connectivity is restored.
 * It implements a singleton pattern and uses aggressive sync strategies to
 * maximize chances of syncing when the app is briefly opened.
 */

import { Storage } from '@ionic/storage';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { LocalNotifications } from '@capacitor/local-notifications';
import { API } from './API';

/** Key for storing pending reports in local storage */
const PENDING_REPORTS_KEY = 'pendingReports';
/** Key for storing the timestamp of the last sync attempt */
const LAST_SYNC_ATTEMPT_KEY = 'lastSyncAttempt';
/** Minimum time interval between sync attempts (5 minutes) */
const MIN_SYNC_INTERVAL = 5 * 60 * 1000;

/**
 * BackgroundSync service that handles synchronization of offline reports
 * when network connectivity is restored
 */
class BackgroundSyncService {
  /** Storage instance for persisting reports */
  private storage: Storage | null = null;
  /** Flag indicating if the service has been initialized */
  private initialized: boolean = false;
  /** Flag indicating if a sync operation is currently in progress */
  private isSyncing: boolean = false;
  /** Network status change listener */
  private networkListener: any = null;
  
  /** Singleton instance of the service */
  private static instance: BackgroundSyncService;
  
  /**
   * Get the singleton instance of the BackgroundSync service
   * 
   * @returns The singleton instance
   */
  public static getInstance(): BackgroundSyncService {
    if (!BackgroundSyncService.instance) {
      BackgroundSyncService.instance = new BackgroundSyncService();
    }
    return BackgroundSyncService.instance;
  }

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}

  /**
   * Initialize the background sync service
   * Sets up storage, network listeners, and app state change listeners
   * 
   * @returns Promise that resolves when initialization is complete
   * @throws Error if initialization fails
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Initialize storage
      this.storage = new Storage();
      await this.storage.create();
      
      // Set up network change listener with immediate sync on connection
      this.networkListener = Network.addListener('networkStatusChange', async ({ connected }) => {
        if (connected) {
          await this.attemptSync();
        }
      });

      // Set up app state change listener
      App.addListener('appStateChange', async ({ isActive }) => {
        if (isActive) {
          await this.attemptSync();
        }
      });
      
      // Initial sync attempt
      const networkStatus = await Network.getStatus();
      if (networkStatus.connected) {
        await this.attemptSync();
      }
      
      this.initialized = true;
    } catch (error) {
      // Silent error handling
      throw error;
    }
  }
  
  /**
   * Attempt to sync pending reports if conditions are met
   * Checks network status, time since last sync, and existence of pending reports
   * 
   * @returns Promise that resolves when sync attempt is complete
   */
  private async attemptSync(): Promise<void> {
    try {
      // Check if we can sync
      if (this.isSyncing) {
        return;
      }

      const networkStatus = await Network.getStatus();
      if (!networkStatus.connected) {
        return;
      }

      // Check last sync attempt
      const lastSyncAttempt = await this.storage?.get(LAST_SYNC_ATTEMPT_KEY) || 0;
      const now = Date.now();
      
      if (now - lastSyncAttempt < MIN_SYNC_INTERVAL) {
        return;
      }

      // Update last sync attempt time
      await this.storage?.set(LAST_SYNC_ATTEMPT_KEY, now);

      // Check for pending reports
      const pendingReports = await this.getPendingReports();
      if (pendingReports.length === 0) {
        return;
      }

      // Attempt sync
      await this.syncPendingReports();
    } catch (error) {
      // Silent error handling
    }
  }

  /**
   * Save a report for later synchronization
   * Adds metadata to the report and schedules a notification
   * 
   * @param reportData - The report data to save
   * @returns Promise that resolves when the report is saved
   * @throws Error if storage is not initialized or saving fails
   */
  async savePendingReport(reportData: any): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.storage) {
      throw new Error('Storage not initialized');
    }
    
    try {
      // Add metadata to the report
      const report = {
        ...reportData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        attempts: 0
      };
      
      // Get existing reports
      const existingReports = await this.getPendingReports();
      const updatedReports = [...existingReports, report];
      
      // Save updated list
      await this.storage.set(PENDING_REPORTS_KEY, updatedReports);
      
      // Schedule notification
      try {
        await LocalNotifications.schedule({
          notifications: [{
            title: 'Report Saved Offline',
            body: 'Your report has been saved and will sync automatically when online',
            id: Math.floor(Math.random() * 10000)
          }]
        });
      } catch (err) {
        // Silent error handling
      }
      
      // Try to sync immediately if we're online
      const networkStatus = await Network.getStatus();
      if (networkStatus.connected) {
        await this.attemptSync();
      }
    } catch (error) {
      // Silent error handling
      throw error;
    }
  }

  /**
   * Get all pending reports from storage
   * 
   * @returns Promise resolving to array of pending reports
   */
  async getPendingReports(): Promise<any[]> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.storage) {
      return [];
    }
    
    try {
      const reports = await this.storage.get(PENDING_REPORTS_KEY);
      return Array.isArray(reports) ? reports : [];
    } catch (error) {
      // Silent error handling
      return [];
    }
  }

  /**
   * Clear all pending reports from storage
   * 
   * @returns Promise that resolves when reports are cleared
   * @throws Error if storage is not initialized or clearing fails
   */
  async clearAllPendingReports(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.storage) {
      throw new Error('Storage not initialized');
    }
    
    try {
      await this.storage.remove(PENDING_REPORTS_KEY);
    } catch (error) {
      // Silent error handling
      throw new Error('Failed to clear pending reports');
    }
  }

  /**
   * Synchronize all pending reports with the server
   * Attempts to submit each report and tracks failures for retry
   * 
   * @returns Promise resolving to the number of successfully synced reports
   */
  async syncPendingReports(): Promise<number> {
    // Don't run multiple syncs at once
    if (this.isSyncing) {
      return 0;
    }
    
    if (!this.initialized) {
      await this.initialize();
    }
    
    this.isSyncing = true;
    
    try {
      // Check network connectivity
      const networkStatus = await Network.getStatus();
      if (!networkStatus.connected) {
        this.isSyncing = false;
        return 0;
      }
      
      // Get pending reports
      const pendingReports = await this.getPendingReports();
      if (pendingReports.length === 0) {
        this.isSyncing = false;
        return 0;
      }
      
      let successCount = 0;
      const failedReports = [];
      
      // Process each report
      for (const report of pendingReports) {
        try {
          // Submit report to API
          await API.submitReport(report);
          
          // Report submitted successfully
          successCount++;
          
          // Notify user of successful sync
          try {
            await LocalNotifications.schedule({
              notifications: [{
                title: 'Report Synced',
                body: 'Your offline report has been submitted successfully',
                id: Math.floor(Math.random() * 10000)
              }]
            });
          } catch (err) {
            // Continue even if notification fails
          }
        } catch (error) {
          // Track sync attempts
          report.attempts = (report.attempts || 0) + 1;
          
          // Keep for retry if under max attempts (5)
          if (report.attempts < 5) {
            failedReports.push(report);
          }
        }
      }
      
      // Update storage with failed reports
      if (this.storage) {
        if (failedReports.length > 0) {
          await this.storage.set(PENDING_REPORTS_KEY, failedReports);
        } else {
          // All reports synced, clear storage
          await this.storage.remove(PENDING_REPORTS_KEY);
        }
      }
      
      return successCount;
    } catch (error) {
      // Silent error handling
      return 0;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Clean up resources when the app is closing
   * Removes event listeners and resets initialization state
   * 
   * @returns Promise that resolves when cleanup is complete
   */
  async cleanup(): Promise<void> {
    if (this.networkListener) {
      this.networkListener.remove();
    }
    
    this.initialized = false;
  }
}

// Export the singleton instance
export const BackgroundSync = BackgroundSyncService.getInstance();