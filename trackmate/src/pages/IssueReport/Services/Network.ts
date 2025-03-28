// Services/NetworkService.ts
// Extracted from your network handling code

import { Network as CapacitorNetwork } from "@capacitor/network";
import { API as API } from "./API";
import { Storage } from "./Storage";

export class Network {
  /**
   * Get current network status
   */
  static async getNetworkStatus(): Promise<boolean> {
    const status = await CapacitorNetwork.getStatus();
    return status.connected;
  }

  /**
   * Add network status change listener
   * @param callback Function to call when network status changes
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
   * Sync pending reports when back online
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
          console.error("Error syncing report:", error);
        }
      }

      return syncedCount;
    } catch (error) {
      console.error("Error during sync:", error);
      return 0;
    }
  }
}