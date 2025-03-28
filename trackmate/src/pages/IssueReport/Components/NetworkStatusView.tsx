// src/pages/IssueReport/Components/NetworkStatusView.tsx
// Component to display network status

import React from "react";
import { IonChip, IonIcon, IonLabel } from "@ionic/react";
import { wifi, cloudOfflineOutline } from "ionicons/icons";

interface NetworkStatusViewProps {
  isOnline: boolean;
}

const NetworkStatusView: React.FC<NetworkStatusViewProps> = ({ isOnline }) => {
  return (
    <>
      {/* Toolbar network status indicator */}
      <div slot="end" className="ion-padding-end">
        {isOnline ? (
          <IonChip color="success" outline={true}>
            <IonIcon icon={wifi} />
            <IonLabel>Online</IonLabel>
          </IonChip>
        ) : (
          <IonChip color="warning" outline={true}>
            <IonIcon icon={cloudOfflineOutline} />
            <IonLabel>Offline</IonLabel>
          </IonChip>
        )}
      </div>

      {/* Banner for offline mode */}
      {!isOnline && (
        <div className="network-status network-status-offline">
          <IonIcon icon={cloudOfflineOutline} />
          <span className="ion-padding-start">
            You're offline. Report will be saved locally and sent when online.
          </span>
        </div>
      )}
    </>
  );
};

export default NetworkStatusView;
