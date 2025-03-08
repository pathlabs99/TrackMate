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
        <p><strong>Overview:</strong> The Murray River Valley trail offers a diverse walking experience, combining tranquil pools, steep hills, and remnants of old railway formations. Walkers can enjoy both scenic beauty and historical significance along the path.</p>
        <p><strong>Landmarks:</strong> Old railway formations, Murray River rapids, tranquil pools, and campsites along the trail.</p>
        <p><strong>Flora & Fauna:</strong> Typical Australian bush landscape with a mix of native plants and wildlife, offering a serene environment for walkers.</p>

        <h2>Emergency Roads</h2>
        <p><strong>Nearest Emergency Road Access:</strong> Harvey-Quindanning Road Access Point</p>
        <p><strong>Distance From Current Location:</strong> Approximately 42 km from Harvey or 35 km from Quindanning.</p>
        <p><strong>Description:</strong> The Bibbulmun Track intersects with the Harvey-Quindanning Road. While the exact crossing point isn't suitable for vehicle parking, walkers are advised to park at the intersection with Chalk Road, located 160 meters east of the crossing, as a safer alternative.</p>

        <h2>Nearest Camp Shelter</h2>
        <p><strong>Shelter Name:</strong> Swamp Oak Campsite</p>
        <p><strong>Distance From Current Location:</strong> 12.9 km, Approximately 5 hours</p>
        <p><strong>Facilities Available:</strong> The Campsite has a three-sided timber shelter, a sit-down pedestal pit toilet (BYO toilet paper), a rainwater tank, picnic tables and tent sites. The tank water is not guaranteed and must be treated by boiling, filtration or chemical treatment.</p>
        <p><strong>GPS Coordinates:</strong> A walker can struggle to find a phone signal here; no GPS coordinates are identified.</p>
      </IonContent>
    </IonPage>
  );
};

export default QR2;