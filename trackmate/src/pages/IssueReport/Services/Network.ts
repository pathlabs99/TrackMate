/**
 * @fileoverview Network service for the TrackMate issue reporting system.
 * @author Marwa
 * @filename Network.ts
 *
 * This file contains the Network service which provides functionality
 * for monitoring network status and syncing offline reports when online.
 */

import { Network as CapacitorNetwork } from "@capacitor/network";
import { API as API } from "./API";
import { Storage } from "./Storage";

/**
 * Network service class that provides methods for
 * monitoring network status and syncing offline reports
 */
export class Network {
  /**
   * Get current network connection status
   * 
   * @returns Promise resolving to boolean indicating if device is connected
   */
  static async getNetworkStatus(): Promise<boolean> {
    const status = await CapacitorNetwork.getStatus();
    return status.connected;
  }

  /**
   * Add network status change listener
   * 
   * @param callback - Function to call when network status changes
   * @returns Promise that resolves when listener is added
   */
  static addNetworkListener(callback: (isConnected: boolean) => void): Promise<void> {
    const networkListener = CapacitorNetwork.addListener(
      "networkStatusChange",
      (status) => {
        callback(status.connected);
      }
    );

    // Return function to remove listener
    return Promise.resolve();
  }

  /**
   * Sync pending reports when device is back online
   * 
   * @returns Promise resolving to number of successfully synced reports
   */
  static async syncPendingReports(): Promise<number> {
    try {
      const pendingReports = await Storage.getPendingReports();

      if (pendingReports.length === 0) return 0;

      let syncedCount = 0;

      for (const report of pendingReports) {
        try {
          await API.submitReport(report.data);
          syncedCount++;

          // Remove this report from pending list
          const updatedPendingReports = pendingReports.filter(
            (r) => r.data.reportId !== report.data.reportId
          );
          await Storage.updatePendingReports(updatedPendingReports);
        } catch (error) {
          // Silent error handling
        }
      }

      return syncedCount;
    } catch (error) {
      // Silent error handling
      return 0;
    }
  }
}