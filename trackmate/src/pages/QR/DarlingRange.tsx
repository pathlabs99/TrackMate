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
  mapOutline,
} from 'ionicons/icons';
import './LocationPages.css';
import darlingrangeImage from './images/darlingrange.jpeg';

interface Landmark {
  name: string;
  searchQuery: string;
}

const DarlingRange: React.FC = () => {
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
      </div>
      <div className={`dropdown-content ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );

  const landmarks: Landmark[] = [
    {
      name: "Mundaring Weir",
      searchQuery: "Mundaring+Weir+Perth+Hills+WA"
    },
    {
      name: "Beelu National Park",
      searchQuery: "Beelu+National+Park+Mundaring+WA"
    }
  ];

  const openInGoogleMaps = (searchQuery: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

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
                  Kalamunda is the starting point of the Bibbulmun Track, known for its rich indigenous history and early European timber settlements. The Darling Range section offers stunning views and diverse landscapes.
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
                  <p>Jarrah and Marri forests dominate the landscape</p>
                </div>
                <div className="flora-item">
                  <IonIcon icon={pawOutline} />
                  <p>Western Grey Kangaroos and native bird species</p>
                </div>
              </div>
            </DropdownSection>
          </div>
        );
      
      case 'emergency':
        return renderEmergencyTab();
      
      case 'camp':
        return renderCampTab();
      
      default:
        return null;
    }
  };

  const renderEmergencyTab = () => (
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
              <p>Mundaring Weir Road</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={timeOutline} />
            <div className="detail-item-content">
              <strong>Distance</strong>
              <p>2 km from the track</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={informationCircleOutline} />
            <div className="detail-item-content">
              <strong>Description</strong>
              <p>Sealed road accessible by emergency vehicles</p>
            </div>
          </div>
        </div>
      </DropdownSection>
    </div>
  );

  const renderCampTab = () => (
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
              <p>Hewett's Hill Campsite</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={timeOutline} />
            <div className="detail-item-content">
              <strong>Distance</strong>
              <p>11.1 km</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={bedOutline} />
            <div className="detail-item-content">
              <strong>Facilities</strong>
              <ul>
                <li>Sleeping shelter</li>
                <li>No re-supply points until Dwellingup</li>
              </ul>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={locationOutline} />
            <div className="detail-item-content">
              <strong>GPS Coordinates</strong>
              <p>-31.9650, 116.1587</p>
            </div>
          </div>
        </div>
      </DropdownSection>
    </div>
  );

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
            src={darlingrangeImage}
            className="hero-image" 
            alt="Darling Range landscape" 
          />
          <div className="hero-overlay">
            <h1 className="location-name">DARLING RANGE</h1>
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

export default DarlingRange;