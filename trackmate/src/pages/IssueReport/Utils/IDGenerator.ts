// Utils/IDGenerator.ts
// Extracted from your generateReportId function

/**
 * Generates a unique report ID based on current date and time
 * Format: BTF-YYYYMMDD-HHMMSS-XXXX where XXXX is a random 4-digit number
 */
export function generateReportId(): string {
    const now = new Date();
  
    // Format date as YYYYMMDD
    const datePart =
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0");
  
    // Format time as HHMMSS
    const timePart =
      now.getHours().toString().padStart(2, "0") +
      now.getMinutes().toString().padStart(2, "0") +
      now.getSeconds().toString().padStart(2, "0");
  
    // Add a random 4-digit number for uniqueness
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
  
    return `BTF-${datePart}-${timePart}-${randomPart}`;
  }