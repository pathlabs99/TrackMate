// Models/IssueReport.ts
// Extracted from your original IssueReportForm component interfaces

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface IssueFormData {
    title: string;
    description: string;
    issueType: string;
    urgency: string;
    name: string;
    email: string;
    telephone: string;
    date?: string;
    dateObserved?: string;
    locationDetails?: string;
    comments?: string;
}

export const defaultFormData: IssueFormData = {
    title: '',
    description: '',
    issueType: '',
    urgency: 'medium',
    name: '',
    email: '',
    telephone: '',
    dateObserved: '',
    locationDetails: '',
    comments: ''
};

// Complete report object structure (including form data and additional fields)
export interface IssueReport {
    reportId: string;
    formData: IssueFormData;
    coordinates: Coordinates | null;
    photo: string | null;
    submissionDate: string;
}