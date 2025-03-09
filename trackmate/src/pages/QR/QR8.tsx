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

const QR8: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>QR Location 8</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
      <h1><strong>Walpole</strong></h1>
        <h2>Location 8 Details</h2>
        <p><strong>Overview:</strong> The Walpole section of the Bibbulmun Track offers a diverse mix of forest and coastal landscapes. Walkers can explore the towering karri and tingle forests before transitioning to the rugged southern coastline.</p>
        <p><strong>Landmarks:</strong></p>
        <ul>
          <li>Valley of the Giants Tree Top Walk – a 600m long walkway rising 40m above the forest floor, offering panoramic views of ancient tingle trees.</li>
          <li>Conspicuous Beach and Conspicuous Cliff with scenic coastal views.</li>
          <li>Hilltop Lookout with stunning forest vistas.</li>
          <li>Parry Inlet – known for its seasonal sandbar crossings.</li>
        </ul>
        <p><strong>Flora & Fauna:</strong></p>
        <ul>
          <li>Karri and tingle trees dominate the forested areas.</li>
          <li>Red flowering gum blossoms in heathlands.</li>
          <li>Kangaroos are frequently spotted at the Showgrounds.</li>
          <li>Wildflowers bloom in spring, adding vibrant colours to the landscape.</li>
        </ul>

        <h2>Emergency Roads</h2>
        <p><strong>Nearest Emergency Road Access:</strong> South Coast Highway (via Peaceful Bay Road).</p>
        <p><strong>Distance From Current Location:</strong> Approximately 10km from Peaceful Bay.</p>
        <p><strong>Description:</strong> This emergency road provides vehicle access to Peaceful Bay, connecting to the South Coast Highway for transport to nearby towns.</p>

        <h2>Nearest Camp Shelter</h2>
        <p><strong>Shelter Name:</strong> Boat Harbour Campsite</p>
        <p><strong>Distance From Current Location:</strong> Approximately 7km east of Peaceful Bay.</p>
        <p><strong>Facilities Available:</strong> Water tank, sleeping platforms, picnic tables, toilet, and a nearby swimming spot.</p>
        <p><strong>GPS Coordinates:</strong> -35.03246352104092, 117.06800236414422</p>
      </IonContent>
    </IonPage>
  );
};

export default QR8;