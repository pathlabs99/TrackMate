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