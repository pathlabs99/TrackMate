// Services/ReportService.ts
// Central service to handle report submission logic

import { IssueFormData, Coordinates } from "../Models/IssueReport";
import { API } from "./API";
import { Storage } from "./Storage";
import { BackgroundSync } from "./BackgroundSync";
import { generateReportId } from "../Utils/IDGenerator";
import { validateForm, ValidationErrors } from "../Utils/Validation";
import { Network } from "@capacitor/network";

export class Report {
  /**
   * Submit a report - either to the server (online) or save locally (offline)
   */
  static async submitReport(
    formData: IssueFormData,
    coordinates: Coordinates | null,
    photo: string | null,
    isOnline: boolean
  ): Promise<{ success: boolean; message: string; color: string }> {
    try {
      // Validate form data
      const validationErrors = validateForm(formData, coordinates);
      if (Object.keys(validationErrors).length > 0) {
        return {
          success: false,
          message: "Please correct the errors in the form",
          color: "danger"
        };
      }

      // Ensure all form fields have valid values (no undefined)
      const verifiedFormData: IssueFormData = {
        name: formData.name || "",
        email: formData.email || "",
        telephone: formData.telephone || "",
        dateObserved: formData.dateObserved || new Date().toISOString().split("T")[0],
        location: formData.location || "",
        issueType: formData.issueType || "",
        urgency: formData.urgency || "medium",
        comments: formData.comments || "",
      };

      // Generate report ID
      const reportId = generateReportId();
      const submissionDate = new Date().toISOString();

      // Create report structure without duplicated fields
      const reportData = {
        reportId,
        coordinates,
        photo,
        submissionDate,
        formData: verifiedFormData
      };

      // Check network status directly
      const networkStatus = await Network.getStatus();
      const currentlyOnline = networkStatus.connected;
      
      if (currentlyOnline) {
        // Online - send directly to server
        await API.submitReport(reportData);

        // Clear form draft on successful submission
        await Storage.clearFormDraft();

        return {
          success: true,
          message: "Report submitted successfully",
          color: "success"
        };
      } else {
        // Offline - store for later sync
        await BackgroundSync.savePendingReport(reportData);

        // Clear form draft on successful storage
        await Storage.clearFormDraft();

        return {
          success: true,
          message: "You're offline. Report saved and will be sent automatically when you're back online.",
          color: "warning"
        };
      }
    } catch (error: unknown) {
      console.error("Submit error:", error);
      
      // Properly handle the unknown type error
      let errorMessage = "An unknown error occurred";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      // Check if we should try to save offline
      try {
        const networkStatus = await Network.getStatus();
        if (!networkStatus.connected) {
          // We're offline and an error occurred - try to save the report
          const reportId = generateReportId();
          const submissionDate = new Date().toISOString();
          
          // Ensure all form fields have valid values
          const verifiedFormData: IssueFormData = {
            name: formData.name || "",
            email: formData.email || "",
            telephone: formData.telephone || "",
            dateObserved: formData.dateObserved || new Date().toISOString().split("T")[0],
            location: formData.location || "",
            issueType: formData.issueType || "",
            urgency: formData.urgency || "medium",
            comments: formData.comments || "",
          };
          
          const reportData = {
            reportId,
            coordinates,
            photo,
            submissionDate,
            formData: verifiedFormData
          };
          
          await BackgroundSync.savePendingReport(reportData);
          
          return {
            success: true,
            message: "Error sending report but saved offline. Will retry when online.",
            color: "warning"
          };
        }
      } catch (offlineError) {
        console.error("Error during offline fallback:", offlineError);
      }
      
      return {
        success: false,
        message: `Failed to submit report: ${errorMessage}`,
        color: "danger"
      };
    }
  }

  /**
   * Check for any pending reports and sync them
   */
  static async checkAndSyncPendingReports(): Promise<number> {
    try {
      const pendingReports = await BackgroundSync.getPendingReports();
      if (pendingReports.length > 0) {
        const networkStatus = await Network.getStatus();
        if (networkStatus.connected) {
          return await BackgroundSync.syncPendingReports();
        }
      }
      return 0;
    } catch (error) {
      console.error("Error checking pending reports:", error);
      return 0;
    }
  }

  /**
   * Validate the form data
   */
  static validateForm(
    formData: IssueFormData, 
    coordinates: Coordinates | null
  ): ValidationErrors {
    return validateForm(formData, coordinates);
  }
}