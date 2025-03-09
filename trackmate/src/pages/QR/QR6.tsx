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

const QR6: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>QR Location 6</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
      <h1><strong>Pemberton</strong></h1>
        <h2>Location 6 Details</h2>
        <p><strong>Overview:</strong> Pemberton is a small town surrounded by karri forests known for its breathtaking landscapes. The journey from Pemberton to Northcliffe offers pleasant forest walks, historical landmarks, and diverse vegetation, making it ideal for a short multi-day hike.</p>
        <p><strong>Landmarks:</strong></p>
        <ul>
          <li>Gloucester Tree (World’s tallest fire-lookout tree at 72 metres)</li>
          <li>Warren River Valley</li>
          <li>River Road Bridge</li>
          <li>Moons Crossing</li>
          <li>Northcliffe Forest Park</li>
        </ul>
        <p><strong>Flora & Fauna:</strong> The area is home to karri trees, sandy tea-tree flats, and low scrublands. In spring, the landscape is filled with climbing plants and wildflowers. Native species such as kangaroos, cockatoos, and forest possums are commonly found here.</p>

        <h2>Emergency Roads</h2>
        <p><strong>Nearest Emergency Road Access:</strong> River Road Bridge</p>
        <p><strong>Distance From Current Location:</strong> Approx. 10 km south of Pemberton town</p>
        <p><strong>Description:</strong> The historic wooden trestle bridge was built in the 1930s, is accessible by vehicle, and is a common emergency evacuation point.</p>

        <h2>Nearest Camp Shelter</h2>
        <p><strong>Shelter Name:</strong> Warren Campsite</p>
        <p><strong>Distance From Current Location:</strong> Approx. 15 km south of Pemberton</p>
        <p><strong>Facilities Available:</strong> Sleeping shelter, toilet, water tank, picnic table, and tent sites</p>
        <p><strong>GPS Coordinates:</strong> -34.509040835930634, 115.96098926612025</p>
      </IonContent>
    </IonPage>
  );
};

export default QR6;