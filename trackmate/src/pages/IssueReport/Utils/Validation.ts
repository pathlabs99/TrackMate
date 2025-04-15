/**
 * @fileoverview Form validation utilities for TrackMate's issue reporting system
 * @author Marwa
 * @module pages/IssueReport/Utils
 * @description Provides validation functions and error handling for issue report forms.
 * Validates required fields, email format, coordinates, and issue descriptions.
 */

import { IssueFormData, Coordinates } from "../Models/IssueReport";

export interface ValidationErrors {
  [key: string]: string;
}

export function validateForm(
  formData: IssueFormData, 
  coordinates: Coordinates | null
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Name validation
  if (!formData.name) {
    errors.name = "Name is required";
  }

  // Email validation
  if (!formData.email) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
  }

  // Date validation
  if (!formData.dateObserved) {
    errors.dateObserved = "Date is required";
  } else {
    // Check if date is within the last 4 weeks
    const selectedDate = new Date(formData.dateObserved);
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28); // 4 weeks = 28 days

    if (selectedDate < fourWeeksAgo) {
      errors.dateObserved = "Date must be within the last 4 weeks";
    }

    // Also check that the date is not in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    if (selectedDate > today) {
      errors.dateObserved = "Date cannot be in the future";
    }
  }

  // Location validation
  if (!formData.location && !coordinates) {
    errors.location =
      "Location information is required (either description or GPS coordinates)";
  }

  // Comments validation
  if (!formData.comments) {
    errors.comments = "Issue description is required";
  }

  return errors;
}