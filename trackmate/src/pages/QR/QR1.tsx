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

const QR1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>QR Location 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
      <h1><strong>The Darling Range</strong></h1>
        <h2>Location 1 Details</h2>
        <p><strong>Overview:</strong> Kalamunda is the starting point of the Bibbulmun Track, known for its rich indigenous history and early European timber settlements.</p>
        <p><strong>Landmarks:</strong> Mundaring Weir, Beelu National Park.</p>
        <p><strong>Flora & Fauna:</strong> Jarrah and Marri forests, Western Grey Kangaroos, and native bird species.</p>

        <h2>Emergency Roads</h2>
        <p><strong>Nearest Emergency Road Access:</strong> Mundaring Weir Road</p>
        <p><strong>Distance From Current Location:</strong> Approximately 2 km from the track.</p>
        <p><strong>Description:</strong> Sealed road accessible by emergency vehicles.</p>

        <h2>Nearest Camp Shelter</h2>
        <p><strong>Shelter Name:</strong> Hewett's Hill Campsite</p>
        <p><strong>Distance From Current Location:</strong> 5 km</p>
        <p><strong>Facilities Available:</strong> No re-supply points until Dwellingup</p>
        <p><strong>GPS Coordinates:</strong> -31.9650, 116.1587</p>
      </IonContent>
    </IonPage>
  );
};

export default QR1;