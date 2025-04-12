import { FormData } from '../models/FormData';

/**
 * Format date to show AWST (Australian Western Standard Time)
 * AWST is UTC+8, covering Western Australia
 */
export const formatSubmissionDate = (isoDate: string): string => {
  try {
    // Parse the provided ISO date
    const date = new Date(isoDate);
    
    // Manually apply UTC+8 offset for AWST
    // Get UTC time in milliseconds and add 8 hours (8 * 60 * 60 * 1000 milliseconds)
    const awstTime = new Date(date.getTime() + (8 * 60 * 60 * 1000));
    
    // Extract date components
    const day = String(awstTime.getUTCDate()).padStart(2, '0');
    const month = String(awstTime.getUTCMonth() + 1).padStart(2, '0');
    const year = awstTime.getUTCFullYear();
    
    // Extract time components
    let hours = awstTime.getUTCHours();
    const minutes = String(awstTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(awstTime.getUTCSeconds()).padStart(2, '0');
    
    // Convert to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // Convert 0 to 12 for 12 AM
    
    // Format the final string
    return `AWST: ${month}/${day}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoDate; // Return original date if there's an error
  }
};

/**
 * Generate CSV data from form data
 */
export const generateCSV = async (formData: FormData): Promise<string> => {
  // Define headers
  const headers = [
    "surveyId",
    "submissionDate",
    "visitedLastFourWeeks",
    "lastVisitDate",
    "heardOfFoundation",
    "promptedToWalk",
    "transportUsed",
    "tripType",
    "tripDuration",
    "numberOfNights",
    "logbookRecord",
    "trackUsage",
    "satisfaction",
    "recommendation",
    "trackExpenditure",
    "expenditureTiming",
    "expenditurePeopleCount",
    "annualGearExpenditure",
    "walkPoints",
    "totalKilometers",
    "walkingBenefits",
    "societalBenefits",
    "residence",
    "stateTerritory",
    "overseasCountry",
    "decisionTime",
    "waPostcode",
    "walkAgain",
    "mainReason",
    "gender",
    "ageGroup",
    "travelGroup",
    "groupComposition",
  ];

  // Create row data
  const rowData = headers.map(header => {
    const value = formData[header as keyof FormData];
    
    // Special handling for submissionDate to format with multiple time zones
    if (header === 'submissionDate') {
      const dateValue = value as string;
      if (dateValue) {
        return `"${formatSubmissionDate(dateValue)}"`;
      }
      return '""';
    }

    // Special handling for transportUsed with otherTransport
    if (header === 'transportUsed') {
      const transportValue = value as string;
      if (transportValue === 'other' && formData.otherTransport) {
        return `"other (${formData.otherTransport})"`;
      }
      return transportValue ? `"${transportValue}"` : '""';
    }

    // Special handling for overseasCountry with other value
    if (header === 'overseasCountry') {
      if (value === 'other' && formData.overseasCountryOther) {
        return `"other (${formData.overseasCountryOther})"`;
      }
      return `"${value || ''}"`;
    }

    // Special handling for travelGroup with other value
    if (header === 'travelGroup') {
      const travelGroupValue = value as string;
      if (Array.isArray(travelGroupValue)) {
        if (travelGroupValue.includes('other') && formData.travelGroupOther) {
          const otherIndex = travelGroupValue.indexOf('other');
          const values = [...travelGroupValue];
          values[otherIndex] = `other (${formData.travelGroupOther})`;
          return `"${values.join('; ')}"`;
        }
        return `"${travelGroupValue.join('; ')}"`;
      }
      return `"${travelGroupValue || ''}"`;
    }

    // Skip fields that are handled in other columns
    if (['otherTransport', 'tripDurationOvernight', 'travelGroupOther', 'overseasCountryOther'].includes(header)) {
      return null;
    }

    // Special handling for tripDuration with overnight value
    if (header === 'tripDuration') {
      if (value === 'overnight' && formData.tripDurationOvernight) {
        return `"overnight: ${formData.tripDurationOvernight} nights"`;
      }
      return `"${value}"`;
    }

    // Special handling for matrix questions
    if (header === 'walkingBenefits' || header === 'societalBenefits') {
      const benefitFields = header === 'walkingBenefits' ? [
        'accessNature',
        'appreciateScenic',
        'challengeYourself',
        'activeHealthy',
        'escapeUrban',
        'experienceNew',
        'relaxUnwind',
        'socialise',
        'outdoorRecreation',
        'connectNature',
        'improveQuality',
        'increaseAppreciation',
        'healthBenefits'
      ] : [
        'greenCorridors',
        'communityWellbeing',
        'regionalTourism',
        'communityPride',
        'employment',
        'biodiversity',
        'physicalFitness',
        'businessInvestment'
      ];
      
      try {
        // Parse the matrix values from JSON
        const matrixValues = value ? JSON.parse(value as string) : {};
        
        // Extract values in the correct order with field names
        const benefitsData = benefitFields
          .map(field => {
            const fieldValue = matrixValues[field];
            return fieldValue ? `${field}: ${fieldValue}` : null;
          })
          .filter(Boolean)
          .join(', ');
        
        return benefitsData ? `"${benefitsData}"` : '""';
      } catch (e) {
        console.error('Error parsing matrix values:', e);
        return '""';
      }
    }

    // Special handling for group composition
    if (header === 'groupComposition') {
      try {
        const groupValues = value ? JSON.parse(value as string) : {};
        const parts = [
          groupValues.numberOfAdults ? `adults: ${groupValues.numberOfAdults}` : null,
          groupValues.numberOfChildren4AndUnder ? `children 4 and under: ${groupValues.numberOfChildren4AndUnder}` : null,
          groupValues.numberOfChildren5to17 ? `children 5-17: ${groupValues.numberOfChildren5to17}` : null
        ].filter(Boolean);
        
        return parts.length > 0 ? `"${parts.join(', ')}"` : '""';
      } catch (e) {
        console.error('Error parsing group composition values:', e);
        return '""';
      }
    }

    // Skip individual group composition fields as they are handled together
    if (['numberOfAdults', 'numberOfChildren4AndUnder', 'numberOfChildren5to17'].includes(header)) {
      return null;
    }

    // Skip individual fields that are handled in combined fields
    if ([
      'accessNature', 'appreciateScenic', 'challengeYourself', 'activeHealthy',
      'escapeUrban', 'experienceNew', 'relaxUnwind', 'socialise',
      'outdoorRecreation', 'connectNature', 'improveQuality',
      'increaseAppreciation', 'healthBenefits', 'greenCorridors',
      'communityWellbeing', 'regionalTourism', 'communityPride',
      'employment', 'biodiversity', 'physicalFitness', 'businessInvestment'
    ].includes(header)) {
      return null;
    }

    // Special handling for numberOfNights and trackExpenditure
    if (header === 'numberOfNights' || header === 'trackExpenditure') {
      if (Array.isArray(value) && value.length > 0) {
        try {
          const jsonData = JSON.parse(value[0]);
          return `"${JSON.stringify(jsonData).replace(/"/g, '""')}"`;
        } catch (e) {
          return '""';
        }
      }
      return '""';
    }

    // Special handling for numberWithSub fields
    if (header === 'expenditurePeopleCount' || header === 'annualGearExpenditure' || 
        header === 'totalKilometers' || header === 'waPostcode') {
      try {
        const jsonData = JSON.parse(value as string);
        if (header === 'expenditurePeopleCount') {
          return `"peopleCount: ${jsonData.peopleCount}"`;
        }
        if (header === 'annualGearExpenditure') {
          return `"gearCost: ${jsonData.gearCost}"`;
        }
        if (header === 'totalKilometers') {
          return `"kilometers: ${jsonData.kilometers}"`;
        }
        if (header === 'waPostcode') {
          return `"postcode: ${jsonData.postcode}"`;
        }
        return `"${JSON.stringify(jsonData).replace(/"/g, '""')}"`;
      } catch (e) {
        return '""';
      }
    }
    
    // Special handling for walkPoints with location data
    if (header === 'walkPoints') {
      try {
        const walkPointsData = value ? JSON.parse(value as string) : {};
        const parts = [
          walkPointsData.startPoint ? `start: ${walkPointsData.startPoint}` : null,
          walkPointsData.finishPoint ? `finish: ${walkPointsData.finishPoint}` : null,
          walkPointsData.customPoints ? `custom: ${walkPointsData.customPoints}` : null
        ].filter(Boolean);
        
        return parts.length > 0 ? `"${parts.join(', ')}"` : '""';
      } catch (e) {
        console.error('Error parsing walkPoints values:', e);
        return '""';
      }
    }

    // Skip individual location fields as they are now handled in walkPoints
    if (['startPoint', 'finishPoint', 'customPoints'].includes(header)) {
      return null;
    }

    // Handle other data types
    if (Array.isArray(value)) {
      return `"${value.join(';')}"`;
    } else if (value === null || value === undefined || value === '') {
      return '""';
    } else if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
      return `"${value.replace(/"/g, '""')}"`;
    } else {
      return String(value);
    }
  }).filter(Boolean); // Remove undefined values

  // Combine headers and data with proper line endings
  const csvContent = [
    headers.join(','),
    rowData.join(',')
  ].join('\r\n');

  // Add UTF-8 BOM and ensure proper line endings
  return '\ufeff' + csvContent + '\r\n';
};

/**
 * Generate a unique survey ID
 */
export const generateSurveyId = (): string => {
  const now = new Date();
  const datePart = now.toISOString().split('T')[0].replace(/-/g, '');
  const timePart = now.toTimeString().split(' ')[0].replace(/:/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SURVEY-${datePart}-${timePart}-${random}`;
};