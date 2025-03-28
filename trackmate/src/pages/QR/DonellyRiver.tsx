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
import donellyriverImage from './images/donellyriver.jpg';

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

const DonellyRiver: React.FC = () => {
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
            The Donnelly River winds through a lush valley, offering scenic beauty and a peaceful environment. The track features some of the most challenging hills, swimming holes, granite boulders, and towering karri forests.
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
            <span>Twin Bridges</span>
          </div>
          <div className="landmark-item">
            <IonIcon icon={locationOutline} />
            <span>One Tree Bridge</span>
          </div>
          <div className="landmark-item">
            <IonIcon icon={waterOutline} />
            <span>Beedelup Falls</span>
          </div>
          <div className="landmark-item">
            <IonIcon icon={waterOutline} />
            <span>Big Brook Dam</span>
          </div>
          <div className="landmark-item">
            <IonIcon icon={locationOutline} />
            <span>Big Brook Arboretum</span>
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
            <p>Old-growth karri forests</p>
          </div>
          <div className="flora-item">
            <IonIcon icon={leafOutline} />
            <p>Jarrah and marri trees</p>
          </div>
          <div className="flora-item">
            <IonIcon icon={flowerOutline} />
            <p>Golden waterbush and white crowea</p>
          </div>
          <div className="flora-item">
            <IonIcon icon={pawOutline} />
            <p>Kangaroos, possums, and native birds</p>
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
              <p>One Tree Bridge on Graphite Road</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={timeOutline} />
            <div className="detail-item-content">
              <strong>Distance</strong>
              <p>11.05 km from Tom Road Campsite</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={informationCircleOutline} />
            <div className="detail-item-content">
              <strong>Description</strong>
              <p>Popular tourist spot with vehicle access for emergency evacuation</p>
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
              <p>Tom Road Campsite</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={timeOutline} />
            <div className="detail-item-content">
              <strong>Distance</strong>
              <p>5 km north along the Bibbulmun Track</p>
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
                <li>Swimming pool in Donnelly River</li>
              </ul>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={locationOutline} />
            <div className="detail-item-content">
              <strong>GPS Coordinates</strong>
              <p>-34.1643, 115.9129</p>
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
            src={donellyriverImage}
            className="hero-image" 
            alt="Donnelly River landscape" 
          />
          <div className="hero-overlay">
            <h1 className="location-name">DONNELLY RIVER</h1>
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

export default DonellyRiver;