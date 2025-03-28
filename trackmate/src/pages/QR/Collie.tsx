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
} from 'ionicons/icons';
import './LocationPages.css';
import collieImage from './images/collie.jpg';

const Collie: React.FC = () => {
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
  }> = ({ title, icon, isOpen, onToggle, children }) => {
    const sectionRef = React.useRef<HTMLDivElement>(null);

    const handleToggle = () => {
      onToggle();
      // Add small delay to allow animation to start
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
                <div className="landmark-item">
                  <IonIcon icon={locationOutline} />
                  <span>Collie River</span>
                </div>
                <div className="landmark-item">
                  <IonIcon icon={locationOutline} />
                  <span>Mungalup Dam</span>
                </div>
                <div className="landmark-item">
                  <IonIcon icon={locationOutline} />
                  <span>Glen Mervyn Dam</span>
                </div>
                <div className="landmark-item">
                  <IonIcon icon={locationOutline} />
                  <span>Mumballup Forest Tavern</span>
                </div>
                <div className="landmark-item">
                  <IonIcon icon={locationOutline} />
                  <span>Noggerup Conservation Park</span>
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
                    <p>Donnybrook-Boyup Brook Road (Mumballup)</p>
                  </div>
                </div>
                <div className="detail-item">
                  <IonIcon icon={timeOutline} />
                  <div className="detail-item-content">
                    <strong>Distance</strong>
                    <p>Approx. 19km south of Collie</p>
                  </div>
                </div>
                <div className="detail-item">
                  <IonIcon icon={informationCircleOutline} />
                  <div className="detail-item-content">
                    <strong>Description</strong>
                    <p>Accessible from Mumballup, this road connects to the Mumballup Forest Tavern. It is a small settlement road with limited facilities.</p>
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
                    <p>Yabberup Campsite</p>
                  </div>
                </div>
                <div className="detail-item">
                  <IonIcon icon={timeOutline} />
                  <div className="detail-item-content">
                    <strong>Distance</strong>
                    <p>Approx. 19.3km from Collie</p>
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