/**
 * @fileoverview Storage service for the TrackMate issue reporting system.
 * @author Marwa
 * @date 2025-04-13
 * @filename Storage.ts
 *
 * This file contains the Storage service which provides functionality
 * for storing and retrieving issue report data, photos, and pending reports.
 */

import localforage from "localforage";
import { IssueFormData } from "../Models/IssueReport";

/**
 * Storage service class that provides methods for
 * storing and retrieving issue report data
 */
export class Storage {
  /** Key for storing draft reports */
  private static readonly DRAFT_KEY = "draft-report";
  /** Key for storing pending reports */
  private static readonly PENDING_REPORTS_KEY = "pending-reports";
  /** Key for storing issue photos */
  private static readonly PHOTOS_KEY = "issue-photos";

  /**
   * Load stored form data draft from local storage
   * 
   * @returns Promise resolving to form data or null if not found
   */
  static async loadFormDraft(): Promise<IssueFormData | null> {
    try {
      return await localforage.getItem<IssueFormData>(this.DRAFT_KEY);
    } catch (error) {
      // Silent error handling
      return null;
    }
  }

  /**
   * Save form data as a draft to local storage
   * 
   * @param formData - The form data to save
   * @returns Promise that resolves when data is saved
   */
  static async saveFormDraft(formData: IssueFormData): Promise<void> {
    try {
      await localforage.setItem(this.DRAFT_KEY, formData);
    } catch (error) {
      // Silent error handling
    }
  }

  /**
   * Clear saved form draft from local storage
   * 
   * @returns Promise that resolves when draft is cleared
   */
  static async clearFormDraft(): Promise<void> {
    try {
      await localforage.removeItem(this.DRAFT_KEY);
    } catch (error) {
      // Silent error handling
    }
  }

  /**
   * Save photo data to local storage
   * 
   * @param photoId - Unique identifier for the photo
   * @param photoData - Base64 encoded photo data
   * @returns Promise that resolves when photo is saved
   * @throws Error if saving fails
   */
  static async savePhoto(photoId: string, photoData: string): Promise<void> {
    try {
      const photos = await this.getPhotos();
      photos[photoId] = photoData;
      await localforage.setItem(this.PHOTOS_KEY, photos);
    } catch (error) {
      // Silent error handling
      throw error;
    }
  }

  /**
   * Get photo data by ID from local storage
   * 
   * @param photoId - Unique identifier for the photo
   * @returns Promise resolving to photo data or null if not found
   */
  static async getPhoto(photoId: string): Promise<string | null> {
    try {
      const photos = await this.getPhotos();
      return photos[photoId] || null;
    } catch (error) {
      // Silent error handling
      return null;
    }
  }

  /**
   * Get all stored photos from local storage
   * 
   * @returns Promise resolving to object mapping photo IDs to photo data
   */
  static async getPhotos(): Promise<Record<string, string>> {
    try {
      const photos = await localforage.getItem<Record<string, string>>(this.PHOTOS_KEY);
      return photos || {};
    } catch (error) {
      // Silent error handling
      return {};
    }
  }

  /**
   * Delete photo by ID from local storage
   * 
   * @param photoId - Unique identifier for the photo to delete
   * @returns Promise that resolves when photo is deleted
   */
  static async deletePhoto(photoId: string): Promise<void> {
    try {
      const photos = await this.getPhotos();
      delete photos[photoId];
      await localforage.setItem(this.PHOTOS_KEY, photos);
    } catch (error) {
      // Silent error handling
    }
  }

  /**
   * Get all pending reports from local storage
   * 
   * @returns Promise resolving to array of pending reports
   */
  static async getPendingReports(): Promise<any[]> {
    try {
      const reports = await localforage.getItem<any[]>(this.PENDING_REPORTS_KEY);
      return reports || [];
    } catch (error) {
      // Silent error handling
      return [];
    }
  }

  /**
   * Update pending reports in local storage
   * 
   * @param reports - Array of pending reports to save
   * @returns Promise that resolves when reports are saved
   * @throws Error if saving fails
   */
  static async updatePendingReports(reports: any[]): Promise<void> {
    try {
      await localforage.setItem(this.PENDING_REPORTS_KEY, reports);
    } catch (error) {
      // Silent error handling
      throw error;
    }
  }

  /**
   * Remove a specific pending report from local storage
   * 
   * @param reportId - Unique identifier for the report to remove
   * @returns Promise that resolves when report is removed
   * @throws Error if removal fails
   */
  static async removePendingReport(reportId: string): Promise<void> {
    try {
      const reports = await this.getPendingReports();
      const updatedReports = reports.filter(report => report.id !== reportId);
      await this.updatePendingReports(updatedReports);
    } catch (error) {
      // Silent error handling
      throw error;
    }
  }

  /**
   * Clear all pending reports from local storage
   * 
   * @returns Promise that resolves when all reports are cleared
   * @throws Error if clearing fails
   */
  static async clearPendingReports(): Promise<void> {
    try {
      await localforage.removeItem(this.PENDING_REPORTS_KEY);
    } catch (error) {
      // Silent error handling
      throw error;
    }
  }
}