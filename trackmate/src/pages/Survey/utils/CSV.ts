import { FormData } from '../models/FormData';

export const generateCSV = async (formData: FormData): Promise<string> => {
  const headers = Object.keys(formData).join(',');
  const values = Object.values(formData)
    .map((value) => {
      if (Array.isArray(value)) {
        return `"${value.join(';')}"`; // Handle arrays
      } else if (value === null || value === undefined) {
        return '""'; // Handle empty values
      } else {
        return `"${String(value).replace(/"/g, '""')}"`; // Escape double quotes
      }
    })
    .join(',');

  return `${headers}\n${values}\n`; // Ensure the CSV ends with a newline
};