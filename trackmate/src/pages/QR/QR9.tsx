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

const QR9: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>QR Location 9</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Location 9 Details</h2>
        <p><strong>Overview:</strong> The section from Denmark to Albany is a scenic coastal walk with beautiful beaches, stunning views of the Southern Ocean, and access to sheltered swimming spots. Walkers cross the Wilson and Torbay Inlets, with many options for crossing depending on the season. The path also features boardwalks near cliffs and passes through the West Cape Howe National Park and several historic settlements.</p>
        <p><strong>Landmarks:</strong></p>
        <ul>
          <li>West Cape Howe National Park: The southernmost point of Western Australia, Torbay Head.</li>
          <li>Albany Wind Farm: Visible from the West Cape Howe National Park, providing 80% of Albany’s electricity.</li>
          <li>Torndirrup National Park: Home to the famous Gap and Natural Bridge.</li>
          <li>The Amity Replica: A replica of the ship that brought the first settlers to Albany in 1826.</li>
        </ul>
        <p><strong>Flora & Fauna:</strong></p>
        <ul>
          <li>The region features dense paperbark thickets, coastal heath, and coastal vegetation in the West Cape Howe National Park.</li>
          <li>Includes waterbirds like black swans, pelicans, ducks, cormorants, egrets, and migratory waders. Whales and dolphins can be spotted in certain seasons.</li>
        </ul>

        <h2>Emergency Roads</h2>
        <p><strong>Nearest Emergency Road Access:</strong> South Coast Highway (Highway 1)</p>
        <p><strong>Distance From Current Location:</strong> Passes through Denmark</p>
        <p><strong>Description:</strong> Major highway providing access to Denmark and surrounding areas.</p>

        <h2>Nearest Camp Shelter</h2>
        <p><strong>Shelter Name:</strong></p>
        <ul>
          <li>Torbay Campsite (Near the Torbay Inlet)</li>
          <li>Albany Southern Terminus Shelter (at the end of the track near the visitor centre in Albany)</li>
        </ul>
        <p><strong>Distance From Current Location:</strong></p>
        <ul>
          <li>Torbay Campsite: 5-7 km before crossing the Torbay Inlet.</li>
          <li>Albany Southern Terminus Shelter: The end point of the track, located in the centre of Albany, approximately 1-2 km from the town centre.</li>
        </ul>
        <p><strong>Facilities Available:</strong> Three-sided shelter, pit toilet, rainwater tank, picnic tables, tent sites.</p>
        <p><strong>GPS Coordinates:</strong></p>
        <ul>
          <li>Torbay Campsite: -35.07892791163699, 117.64673459499356</li>
          <li>Albany Southern Terminus Shelter: -35.022688836853725, 117.88322937964436</li>
        </ul>
      </IonContent>
    </IonPage>
  );
};

export default QR9;