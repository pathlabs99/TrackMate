/**
 * @fileoverview Network status display component for the TrackMate issue reporting system.
 * @author Marwa
 * @date 2025-04-13
 * @filename NetworkStatusView.tsx
 *
 * This component displays the current network status (online/offline) in the issue
 * reporting interface. It shows both a status indicator in the toolbar and a banner
 * notification when the device is offline, informing users that reports will be saved locally.
 */

import React from "react";
import { IonChip, IonIcon, IonLabel } from "@ionic/react";
import { wifi, cloudOfflineOutline } from "ionicons/icons";

/**
 * Props for the NetworkStatusView component
 * 
 * @interface NetworkStatusViewProps
 * @property {boolean} isOnline - Whether the device currently has network connectivity
 */
interface NetworkStatusViewProps {
  isOnline: boolean;
}

/**
 * Component for displaying network connectivity status
 * Shows different UI elements based on online/offline state
 * 
 * @param {NetworkStatusViewProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
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
