// Services/StorageService.ts
// Extracted from your local storage handling code

import localforage from "localforage";
import { IssueFormData } from "../Models/IssueReport";

export class Storage {
  private static readonly DRAFT_KEY = "draft-report";
  private static readonly PENDING_REPORTS_KEY = "pending-reports";

  /**
   * Load stored form data draft
   */
  static async loadFormDraft(): Promise<IssueFormData | null> {
    try {
      return await localforage.getItem<IssueFormData>(this.DRAFT_KEY);
    } catch (error) {
      console.error('Error loading draft form data:', error);
      return null;
    }
  }

  /**
   * Save form data as a draft
   */
  static async saveFormDraft(formData: IssueFormData): Promise<void> {
    try {
      await localforage.setItem(this.DRAFT_KEY, formData);
    } catch (error) {
      console.error('Error saving form draft:', error);
    }
  }

  /**
   * Clear saved form draft
   */
  static async clearFormDraft(): Promise<void> {
    try {
      await localforage.removeItem(this.DRAFT_KEY);
    } catch (error) {
      console.error('Error clearing form draft:', error);
    }
  }

  /**
   * Store pending report for offline mode
   */
  static async savePendingReport(reportData: any): Promise<void> {
    try {
      const pendingReports = await this.getPendingReports();
      pendingReports.push({
        data: reportData,
        timestamp: new Date().toISOString(),
      });

      await localforage.setItem(this.PENDING_REPORTS_KEY, pendingReports);
    } catch (error) {
      console.error('Error saving pending report:', error);
      throw error;
    }
  }

  /**
   * Get all pending reports
   */
  static async getPendingReports(): Promise<any[]> {
    try {
      return (await localforage.getItem<any[]>(this.PENDING_REPORTS_KEY)) || [];
    } catch (error) {
      console.error('Error getting pending reports:', error);
      return [];
    }
  }

  /**
   * Update pending reports after syncing
   */
  static async updatePendingReports(pendingReports: any[]): Promise<void> {
    try {
      await localforage.setItem(this.PENDING_REPORTS_KEY, pendingReports);
    } catch (error) {
      console.error('Error updating pending reports:', error);
    }
  }
}