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

const QR5: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>QR Location 5</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Location 5 Details</h2>
        <p><strong>Overview:</strong> The Donnelly River winds through the lush valley, offering scenic beauty and a peaceful environment. The Bibbulmun Track follows the river, featuring some of the most challenging hills along the trail. The area is known for its swimming holes, granite boulders, and towering karri forests, making it a popular spot for both hikers and nature lovers.</p>
        <p><strong>Landmarks:</strong></p>
        <ul>
          <li>Twin Bridges</li>
          <li>One Tree Bridge on Graphite Road</li>
          <li>Beedelup Falls</li>
          <li>Big Brook Dam</li>
          <li>Big Brook Arboretum</li>
        </ul>
        <p><strong>Flora & Fauna:</strong> The region is home to old-growth karri forests, jarrah and marri trees, and vibrant wildflowers such as golden waterbush, white crowea, and purple tree hovea. Native animals like kangaroos, possums, and birdlife, including kookaburras and cockatoos, can be spotted along the riverbanks.</p>

        <h2>Emergency Roads</h2>
        <p><strong>Nearest Emergency Road Access:</strong> One Tree Bridge on Graphite Road</p>
        <p><strong>Distance From Current Location:</strong> Approximately 11.05 km from Tom Road Campsite</p>
        <p><strong>Description:</strong> A popular tourist spot with vehicle access offers a safe point for emergency evacuation and assistance.</p>

        <h2>Nearest Camp Shelter</h2>
        <p><strong>Shelter Name:</strong> Tom Road Campsite</p>
        <p><strong>Distance From Current Location:</strong> Approx. 5 km north along the Bibbulmun Track</p>
        <p><strong>Facilities Available:</strong> Sleeping shelter, toilet, water tank, picnic table, a nearby swimming pool in the Donnelly River, and walkers will need to carry food for five days in this section.</p>
        <p><strong>GPS Coordinates:</strong> -34.16429219388179, 115.91291012191837</p>
      </IonContent>
    </IonPage>
  );
};

export default QR5;