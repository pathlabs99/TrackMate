import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import React from 'react';

const QR2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>QR Location 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Location 2 Details</h2>
        <p>This is the information for QR code location 2.</p>
      </IonContent>
    </IonPage>
  );
};

export default QR2; 