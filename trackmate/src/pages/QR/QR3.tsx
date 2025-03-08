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

const QR3: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>QR Location 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Location 3 Details</h2>
        <p><strong>Overview:</strong> Collie is a vibrant town where walkers can take a break before heading south. The trail passes through scenic landscapes, including the Collie River, Mungalup Dam, and Wellington Forest. Walkers experience a mix of natural beauty and historical landmarks.</p>
        <p><strong>Landmarks:</strong></p>
        <ul>
          <li>Collie River</li>
          <li>Mungalup Dam (no swimming allowed)</li>
          <li>Glen Mervyn Dam (great for swimming)</li>
          <li>Mumballup Forest Tavern</li>
          <li>Noggerup Conservation Park</li>
        </ul>
        <p><strong>Flora & Fauna:</strong></p>
        <ul>
          <li>Virgin Jarrah forest</li>
          <li>Native animals like Quokka, Quenda (Southern Brown Bandicoot), Mardo, and Chuditch</li>
          <li>Evidence of the logging industry</li>
          <li>Fox control under the Western Shield Project</li>
        </ul>

        <h2>Emergency Roads</h2>
        <p><strong>Nearest Emergency Road Access:</strong> Donnybrook-Boyup Brook Road (Mumballup)</p>
        <p><strong>Distance From Current Location:</strong> Approx. 19km south of Collie</p>
        <p><strong>Description:</strong> Accessible from Mumballup, this road connects to the Mumballup Forest Tavern. It is a small settlement road with limited facilities.</p>

        <h2>Nearest Camp Shelter</h2>
        <p><strong>Shelter Name:</strong> Yabberup Campsite</p>
        <p><strong>Distance From Current Location:</strong> Approx. 19.3km from Collie</p>
        <p><strong>Facilities Available:</strong></p>
        <ul>
          <li>Sleeping shelter</li>
          <li>Rainwater tank</li>
          <li>Toilet</li>
          <li>Picnic tables</li>
        </ul>
        <p><strong>GPS Coordinates:</strong> -33.463577317679274, 116.07753239488885</p>
      </IonContent>
    </IonPage>
  );
};

export default QR3;