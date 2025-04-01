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
import dwellingupImage from './images/dwellingup.jpg';

// Reusable dropdown section component
interface DropdownSectionProps {
  title: string;
  icon: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const DropdownSection: React.FC<DropdownSectionProps> = ({ 
  title, 
  icon, 
  isOpen, 
  onToggle, 
  children 
}) => (
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

// Add interface and landmarks array before the component
interface Landmark {
  name: string;
  searchQuery: string;
}

const Dwellingup: React.FC = () => {
  // State management for tabs and dropdowns
  const [selectedTab, setSelectedTab] = useState('details');
  const [landmarksOpen, setLandmarksOpen] = useState(false);
  const [floraOpen, setFloraOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);

  const landmarks: Landmark[] = [
    {
      name: "Old Railway Formations",
      searchQuery: "Dwellingup+Railway+Station+Heritage+Trail+WA"
    },
    {
      name: "Murray River Rapids",
      searchQuery: "Murray+River+Rapids+Dwellingup+WA"
    },
    {
      name: "Lane Poole Reserve",
      searchQuery: "Lane+Poole+Reserve+Dwellingup+WA"
    }
  ];

  const openInGoogleMaps = (searchQuery: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  // Tab content rendering functions
  const renderDetailsTab = () => (
    <div className="tab-content">
      {/* Overview Section */}
      <div className="section">
        <h3 className="section-title">
          <IonIcon icon={informationCircleOutline} />
          OVERVIEW
        </h3>
        <div style={{ marginTop: '1rem' }}>
          <p className="section-text">
            The Murray River Valley trail offers a diverse walking experience, combining tranquil pools, steep hills, and remnants of old railway formations. The path blends scenic beauty with historical significance.
          </p>
        </div>
      </div>
      
      {/* Landmarks Section */}
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

      {/* Flora & Fauna Section */}
      <DropdownSection
        title="FLORA & FAUNA"
        icon={flowerOutline}
        isOpen={floraOpen}
        onToggle={() => setFloraOpen(!floraOpen)}
      >
        <div className="flora-fauna-content">
          <div className="flora-item">
            <IonIcon icon={leafOutline} />
            <p>Native Australian bush landscape</p>
          </div>
          <div className="flora-item">
            <IonIcon icon={pawOutline} />
            <p>Local wildlife in natural habitat</p>
          </div>
          <div className="flora-item">
            <IonIcon icon={leafOutline} />
            <p>Diverse native plant species</p>
          </div>
        </div>
      </DropdownSection>
    </div>
  );

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
              <p>River Road</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={timeOutline} />
            <div className="detail-item-content">
              <strong>Distance</strong>
              <p>1.8 km from current location</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={informationCircleOutline} />
            <div className="detail-item-content">
              <strong>Description</strong>
              <p>River Road is a key emergency access route in the Dwellingup region, directly connecting main roads and essential services.</p>
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
              <p>Swamp Oak Campsite</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={timeOutline} />
            <div className="detail-item-content">
              <strong>Distance</strong>
              <p>12.9 km (Approximately 5 hours)</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={bedOutline} />
            <div className="detail-item-content">
              <strong>Facilities</strong>
              <ul>
                <li>Three-sided timber shelter</li>
                <li>Sit-down pedestal pit toilet (BYO toilet paper)</li>
                <li>Rainwater tank</li>
                <li>Picnic tables</li>
                <li>Tent sites</li>
              </ul>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={informationCircleOutline} />
            <div className="detail-item-content">
              <strong>Important Notes</strong>
              <ul>
                <li>Tank water must be treated before drinking (boil, filter, or chemical treatment)</li>
                <li>Limited to no phone signal in this area</li>
                <li>Water supply not guaranteed</li>
              </ul>
            </div>
          </div>
        </div>
      </DropdownSection>
    </div>
  );

  // Main tab content renderer
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'details':
        return renderDetailsTab();
      case 'emergency':
        return renderEmergencyTab();
      case 'camp':
        return renderCampTab();
      default:
        return null;
    }
  };

  // Component render
  return (
    <IonPage>
      <IonHeader className="ion-no-border transparent-header">
        <div className="header-buttons">
          <IonBackButton defaultHref="/tab1" className="back-button" icon={arrowBack} />
        </div>
      </IonHeader>
      
      <IonContent className="location-content">
        {/* Hero Section */}
        <div className="hero-container">
          <IonImg 
            src={dwellingupImage}
            className="hero-image" 
            alt="Dwellingup landscape" 
          />
          <div className="hero-overlay">
            <h1 className="location-name">DWELLINGUP</h1>
            <p className="location-subtitle">Western Australia</p>
          </div>
        </div>
        
        {/* Main Content Card */}
        <IonCard className="content-card">
          <IonCardContent>
            {/* Navigation Tabs */}
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

export default Dwellingup;