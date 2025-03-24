import { FormData } from '../models/FormData';

/**
 * Generate CSV data from form data
 */
export const generateCSV = async (formData: FormData): Promise<string> => {
  // Define headers in the order we want them to appear
  const headers = [
    "reportId",
    "submissionDate",
    "lastVisitDate",
    "visitedLastFourWeeks",
    "walkDuration",
    "heardOfFoundation",
    "transportUsed",
    "otherTransport",
    "tripType",
    "numberOfNights",
    "noStay",
    "trackShelter",
    "trackTent",
    "backpackers",
    "hotel",
    "bnb",
    "familyFriends",
    "otherCampsite",
    "promptedToWalk",
    "satisfaction",
    "gender",
    "ageGroup",
    "residence",
    "postcode",
    "stateTerritory",
    "overseasCountry",
    "travelGroup",
    "adultCount",
    "childrenUnder4Count",
    "children5to17Count"
  ];

  // Create row data
  const rowData = headers.map(header => {
    let value = formData[header as keyof FormData];
    
    // Handle different data types
    if (Array.isArray(value)) {
      // Join array values with semicolon and wrap in quotes
      return `"${value.join(';')}"`;
    } else if (value === null || value === undefined || value === '') {
      // Return empty quoted string for null/undefined/empty values
      return '""';
    } else if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
      // Escape quotes and wrap in quotes if contains special characters
      return `"${value.replace(/"/g, '""')}"`;
    } else {
      // Return value as is for simple values
      return String(value);
    }
  });

  // Combine headers and data with proper line endings
  const csvContent = [
    headers.join(','),
    rowData.join(',')
  ].join('\r\n');

  // Add UTF-8 BOM and ensure proper line endings
  return '\ufeff' + csvContent + '\r\n';
};

/**
 * Generate a unique report ID
 */
export const generateReportId = (): string => {
  const now = new Date();
  const datePart = now.toISOString().split('T')[0].replace(/-/g, '');
  const timePart = now.toTimeString().split(' ')[0].replace(/:/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BTF-${datePart}-${timePart}-${random}`;
};