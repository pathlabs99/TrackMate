/**
 * @fileoverview CSV utility functions for TrackMate survey data.
 * @author TrackMate Team
 * @date 2025-04-13
 * @filename CSV.ts
 *
 * This file contains functions for formatting dates, generating CSV data,
 * and creating unique survey identifiers.
 */

import { FormData } from '../models/FormData';

/**
 * Format date to show AWST (Australian Western Standard Time)
 * 
 * @param isoDate - ISO date string to format
 * @returns Formatted date string in AWST timezone (UTC+8)
 */
export const formatSubmissionDate = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    
    const awstTime = new Date(date.getTime() + (8 * 60 * 60 * 1000));
    
    const day = String(awstTime.getUTCDate()).padStart(2, '0');
    const month = String(awstTime.getUTCMonth() + 1).padStart(2, '0');
    const year = awstTime.getUTCFullYear();
    
    let hours = awstTime.getUTCHours();
    const minutes = String(awstTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(awstTime.getUTCSeconds()).padStart(2, '0');
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    
    return `AWST: ${month}/${day}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  } catch (error) {
    return isoDate;
  }
};

/**
 * Generate CSV data from form data
 * 
 * @param formData - The survey form data to convert to CSV
 * @returns Promise that resolves to CSV string
 */
export const generateCSV = async (formData: FormData): Promise<string> => {
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

  const rowData = headers.map(header => {
    const value = formData[header as keyof FormData];
    
    if (header === 'submissionDate') {
      const dateValue = value as string;
      if (dateValue) {
        return `"${formatSubmissionDate(dateValue)}"`;
      }
      return '""';
    }

    if (header === 'transportUsed') {
      const transportValue = value as string;
      if (transportValue === 'other' && formData.otherTransport) {
        return `"other (${formData.otherTransport})"`;
      }
      return transportValue ? `"${transportValue}"` : '""';
    }

    if (header === 'overseasCountry') {
      if (value === 'other' && formData.overseasCountryOther) {
        return `"other (${formData.overseasCountryOther})"`;
      }
      return `"${value || ''}"`;
    }

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

    if (['otherTransport', 'tripDurationOvernight', 'travelGroupOther', 'overseasCountryOther'].includes(header)) {
      return null;
    }

    if (header === 'tripDuration') {
      if (value === 'overnight' && formData.tripDurationOvernight) {
        return `"overnight: ${formData.tripDurationOvernight} nights"`;
      }
      return `"${value}"`;
    }

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
        const matrixValues = value ? JSON.parse(value as string) : {};
        
        const benefitsData = benefitFields
          .map(field => {
            const fieldValue = matrixValues[field];
            return fieldValue ? `${field}: ${fieldValue}` : null;
          })
          .filter(Boolean)
          .join(', ');
        
        return benefitsData ? `"${benefitsData}"` : '""';
      } catch (e) {
        return '""';
      }
    }

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
        return '""';
      }
    }

    if (['numberOfAdults', 'numberOfChildren4AndUnder', 'numberOfChildren5to17'].includes(header)) {
      return null;
    }

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
        return '""';
      }
    }

    if (['startPoint', 'finishPoint', 'customPoints'].includes(header)) {
      return null;
    }

    if (Array.isArray(value)) {
      return `"${value.join(';')}"`;
    } else if (value === null || value === undefined || value === '') {
      return '""';
    } else if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
      return `"${value.replace(/"/g, '""')}"`;
    } else {
      return String(value);
    }
  }).filter(Boolean);

  const csvContent = [
    headers.join(','),
    rowData.join(',')
  ].join('\r\n');

  return '\ufeff' + csvContent + '\r\n';
};

/**
 * Generate a unique survey ID
 * 
 * @returns A unique survey ID string in format SURVEY-YYYYMMDD-HHMMSS-XXX
 */
export const generateSurveyId = (): string => {
  const now = new Date();
  const datePart = now.toISOString().split('T')[0].replace(/-/g, '');
  const timePart = now.toTimeString().split(' ')[0].replace(/:/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SURVEY-${datePart}-${timePart}-${random}`;
};