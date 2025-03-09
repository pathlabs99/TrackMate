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

const QR7: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>QR Location 7</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
      <h1><strong>Northcliffe</strong></h1>
        <h2>Location 7 Details</h2>
        <p><strong>Overview:</strong> Northcliffe marks the transition between karri forests and coastal shrublands, offering one of the most diverse sections of the Track. The journey from Northcliffe to Walpole is the second longest stretch without resupply points, crossing through remote and often waterlogged terrain like the Pingerup Plains and D’Entrecasteaux National Park.</p>
        <p><strong>Landmarks:</strong></p>
        <ul>
          <li>Mount Chance (Granite dome or Batholith)</li>
          <li>Dog Pool (Shannon River crossing and campsite)</li>
          <li>Lake Maringup (Second largest freshwater lake in WA)</li>
          <li>Mandalay Beach (Southern Ocean viewpoint)</li>
          <li>Chatham Island (Visible from Mandalay Beach)</li>
          <li>Mount Clare (Red Tingle Tree forest)</li>
        </ul>
        <p><strong>Flora & Fauna:</strong> The area is rich in karri forests, jarrah woodlands, swamp bottlebrush, and red tingle trees— species unique to Walpole. Wildflowers bloom between spring and autumn, while native animals like black snakes, kangaroos, and cockatoos are commonly seen.</p>

        <h2>Emergency Roads</h2>
        <p><strong>Nearest Emergency Road Access:</strong> Windy Harbour Road</p>
        <p><strong>Distance From Current Location:</strong> Approximately 5 km south of Northcliffe</p>
        <p><strong>Description:</strong> Provides access to the track near the Gardner Campsite.</p>

        <h2>Nearest Camp Shelter</h2>
        <p><strong>Shelter Name:</strong> Gardner Campsite</p>
        <p><strong>Distance From Current Location:</strong> Approximately 17 km south of Northcliffe</p>
        <p><strong>Facilities Available:</strong> Three-sided shelter, pit toilet, rainwater tank, picnic tables, tent sites</p>
        <p><strong>GPS Coordinates:</strong> -34.719391827235924, 116.17974247962637</p>
      </IonContent>
    </IonPage>
  );
};

export default QR7;