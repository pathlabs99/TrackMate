/**
 * @fileoverview Report service for the TrackMate issue reporting system.
 * @author Marwa
 * @filename Report.ts
 *
 * This file contains the Report service which provides centralized functionality
 * for handling report submission, validation, and synchronization. It works with
 * the API service to handle both online and offline submissions.
 */

import { API } from './API';
import { BackgroundSync } from './BackgroundSync';
import { ValidationErrors } from '../Utils/Validation';
import { IssueFormData, Coordinates } from '../Models/IssueReport';

/**
 * Interface representing the result of a report submission
 * 
 * @interface SubmitResult
 * @property {boolean} success - Whether the submission was successful
 * @property {'submitted' | 'queued'} status - Status of the submission (submitted or queued for later)
 * @property {string} message - User-friendly message about the submission result
 * @property {string} color - Color code for UI feedback (success, warning, danger)
 */
interface SubmitResult {
  success: boolean;
  status: 'submitted' | 'queued';
  message: string;
  color: string;
}

/**
 * Service class for handling issue report operations
 * Provides methods for submitting, validating, and synchronizing reports
 */
export class Report {
  /**
   * Submit a report to the server or save locally for offline use
   * 
   * @param {IssueFormData} formData - The form data for the report
   * @param {Coordinates | null} coordinates - The geographic coordinates of the issue
   * @param {string | null} photo - Base64 encoded photo data or file path
   * @param {boolean} isOnline - Whether the device is currently online
   * @returns {Promise<SubmitResult>} Result of the submission attempt
   */
  static async submitReport(
    formData: IssueFormData,
    coordinates: Coordinates | null,
    photo: string | null,
    isOnline: boolean
  ): Promise<SubmitResult> {
    try {
      // Validate form data
      const validationErrors = this.validateForm(formData, coordinates);
      if (Object.keys(validationErrors).length > 0) {
        return {
          success: false,
          status: 'submitted',
          message: 'Please fix the validation errors',
          color: 'danger'
        };
      }

      // Prepare report data
      const reportData = {
        ...formData,
        coordinates,
        photo,
        submittedAt: new Date().toISOString()
      };

      // Submit report through API service
      const response = await API.submitReport(reportData);

      if (response.status === 'queued') {
        return {
          success: true,
          status: 'queued',
          message: 'Report saved offline. Will sync when online.',
          color: 'warning'
        };
      }

      return {
        success: true,
        status: 'submitted',
        message: 'Report submitted successfully!',
        color: 'success'
      };

    } catch (error) {
      // Silent error handling
      return {
        success: false,
        status: 'submitted',
        message: 'Error submitting report. Please try again.',
        color: 'danger'
      };
    }
  }

  /**
   * Validate the form data for a report submission
   * 
   * @param {IssueFormData} formData - The form data to validate
   * @param {Coordinates | null} coordinates - The geographic coordinates to validate
   * @returns {ValidationErrors} Object containing validation errors, if any
   */
  static validateForm(formData: IssueFormData, coordinates: Coordinates | null): ValidationErrors {
    const errors: ValidationErrors = {};

    // Validate required fields
    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description?.trim()) {
      errors.description = 'Description is required';
    }

    if (!coordinates) {
      errors.location = 'Location is required';
    }

    return errors;
  }

  /**
   * Synchronize pending reports that were saved offline
   * Delegates to the BackgroundSync service for actual synchronization
   * 
   * @returns {Promise<number>} Promise resolving to the number of successfully synced reports
   */
  static async syncPendingReports(): Promise<number> {
    return BackgroundSync.syncPendingReports();
  }
}