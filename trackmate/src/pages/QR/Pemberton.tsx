import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonLabel,
  IonImg,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { 
  arrowBack,
  locationOutline,
  leafOutline,
  informationCircleOutline,
  warningOutline,
  homeOutline,
  trailSignOutline,
  flowerOutline,
  pawOutline,
  medkitOutline,
  chevronDownOutline,
  timeOutline,
  bedOutline,
  waterOutline,
} from 'ionicons/icons';
import './LocationPages.css';
import pembertonImage from './images/pemberton.jpg';

const Pemberton: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('details');
  const [landmarksOpen, setLandmarksOpen] = useState(false);
  const [floraOpen, setFloraOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);

  const DropdownSection: React.FC<{
    title: string;
    icon: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }> = ({ title, icon, isOpen, onToggle, children }) => (
    <div className="dropdown-section">
      <div className="dropdown-header" onClick={onToggle}>
        <div className="dropdown-header-content">
          <IonIcon icon={icon} />
          <h4>{title}</h4>
        </div>
        <IonIcon 
          icon={chevronDownOutline} 
          className={`dropdown-icon ${isOpen ? 'open' : ''}`}
        />
      </div>
      <div className={`dropdown-content ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'details':
        return (
          <div className="tab-content">
            <div className="section">
              <h3 className="section-title">
                <IonIcon icon={informationCircleOutline} />
                OVERVIEW
              </h3>
              <div style={{ marginTop: '1rem' }}>
                <p className="section-text">
                  Pemberton is a charming town surrounded by magnificent karri forests. The journey to Northcliffe offers pleasant forest walks, historical landmarks, and diverse vegetation, making it perfect for multi-day hiking.
                </p>
              </div>
            </div>
            
            <DropdownSection
              title="LANDMARKS"
              icon={trailSignOutline}
              isOpen={landmarksOpen}
              onToggle={() => setLandmarksOpen(!landmarksOpen)}
            >
              <div className="landmarks-list">
                <div className="landmark-item">
                  <IonIcon icon={locationOutline} />
                  <span>Gloucester Tree (72m fire-lookout)</span>
                </div>
                <div className="landmark-item">
                  <IonIcon icon={waterOutline} />
                  <span>Warren River Valley</span>
                </div>
                <div className="landmark-item">
                  <IonIcon icon={locationOutline} />
                  <span>River Road Bridge</span>
                </div>
                <div className="landmark-item">
                  <IonIcon icon={waterOutline} />
                  <span>Moons Crossing</span>
                </div>
                <div className="landmark-item">
                  <IonIcon icon={locationOutline} />
                  <span>Northcliffe Forest Park</span>
                </div>
              </div>
            </DropdownSection>

            <DropdownSection
              title="FLORA & FAUNA"
              icon={flowerOutline}
              isOpen={floraOpen}
              onToggle={() => setFloraOpen(!floraOpen)}
            >
              <div className="flora-fauna-content">
                <div className="flora-item">
                  <IonIcon icon={leafOutline} />
                  <p>Majestic karri trees</p>
                </div>
                <div className="flora-item">
                  <IonIcon icon={leafOutline} />
                  <p>Sandy tea-tree flats</p>
                </div>
                <div className="flora-item">
                  <IonIcon icon={flowerOutline} />
                  <p>Spring climbing plants and wildflowers</p>
                </div>
                <div className="flora-item">
                  <IonIcon icon={pawOutline} />
                  <p>Kangaroos, cockatoos, and forest possums</p>
                </div>
              </div>
            </DropdownSection>
          </div>
        );
      
      case 'emergency':
        return (
          <div className="tab-content">
            <DropdownSection
              title="EMERGENCY ACCESS"
              icon={medkitOutline}
              isOpen={emergencyOpen}
              onToggle={() => setEmergencyOpen(!emergencyOpen)}
            >
              <div className="emergency-details">
                <div className="detail-item">
                  <IonIcon icon={locationOutline} />
                  <div className="detail-item-content">
                    <strong>Nearest Access Point</strong>
                    <p>River Road Bridge</p>
                  </div>
                </div>
                <div className="detail-item">
                  <IonIcon icon={timeOutline} />
                  <div className="detail-item-content">
                    <strong>Distance</strong>
                    <p>10 km south of Pemberton town</p>
                  </div>
                </div>
                <div className="detail-item">
                  <IonIcon icon={informationCircleOutline} />
                  <div className="detail-item-content">
                    <strong>Description</strong>
                    <p>Historic wooden trestle bridge from 1930s, accessible by vehicle</p>
                  </div>
                </div>
              </div>
            </DropdownSection>
          </div>
        );
      
      case 'camp':
        return (
          <div className="tab-content">
            <DropdownSection
              title="CAMP FACILITIES"
              icon={homeOutline}
              isOpen={facilitiesOpen}
              onToggle={() => setFacilitiesOpen(!facilitiesOpen)}
            >
              <div className="camp-details">
                <div className="detail-item">
                  <IonIcon icon={locationOutline} />
                  <div className="detail-item-content">
                    <strong>Name</strong>
                    <p>Warren Campsite</p>
                  </div>
                </div>
                <div className="detail-item">
                  <IonIcon icon={timeOutline} />
                  <div className="detail-item-content">
                    <strong>Distance</strong>
                    <p>15 km south of Pemberton</p>
                  </div>
                </div>
                <div className="detail-item">
                  <IonIcon icon={bedOutline} />
                  <div className="detail-item-content">
                    <strong>Facilities</strong>
                    <ul>
                      <li>Sleeping shelter</li>
                      <li>Toilet</li>
                      <li>Water tank</li>
                      <li>Picnic table</li>
                      <li>Tent sites</li>
                    </ul>
                  </div>
                </div>
                <div className="detail-item">
                  <IonIcon icon={locationOutline} />
                  <div className="detail-item-content">
                    <strong>GPS Coordinates</strong>
                    <p>-34.5090, 115.9610</p>
                  </div>
                </div>
              </div>
            </DropdownSection>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border transparent-header">
        <div className="header-buttons">
          <IonBackButton defaultHref="/tab1" className="back-button" icon={arrowBack} />
        </div>
      </IonHeader>
      
      <IonContent className="location-content">
        {/* Hero Image with Location Name */}
        <div className="hero-container">
          <IonImg 
            src={pembertonImage}
            className="hero-image" 
            alt="Pemberton landscape" 
          />
          <div className="hero-overlay">
            <h1 className="location-name">PEMBERTON</h1>
            <p className="location-subtitle">Western Australia</p>
          </div>
        </div>
        
        {/* Content Card */}
        <IonCard className="content-card">
          <IonCardContent>
            {/* Tab Navigation */}
            <IonSegment value={selectedTab} onIonChange={e => setSelectedTab(e.detail.value as string)}>
              <IonSegmentButton value="details">
                <div className="segment-button-layout">
                  <IonIcon icon={informationCircleOutline} />
                  <IonLabel>Details</IonLabel>
                </div>
              </IonSegmentButton>
              <IonSegmentButton value="emergency">
                <div className="segment-button-layout">
                  <IonIcon icon={warningOutline} />
                  <IonLabel>Emergency</IonLabel>
                </div>
              </IonSegmentButton>
              <IonSegmentButton value="camp">
                <div className="segment-button-layout">
                  <IonIcon icon={homeOutline} />
                  <IonLabel>Camp</IonLabel>
                </div>
              </IonSegmentButton>
            </IonSegment>

            {/* Tab Content */}
            {renderTabContent()}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Pemberton;