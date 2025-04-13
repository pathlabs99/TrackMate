/**
 * @fileoverview Urgency selection component for the TrackMate issue reporting system.
 * @author Marwa
 * @date 2025-04-13
 * @filename UrgencySelect.tsx
 *
 * This component provides a user interface for selecting the urgency level
 * of an issue report. It offers three levels (low, medium, high) with
 * appropriate color coding and visual feedback for the selected option.
 */

import React from "react";
import {
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from "@ionic/react";

/**
 * Props for the UrgencySelect component
 * 
 * @interface UrgencySelectProps
 * @property {string} urgency - Currently selected urgency level ('low', 'medium', or 'high')
 * @property {(value: string) => void} onUrgencyChange - Handler for urgency selection changes
 */
interface UrgencySelectProps {
  urgency: string;
  onUrgencyChange: (value: string) => void;
}

/**
 * Component for selecting the urgency level of an issue report
 * Provides three options with appropriate color coding
 * 
 * @param {UrgencySelectProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
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
