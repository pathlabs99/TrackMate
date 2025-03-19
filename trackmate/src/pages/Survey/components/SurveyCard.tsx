import React, { ReactNode } from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";

interface SurveyCardProps {
  title: string;
  content: ReactNode;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ title, content }) => {
  return (
    <IonCard className="survey-card">
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>{content}</IonCardContent>
    </IonCard>
  );
};

export default SurveyCard;
