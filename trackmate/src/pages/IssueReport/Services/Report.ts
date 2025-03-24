// Services/ReportService.ts
// Central service to handle report submission logic

import { API } from './API';
import { ValidationErrors } from '../Utils/Validation';
import { IssueFormData, Coordinates } from '../Models/IssueReport';

interface SubmitResult {
  success: boolean;
  status: 'submitted' | 'queued';
  message: string;
  color: string;
}

export class Report {
  /**
   * Submit a report - either to the server (online) or save locally (offline)
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
      console.error('Error submitting report:', error);
      return {
        success: false,
        status: 'submitted',
        message: 'Error submitting report. Please try again.',
        color: 'danger'
      };
    }
  }

  /**
   * Validate the form data
   */
  static validateForm(formData: IssueFormData, coordinates: Coordinates | null): ValidationErrors {
    const errors: ValidationErrors = {};

    // Add your validation logic here
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
   * Sync pending reports
   */
  static async syncPendingReports(): Promise<void> {
    return API.syncPendingReports();
  }
}