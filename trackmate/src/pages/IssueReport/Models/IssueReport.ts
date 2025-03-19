// Models/IssueReport.ts
// Extracted from your original IssueReportForm component interfaces

export interface IssueFormData {
    name: string;
    email: string;
    telephone: string;
    dateObserved: string;
    location: string;
    issueType: string;
    urgency: string;
    comments: string;
  }
  
  export interface Coordinates {
    latitude: number;
    longitude: number;
    accuracy: number;
  }
  
  // Default form data as defined in your useState initialization
  export const defaultFormData: IssueFormData = {
    name: "",
    email: "",
    telephone: "",
    dateObserved: new Date().toISOString().split("T")[0], // Today's date as default
    location: "",
    issueType: "",
    urgency: "medium", // Default urgency
    comments: "",
  };
  
  // Complete report object structure (including form data and additional fields)
  export interface IssueReport {
    reportId: string;
    formData: IssueFormData;
    coordinates: Coordinates | null;
    photo: string | null;
    submissionDate: string;
  }