// src/pages/IssueReport/Components/UrgencySelector.tsx
// Component for selecting urgency level

import React from "react";
import {
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from "@ionic/react";

interface UrgencySelectProps {
  urgency: string;
  onUrgencyChange: (value: string) => void;
}

const UrgencySelect: React.FC<UrgencySelectProps> = ({
  urgency,
  onUrgencyChange,
}) => {
  return (
    <>
      <IonItem lines="none">
        <IonLabel position="stacked">Urgency Level</IonLabel>
      </IonItem>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonButton
              expand="block"
              fill={urgency === "low" ? "solid" : "outline"}
              color="success"
              onClick={() => onUrgencyChange("low")}
              className={`urgency-button-low ${
                urgency === "low" ? "urgency-selected" : "urgency-not-selected"
              }`}
            >
              Low
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              expand="block"
              fill={urgency === "medium" ? "solid" : "outline"}
              color="warning"
              onClick={() => onUrgencyChange("medium")}
              className={`urgency-button-medium ${
                urgency === "medium"
                  ? "urgency-selected"
                  : "urgency-not-selected"
              }`}
            >
              Medium
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              expand="block"
              fill={urgency === "high" ? "solid" : "outline"}
              color="danger"
              onClick={() => onUrgencyChange("high")}
              className={`urgency-button-high ${
                urgency === "high" ? "urgency-selected" : "urgency-not-selected"
              }`}
            >
              High
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default UrgencySelect;
