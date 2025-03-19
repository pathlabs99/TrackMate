import { Storage } from '@ionic/storage';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { LocalNotifications } from '@capacitor/local-notifications';
import { API } from './API';

const PENDING_REPORTS_KEY = 'pendingReports';
const LAST_SYNC_ATTEMPT_KEY = 'lastSyncAttempt';
const MIN_SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes between sync attempts

/**
 * This service handles background synchronization of reports.
 * It uses a more aggressive sync strategy to maximize chances of syncing
 * when the app is briefly opened.
 */
class BackgroundSyncService {
  private storage: Storage | null = null;
  private initialized: boolean = false;
  private isSyncing: boolean = false;
  private networkListener: any = null;
  
  // Store the single instance
  private static instance: BackgroundSyncService;
  
  // Get the singleton instance
  public static getInstance(): BackgroundSyncService {
    if (!BackgroundSyncService.instance) {
      BackgroundSyncService.instance = new BackgroundSyncService();
    }
    return BackgroundSyncService.instance;
  }

  // Private constructor to enforce singleton
  private constructor() {}

  /**
   * Initialize the background sync service with improved sync strategy
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      console.log('[BackgroundSync] Initializing service...');
      
      // Initialize storage
      this.storage = new Storage();
      await this.storage.create();
      
      // Set up network change listener with immediate sync on connection
      this.networkListener = Network.addListener('networkStatusChange', async ({ connected }) => {
        if (connected) {
          console.log('[BackgroundSync] Network connected - attempting immediate sync');
          await this.attemptSync();
        }
      });

      // Set up app state change listener
      App.addListener('appStateChange', async ({ isActive }) => {
        if (isActive) {
          console.log('[BackgroundSync] App became active - checking for pending reports');
          await this.attemptSync();
        }
      });
      
      // Initial sync attempt
      const networkStatus = await Network.getStatus();
      if (networkStatus.connected) {
        await this.attemptSync();
      }
      
      this.initialized = true;
      console.log('[BackgroundSync] Service initialized');
    } catch (error) {
      console.error('[BackgroundSync] Initialization error:', error);
      throw error;
    }
  }
  
  /**
   * Attempt to sync if conditions are met
   */
  private async attemptSync(): Promise<void> {
    try {
      // Check if we can sync
      if (this.isSyncing) {
        console.log('[BackgroundSync] Sync already in progress');
        return;
      }

      const networkStatus = await Network.getStatus();
      if (!networkStatus.connected) {
        console.log('[BackgroundSync] No network connection');
        return;
      }

      // Check last sync attempt
      const lastSyncAttempt = await this.storage?.get(LAST_SYNC_ATTEMPT_KEY) || 0;
      const now = Date.now();
      
      if (now - lastSyncAttempt < MIN_SYNC_INTERVAL) {
        console.log('[BackgroundSync] Too soon since last sync attempt');
        return;
      }

      // Update last sync attempt time
      await this.storage?.set(LAST_SYNC_ATTEMPT_KEY, now);

      // Check for pending reports
      const pendingReports = await this.getPendingReports();
      if (pendingReports.length === 0) {
        console.log('[BackgroundSync] No pending reports');
        return;
      }

      // Attempt sync
      await this.syncPendingReports();
    } catch (error) {
      console.error('[BackgroundSync] Sync attempt error:', error);
    }
  }

  /**
   * Save a report for later sync with improved notification
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
      console.log('[BackgroundSync] Report saved for later sync');
      
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
        console.log('[BackgroundSync] Notification error:', err);
      }
      
      // Try to sync immediately if we're online
      const networkStatus = await Network.getStatus();
      if (networkStatus.connected) {
        await this.attemptSync();
      }
    } catch (error) {
      console.error('[BackgroundSync] Error saving report:', error);
      throw error;
    }
  }

  /**
   * Get all pending reports
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
      console.error('[BackgroundSync] Error getting pending reports:', error);
      return [];
    }
  }

  /**
   * Clear all pending reports
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
      console.log('[BackgroundSync] All pending reports cleared');
    } catch (error) {
      console.error('[BackgroundSync] Error clearing reports:', error);
      throw new Error('Failed to clear pending reports');
    }
  }

  /**
   * Synchronize all pending reports with the server
   */
  async syncPendingReports(): Promise<number> {
    // Don't run multiple syncs at once
    if (this.isSyncing) {
      console.log('[BackgroundSync] Sync already in progress');
      return 0;
    }
    
    if (!this.initialized) {
      await this.initialize();
    }
    
    this.isSyncing = true;
    console.log('[BackgroundSync] Starting sync of pending reports');
    
    try {
      // Check network connectivity
      const networkStatus = await Network.getStatus();
      if (!networkStatus.connected) {
        console.log('[BackgroundSync] No network connection, sync aborted');
        this.isSyncing = false;
        return 0;
      }
      
      // Get pending reports
      const pendingReports = await this.getPendingReports();
      if (pendingReports.length === 0) {
        console.log('[BackgroundSync] No pending reports to sync');
        this.isSyncing = false;
        return 0;
      }
      
      console.log(`[BackgroundSync] Found ${pendingReports.length} reports to sync`);
      
      let successCount = 0;
      const failedReports = [];
      
      // Process each report
      for (const report of pendingReports) {
        try {
          console.log(`[BackgroundSync] Syncing report ID: ${report.id}`);
          
          // Submit report to API
          await API.submitReport(report);
          
          // Report submitted successfully
          successCount++;
          console.log(`[BackgroundSync] Successfully synced report ID: ${report.id}`);
          
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
          console.error(`[BackgroundSync] Failed to sync report ID: ${report.id}`, error);
          
          // Track sync attempts
          report.attempts = (report.attempts || 0) + 1;
          
          // Keep for retry if under max attempts (5)
          if (report.attempts < 5) {
            failedReports.push(report);
          } else {
            console.log(`[BackgroundSync] Max attempts reached for report ID: ${report.id}, giving up`);
          }
        }
      }
      
      // Update storage with failed reports
      if (this.storage) {
        if (failedReports.length > 0) {
          await this.storage.set(PENDING_REPORTS_KEY, failedReports);
          console.log(`[BackgroundSync] ${failedReports.length} reports failed to sync and will be retried later`);
        } else {
          // All reports synced, clear storage
          await this.storage.remove(PENDING_REPORTS_KEY);
          console.log('[BackgroundSync] All reports synced successfully, storage cleared');
        }
      }
      
      console.log(`[BackgroundSync] Sync complete. Success: ${successCount}, Failed: ${failedReports.length}`);
      return successCount;
    } catch (error) {
      console.error('[BackgroundSync] Error during sync:', error);
      return 0;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Clean up resources when the app is closing
   */
  async cleanup(): Promise<void> {
    if (this.networkListener) {
      this.networkListener.remove();
    }
    
    this.initialized = false;
    console.log('[BackgroundSync] Service cleaned up');
  }
}

// Export the singleton instance
export const BackgroundSync = BackgroundSyncService.getInstance();