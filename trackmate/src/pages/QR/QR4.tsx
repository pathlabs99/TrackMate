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

const QR4: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>QR Location 4</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Location 4 Details</h2>
        <p><strong>Overview:</strong> Ballingup marks a significant transitional section on the Bibbulmun Track, where the lush jarrah, marri, and yarri forests give way to the majestic karri forest – the second tallest flowering tree in the world. This section also signifies the halfway point for end-to-end walkers, offering breathtaking views and rich biodiversity.</p>
        <p><strong>Landmarks:</strong></p>
        <ul>
          <li>Golden Valley Tree Park</li>
          <li>Blackwood Valley scenic views</li>
          <li>Southampton Bridge</li>
          <li>Greenbushes Loop Trail</li>
          <li>Donnelly River Village</li>
        </ul>
        <p><strong>Flora & Fauna:</strong> The region has five unique eucalypt species: flooded gum, jarrah, yarri (blackbutt), marri, and bullich. The area provides year-round food for nectar and seed-eating birds, small mammals, kangaroos, and emus, which are commonly seen in the Donnelly River Village.</p>

        <h2>Emergency Roads</h2>
        <p><strong>Nearest Emergency Road Access:</strong> Old Padbury Road</p>
        <p><strong>Distance From Current Location:</strong> Approximately 2 km south of Golden Valley Tree Park</p>
        <p><strong>Description:</strong> Old Padbury Road is paved with original cobblestones laid by convicts and connects the Bibbulmun Track to nearby roads for emergency access.</p>

        <h2>Nearest Camp Shelter</h2>
        <p><strong>Shelter Name:</strong> Blackwood Campsite</p>
        <p><strong>Distance From Current Location:</strong> 13.5 km south of Ballingup</p>
        <p><strong>Facilities Available:</strong> Sleeping shelter, rainwater tank, bush toilet, picnic table, and tent sites.</p>
        <p><strong>GPS Coordinates:</strong> -33.86321745905593, 115.95974921338063</p>
      </IonContent>
    </IonPage>
  );
};

export default QR4;