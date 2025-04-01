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
import collieImage from './images/collie.jpg';

interface Landmark {
  name: string;
  searchQuery: string;
}

const Collie: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('details');
  const [landmarksOpen, setLandmarksOpen] = useState(false);
  const [floraOpen, setFloraOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);

  const landmarks: Landmark[] = [
    {
      name: "Collie River",
      searchQuery: "Collie+River+Western+Australia"
    },
    {
      name: "Mungalup Dam",
      searchQuery: "Mungalup+Dam+Collie+WA"
    },
    {
      name: "Glen Mervyn Dam",
      searchQuery: "Glen+Mervyn+Dam+Collie+WA"
    },
    {
      name: "Mumballup Forest Tavern",
      searchQuery: "Mumballup+Tavern+Western+Australia"
    },
    {
      name: "Noggerup Conservation Park",
      searchQuery: "Noggerup+Conservation+Park+WA"
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
  }> = ({ title, icon, isOpen, onToggle, children }) => {
    const sectionRef = React.useRef<HTMLDivElement>(null);

    const handleToggle = () => {
      onToggle();
      if (!isOpen) {
        setTimeout(() => {
          sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };

    return (
      <div className="dropdown-section" ref={sectionRef}>
        <div className="dropdown-header" onClick={handleToggle}>
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
                  Collie is a vibrant town where walkers can take a break before heading south. The trail passes through scenic landscapes, including the Collie River, Mungalup Dam, and Wellington Forest. Walkers experience a mix of natural beauty and historical landmarks.
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
                  <p>Virgin Jarrah forest</p>
                </div>
                <div className="flora-item">
                  <IonIcon icon={pawOutline} />
                  <p>Native animals like Quokka, Quenda, Mardo, and Chuditch</p>
                </div>
                <div className="flora-item">
                  <IonIcon icon={leafOutline} />
                  <p>Evidence of the logging industry</p>
                </div>
                <div className="flora-item">
                  <IonIcon icon={pawOutline} />
                  <p>Fox control under the Western Shield Project</p>
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
              <p>Mungalup Road (South)</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={timeOutline} />
            <div className="detail-item-content">
              <strong>Distance</strong>
              <p>2.4 km south of Collie</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={informationCircleOutline} />
            <div className="detail-item-content">
              <strong>Description</strong>
              <p>Mungalup Road South provides a convenient entry to the track for emergency services and hikers. The Wellington Spur Trail, connecting to Wellington Dam recreation area, can be accessed here.</p>
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
              <p>Yabberup Campsite</p>
            </div>
          </div>
          <div className="detail-item">
            <IonIcon icon={timeOutline} />
            <div className="detail-item-content">
              <strong>Distance</strong>
              <p>19.3 km from Collie</p>
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
          <div className="detail-item">
            <IonIcon icon={locationOutline} />
            <div className="detail-item-content">
              <strong>GPS Coordinates</strong>
              <p>-33.463577317679274, 116.07753239488885</p>
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
            src={collieImage}
            className="hero-image" 
            alt="Collie landscape" 
          />
          <div className="hero-overlay">
            <h1 className="location-name">COLLIE</h1>
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

export default Collie;