// Services/APIService.ts
// Extracted from your submitReportToServer function

// Server URL from your original code
const API_URL = "https://trackmate-server-0uvc.onrender.com";

console.log("API.ts loaded");

export class API {
  /**
   * Submit report data to the server
   */
  static async submitReport(reportData: any): Promise<any> {
    try {
      // Extract form data
      const formData = reportData.formData || {};
      
      // Create a payload for the server that preserves all original data
      // This helps with both online and offline reports
      const requestPayload = {
        // Core structure - essential for both email and CSV
        reportId: reportData.reportId,
        coordinates: reportData.coordinates,
        photo: reportData.photo,
        submissionDate: reportData.submissionDate,
        
        // Root-level fields for email template - use original values, not defaults
        // This ensures offline reports use actual data, not "Not provided"
        name: formData.name || "",
        email: formData.email || "", 
        telephone: formData.telephone || "",
        dateObserved: formData.dateObserved || "",
        location: formData.location || "",
        issueType: formData.issueType || "",
        urgency: formData.urgency || "",
        comments: formData.comments || ""
      };

      const response = await fetch(`${API_URL}/send-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Submit error:', error);
      throw error;
    }
  }

  /**
   * Test connection to the server
   * This would be used if you implement a connection test feature
   */
  static async testConnection(): Promise<any> {
    try {
      console.log("Testing connection to:", `${API_URL}/test`);
      
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
      console.error("Connection test error:", error);
      throw error;
    }
  }
}