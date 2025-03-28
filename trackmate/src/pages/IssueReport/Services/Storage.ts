// Services/StorageService.ts
import localforage from "localforage";
import { IssueFormData } from "../Models/IssueReport";

export class Storage {
  private static readonly DRAFT_KEY = "draft-report";
  private static readonly PENDING_REPORTS_KEY = "pending-reports";
  private static readonly PHOTOS_KEY = "issue-photos";

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
   * Save photo data
   */
  static async savePhoto(photoId: string, photoData: string): Promise<void> {
    try {
      const photos = await this.getPhotos();
      photos[photoId] = photoData;
      await localforage.setItem(this.PHOTOS_KEY, photos);
    } catch (error) {
      console.error('Error saving photo:', error);
      throw error;
    }
  }

  /**
   * Get photo data by ID
   */
  static async getPhoto(photoId: string): Promise<string | null> {
    try {
      const photos = await this.getPhotos();
      return photos[photoId] || null;
    } catch (error) {
      console.error('Error getting photo:', error);
      return null;
    }
  }

  /**
   * Get all stored photos
   */
  static async getPhotos(): Promise<Record<string, string>> {
    try {
      const photos = await localforage.getItem<Record<string, string>>(this.PHOTOS_KEY);
      return photos || {};
    } catch (error) {
      console.error('Error getting photos:', error);
      return {};
    }
  }

  /**
   * Delete photo by ID
   */
  static async deletePhoto(photoId: string): Promise<void> {
    try {
      const photos = await this.getPhotos();
      delete photos[photoId];
      await localforage.setItem(this.PHOTOS_KEY, photos);
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  }

  /**
   * Get all pending reports
   */
  static async getPendingReports(): Promise<any[]> {
    try {
      const reports = await localforage.getItem<any[]>(this.PENDING_REPORTS_KEY);
      return reports || [];
    } catch (error) {
      console.error('Error getting pending reports:', error);
      return [];
    }
  }

  /**
   * Update pending reports
   */
  static async updatePendingReports(reports: any[]): Promise<void> {
    try {
      await localforage.setItem(this.PENDING_REPORTS_KEY, reports);
    } catch (error) {
      console.error('Error updating pending reports:', error);
      throw error;
    }
  }

  /**
   * Remove a specific pending report
   */
  static async removePendingReport(reportId: string): Promise<void> {
    try {
      const reports = await this.getPendingReports();
      const updatedReports = reports.filter(report => report.id !== reportId);
      await this.updatePendingReports(updatedReports);
    } catch (error) {
      console.error('Error removing pending report:', error);
      throw error;
    }
  }

  /**
   * Clear all pending reports
   */
  static async clearPendingReports(): Promise<void> {
    try {
      await localforage.removeItem(this.PENDING_REPORTS_KEY);
    } catch (error) {
      console.error('Error clearing pending reports:', error);
      throw error;
    }
  }
}