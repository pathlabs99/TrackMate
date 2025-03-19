// src/pages/IssueReport/Components/PhotoView.tsx
// Component for handling photo capture and display

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

interface PhotoViewProps {
  photo: string | null;
  showActionSheet: boolean;
  onTakePhoto: (source: CameraSource) => Promise<void>;
  onRemovePhoto: () => void;
  onShowActionSheet: (show: boolean) => void;
}

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
