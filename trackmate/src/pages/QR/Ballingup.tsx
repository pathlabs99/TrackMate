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
  waterOutline,
  bedOutline,
} from 'ionicons/icons';
import './LocationPages.css';
// Import local image
import ballingupImage from './images/ballingup.jpg';

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

const Ballingup: React.FC = () => {
  // State management for tabs and dropdowns
  const [selectedTab, setSelectedTab] = useState('details');
  const [landmarksOpen, setLandmarksOpen] = useState(false);
  const [floraOpen, setFloraOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);

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
            Ballingup marks a significant transitional section on the Bibbulmun Track, where the lush jarrah, marri, and yarri forests give way to the majestic karri forest – the second tallest flowering tree in the world.
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
          <div className="landmark-item">
            <IonIcon icon={locationOutline} />
            <span>Golden Valley Tree Park</span>
          </div>
          <div className="landmark-item">
            <IonIcon icon={locationOutline} />
            <span>Donnelly River Village</span>
          </div>
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
            <p>Jarrah and Marri forests dominate the landscape</p>
          </div>
          <div className="flora-item">
            <IonIcon icon={pawOutline} />
            <p>Native wildlife including kangaroos and various bird species</p>
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
              <p>Old Padbury Road</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={timeOutline} />
            <div className="detail-item-content">
              <strong>Distance</strong>
              <p>2 km from track</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={informationCircleOutline} />
            <div className="detail-item-content">
              <strong>Description</strong>
              <p>Accessible via main road with clear signage for emergency vehicles.</p>
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
              <p>Blackwood Campsite</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={timeOutline} />
            <div className="detail-item-content">
              <strong>Distance</strong>
              <p>13.5 km</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={bedOutline} />
            <div className="detail-item-content">
              <strong>Facilities</strong>
              <ul>
                <li>Sleeping shelter</li>
                <li>Rainwater tank</li>
                <li>Toilet</li>
                <li>Picnic tables</li>
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
        {/* Hero Image with Location Name */}
        <div className="hero-container">
          <IonImg 
            src={ballingupImage}
            className="hero-image" 
            alt="Ballingup landscape" 
          />
          <div className="hero-overlay">
            <h1 className="location-name">BALLINGUP</h1>
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

export default Ballingup;