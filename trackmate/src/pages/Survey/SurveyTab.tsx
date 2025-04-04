import React, { useEffect } from 'react';
import { 
  IonContent,
  IonPage,
} from "@ionic/react";
import { Survey } from './Survey';
import "./SurveyTab.css";

export const SurveyTab: React.FC = () => {
  // Reset any corrupted state on component mount
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
