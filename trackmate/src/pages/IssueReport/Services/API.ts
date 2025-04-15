/**
 * @fileoverview API service for the TrackMate issue reporting system.
 * @author Marwa
 * @filename API.ts
 *
 * This file contains the API service which handles communication with the
 * TrackMate server for submitting issue reports.
 */

// Server URL for the TrackMate backend
const API_URL = "https://trackmateserver.onrender.com";

/**
 * API service class that provides methods for communicating
 * with the TrackMate server
 */
export class API {
  /**
   * Submit issue report data to the server
   * 
   * @param reportData - The issue report data to submit
   * @returns Promise resolving to the server response
   * @throws Error if the submission fails
   */
  static async submitReport(reportData: any): Promise<any> {
    try {
      // Add a flag to indicate no JSON attachment is needed in the email
      const modifiedReportData = {
        ...reportData,
        emailOptions: {
          attachJsonFile: false,  // This flag tells the server not to attach the JSON file in emails
          includeDataInBody: true // This flag suggests including the data in the email body instead
        }
      };

      const response = await fetch(`${API_URL}/send-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(modifiedReportData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      // Silent error handling
      throw error;
    }
  }

  /**
   * Test connection to the server
   * 
   * @returns Promise resolving to the connection test result
   * @throws Error if the connection test fails
   */
  static async testConnection(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/test`, {
        headers: {
          Accept: "application/json",
        },
      });

      return {
        status: response.status,
        data: await response.text()
      };
    } catch (error) {
      // Silent error handling
      throw error;
    }
  }
}