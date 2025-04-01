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
  timeOutline,
  bedOutline,
  waterOutline,
  mapOutline,
} from 'ionicons/icons';
import './LocationPages.css';
import pembertonImage from './images/pemberton.jpg';

interface Landmark {
  name: string;
  searchQuery: string;
}

const Pemberton: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('details');
  const [landmarksOpen, setLandmarksOpen] = useState(false);
  const [floraOpen, setFloraOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);

  const landmarks: Landmark[] = [
    {
      name: "Gloucester Tree",
      searchQuery: "Gloucester+Tree+Pemberton+WA"
    },
    {
      name: "Warren River Valley",
      searchQuery: "Warren+River+Valley+Pemberton+WA"
    },
    {
      name: "River Road Bridge",
      searchQuery: "River+Road+Bridge+Pemberton+WA"
    },
    {
      name: "Moons Crossing",
      searchQuery: "Moons+Crossing+Pemberton+WA"
    },
    {
      name: "Northcliffe Forest Park",
      searchQuery: "Northcliffe+Forest+Park+WA"
    }
  ];

  const openInGoogleMaps = (searchQuery: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

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
                {landmarks.map((landmark, index) => (
                  <div className="landmark-item" key={index}>
                    <div className="landmark-info">
                      <IonIcon icon={locationOutline} />
                      <span>{landmark.name}</span>
                    </div>
                    <IonIcon 
                      icon={mapOutline} 
                      className="map-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openInGoogleMaps(landmark.searchQuery);
                      }}
                    />
                  </div>
                ))}
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
                    <p>Gloucester Tree (Car Track Crossing)</p>
                  </div>
                </div>
                <div className="detail-item">
                  <IonIcon icon={timeOutline} />
                  <div className="detail-item-content">
                    <strong>Distance</strong>
                    <p>3 km from current location</p>
                  </div>
                </div>
                <div className="detail-item">
                  <IonIcon icon={informationCircleOutline} />
                  <div className="detail-item-content">
                    <strong>Description</strong>
                    <p>Access via Ellis St (off the main street) in Pemberton. Look for signs to the Gloucester Tree.</p>
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
                    <p>20.3 km from current location</p>
                  </div>
                </div>
                <div className="detail-item">
                  <IonIcon icon={informationCircleOutline} />
                  <div className="detail-item-content">
                    <strong>Alternative Route</strong>
                    <p>Starting from Gloucester Tree reduces distance to about 19 km</p>
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
                    <p>-34.509040835930634, 115.96098926612025</p>
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