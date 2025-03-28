// src/pages/IssueReport/Components/LocationView.tsx
// Component for handling location input and GPS functionality

import React from "react";
import {
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonChip,
  IonTextarea,
} from "@ionic/react";
import { locationOutline, location } from "ionicons/icons";
import { Coordinates } from "../Models/IssueReport";

interface LocationViewProps {
  location: string;
  coordinates: Coordinates | null;
  validationError?: string;
  onLocationChange: (value: string) => void;
  onGetLocation: () => Promise<void>;
}

const LocationView: React.FC<LocationViewProps> = ({
  location,
  coordinates,
  validationError,
  onLocationChange,
  onGetLocation,
}) => {
  return (
    <IonItem className={validationError ? "ion-invalid" : ""}>
      <IonLabel position="stacked">
        Location <span className="required-mark">*</span>
      </IonLabel>

      <IonGrid>
        <IonRow>
          <IonCol size="8">
            {coordinates ? (
              <IonChip color="success">
                <IonIcon icon={locationOutline} />
                <IonLabel>GPS coordinates captured</IonLabel>
              </IonChip>
            ) : (
              <p>Please capture your GPS coordinates</p>
            )}
          </IonCol>
          <IonCol size="4">
            <IonButton
              onClick={onGetLocation}
              expand="block"
              className="gps-button"
            >
              <IonIcon slot="start" icon={location} />
              GPS
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>

      {coordinates && (
        <div className="coordinates-display">
          <strong>Lat:</strong> {coordinates.latitude.toFixed(6)},
          <strong> Long:</strong> {coordinates.longitude.toFixed(6)}
          <br />
          <small>Accuracy: ±{Math.round(coordinates.accuracy)}m</small>
        </div>
      )}

      <p className="helper-text">Optionally, you can describe the location:</p>
      <IonTextarea
        value={location}
        onIonChange={(e) => onLocationChange(e.detail.value || "")}
        placeholder="Example: 2km north of Helena shelter"
      />

      {validationError && (
        <div className="validation-error">{validationError}</div>
      )}
    </IonItem>
  );
};

export default LocationView;
