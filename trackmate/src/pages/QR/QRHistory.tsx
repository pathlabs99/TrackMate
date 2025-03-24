import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButtons,
  IonButton,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { documentOutline, downloadOutline } from 'ionicons/icons';
import { useState } from 'react';
import './QR.css';

const QRHistory: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'today' | 'all'>('today');

  // Mock data - replace with actual history data
  const historyItems = [
    { title: 'Guideline.pdf', timestamp: new Date() },
    { title: 'Guideline.pdf', timestamp: new Date() },
    { title: 'Guideline.pdf', timestamp: new Date() },
    { title: 'Guideline.pdf', timestamp: new Date() },
  ];

  return (
    <IonPage className="qr-history">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scanning History</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="history-filters">
          <IonSegment value={timeFilter} onIonChange={e => setTimeFilter(e.detail.value as 'today' | 'all')}>
            <IonSegmentButton value="today">Today</IonSegmentButton>
            <IonSegmentButton value="all">All</IonSegmentButton>
          </IonSegment>
        </div>

        <IonList>
          {historyItems.map((item, index) => (
            <IonItem key={index}>
              <IonIcon icon={documentOutline} slot="start" className="history-icon" />
              <IonLabel>
                <h2>{item.title}</h2>
                <p>{item.timestamp.toLocaleString()}</p>
              </IonLabel>
              <IonButtons slot="end">
                <IonButton className="download-button">
                  <IonIcon icon={downloadOutline} />
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default QRHistory;
