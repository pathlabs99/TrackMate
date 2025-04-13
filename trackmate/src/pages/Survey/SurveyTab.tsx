/**
 * @fileoverview Survey tab component for the TrackMate application.
 * @author Abdullah
 * @date 2025-04-13
 * @filename SurveyTab.tsx
 *
 * This file contains the SurveyTab component which serves as a container
 * for the Survey component and handles survey progress validation.
 */

import React, { useEffect } from 'react';
import { 
  IonContent,
  IonPage,
} from "@ionic/react";
import { Survey } from './Survey';
import "./SurveyTab.css";

/**
 * SurveyTab component that wraps the Survey component in an Ionic page
 * and handles validation of saved survey progress data
 */
export const SurveyTab: React.FC = () => {
  /**
   * Effect to validate and clean up corrupted survey progress data on component mount
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('surveyProgress');
      if (saved) {
        // Verify the saved data is valid
        const parsed = JSON.parse(saved);
        if (!parsed || typeof parsed !== 'object' || !parsed.formData || typeof parsed.currentQuestion !== 'number') {
          // If invalid, clear it
          localStorage.removeItem('surveyProgress');
        }
      }
    } catch (e) {
      // If parsing fails, clear storage
      localStorage.removeItem('surveyProgress');
    }
  }, []);

  return (
    <IonPage className="survey-page">
      <IonContent className="ion-padding">
        <Survey />
      </IonContent>
    </IonPage>
  );
};
