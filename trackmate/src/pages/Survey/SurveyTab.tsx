import React from 'react';
import { 
  IonContent,
  IonPage,
} from "@ionic/react";
import { Survey } from './Survey';
import "./SurveyTab.css";

export const SurveyTab: React.FC = () => {
  return (
    <IonPage className="survey-page">
      <IonContent className="ion-padding">
        <Survey />
      </IonContent>
    </IonPage>
  );
};
