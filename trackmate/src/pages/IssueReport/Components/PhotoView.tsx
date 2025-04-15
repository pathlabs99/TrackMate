/**
 * @fileoverview Photo capture component for the TrackMate issue reporting system.
 * @author Marwa
 * @filename PhotoView.tsx
 *
 * This component handles photo capture and display for issue reports.
 * It provides options to take a new photo using the device camera or
 * select an existing photo from the gallery. It also supports removing
 * photos and works with the Capacitor Camera API for cross-platform
 * compatibility.
 */

import React from "react";
import {
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonActionSheet,
} from "@ionic/react";
import { camera, image, trash } from "ionicons/icons";
import { CameraSource } from "@capacitor/camera";

/**
 * Props for the PhotoView component
 * 
 * @interface PhotoViewProps
 * @property {string | null} photo - Base64 encoded photo data or file path
 * @property {boolean} showActionSheet - Whether to show the camera options action sheet
 * @property {(source: CameraSource) => Promise<void>} onTakePhoto - Handler for photo capture
 * @property {() => void} onRemovePhoto - Handler for photo removal
 * @property {(show: boolean) => void} onShowActionSheet - Handler for toggling action sheet
 */
interface PhotoViewProps {
  photo: string | null;
  showActionSheet: boolean;
  onTakePhoto: (source: CameraSource) => Promise<void>;
  onRemovePhoto: () => void;
  onShowActionSheet: (show: boolean) => void;
}

/**
 * Component for capturing and displaying photos in issue reports
 * Provides camera access, gallery selection, and photo removal
 * 
 * @param {PhotoViewProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const PhotoView: React.FC<PhotoViewProps> = ({
  photo,
  showActionSheet,
  onTakePhoto,
  onRemovePhoto,
  onShowActionSheet,
}) => {
  return (
    <>
      <IonItem lines="none">
        <IonLabel position="stacked">Photo (Optional)</IonLabel>
        <IonButton
          expand="block"
          color="medium"
          className="ion-margin-top"
          onClick={() => onShowActionSheet(true)}
        >
          <IonIcon slot="start" icon={camera} />
          {photo ? "Change Photo" : "Add Photo"}
        </IonButton>

        {photo && (
          <div className="photo-container">
            <img src={photo} alt="Issue" className="issue-photo" />
            <IonButton
              expand="block"
              color="danger"
              size="small"
              className="ion-margin-top"
              onClick={onRemovePhoto}
            >
              <IonIcon slot="start" icon={trash} />
              Remove Photo
            </IonButton>
          </div>
        )}
      </IonItem>

      {/* Action sheet for camera options */}
      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => onShowActionSheet(false)}
        buttons={[
          {
            text: "Take Photo",
            icon: camera,
            handler: () => {
              onTakePhoto(CameraSource.Camera);
            },
          },
          {
            text: "Choose from Gallery",
            icon: image,
            handler: () => {
              onTakePhoto(CameraSource.Photos);
            },
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ]}
      />
    </>
  );
};

export default PhotoView;
