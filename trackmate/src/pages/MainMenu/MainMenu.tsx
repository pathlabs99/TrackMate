import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSkeletonText,
  IonAlert,
  IonIcon,
  IonButton,
  IonImg,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  useIonViewDidEnter
} from "@ionic/react";
import { 
  refreshOutline,
  leafOutline,
  trailSignOutline,
  peopleOutline,
  compassOutline,
  informationCircleOutline,
  codeSlashOutline,
  chevronDownOutline,
  chevronUpOutline,
  locationOutline,
  mapOutline,
  openOutline // Added for the external link icon
} from 'ionicons/icons';
import { StatusBar } from '@capacitor/status-bar';
import { Geolocation } from '@capacitor/geolocation';
import "./MainMenu.css";

// WeatherAPI configuration
const API_KEY = '5a77ab9c376246488da51721250903';
const DEFAULT_CITY = 'Perth'; // Fallback city
const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1/current.json';

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  location: string;
  humidity: number;
  windSpeed: number;
}

const MainMenu: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [aboutTrackMateExpanded, setAboutTrackMateExpanded] = useState(false);
  const [developersExpanded, setDevelopersExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  // Configure status bar when view enters
  useIonViewDidEnter(() => {
    try {
      // Make status bar use teal color and light text
      if (StatusBar) {
        StatusBar.setBackgroundColor({ color: '#6A9C89' });
        StatusBar.setStyle({ style: 'LIGHT' });
        StatusBar.setOverlaysWebView({ overlay: false });
      }
    } catch (err) {
      console.error('Error setting status bar properties:', err);
    }
    
    // Start welcome animation
    setTimeout(() => {
      setAnimationComplete(true);
    }, 2000);
  });

  // Get user's geolocation using Capacitor
  const getUserLocation = async () => {
    try {
      setLoading(true);
      
      // Request permissions first
      const permissionStatus = await Geolocation.requestPermissions();
      
      if (permissionStatus.location === 'granted') {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000
        });
        
        const { latitude, longitude } = position.coords;
        setUserLocation(`${latitude},${longitude}`);
        fetchWeather(`${latitude},${longitude}`);
      } else {
        // Silently fall back to Perth
        fetchWeather(DEFAULT_CITY);
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      // Silently fall back to Perth
      fetchWeather(DEFAULT_CITY);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (location: string) => {
    try {
      setLoading(true);

      const url = `${WEATHER_API_BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=no`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data) {
        setWeather({
          temp: Math.round(data.current.temp_c),
          condition: data.current.condition.text,
          icon: data.current.condition.icon.replace('//cdn.weatherapi.com', 'https://cdn.weatherapi.com'),
          location: `${data.location.name}, ${data.location.country}`,
          humidity: data.current.humidity,
          windSpeed: Math.round(data.current.wind_kph)
        });
      } else {
        // If the first attempt fails, try Perth
        if (location !== DEFAULT_CITY) {
          fetchWeather(DEFAULT_CITY);
        } else {
          setWeather(null);
        }
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      // If the first attempt fails, try Perth
      if (location !== DEFAULT_CITY) {
        fetchWeather(DEFAULT_CITY);
      } else {
        setWeather(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get user location when component mounts
    getUserLocation();

    // Refresh weather data every 5 minutes
    const interval = setInterval(() => {
      if (userLocation) {
        fetchWeather(userLocation);
      } else {
        getUserLocation();
      }
    }, 300000);

    return () => clearInterval(interval);
  }, [userLocation]);

  // Function to manually refresh weather and location
  const handleRefreshWeather = () => {
    getUserLocation();
  };

  const quickInfo = [
    {
      title: "Track Sections",
      icon: trailSignOutline,
      description: "9 unique sections spanning 1000km",
      isNew: false
    },
    {
      title: "Flora & Fauna",
      icon: leafOutline,
      description: "Diverse ecosystem information",
      isNew: false
    },
    {
      title: "Navigation",
      icon: compassOutline,
      description: "Track markers and waypoints",
      isNew: false
    },
    {
      title: "Community",
      icon: peopleOutline,
      description: "Join the hiking community",
      isNew: false
    }
  ];

  const toggleAbout = () => {
    setAboutExpanded(!aboutExpanded);
  };

  const toggleAboutTrackMate = () => {
    setAboutTrackMateExpanded(!aboutTrackMateExpanded);
  };

  const toggleDevelopers = () => {
    setDevelopersExpanded(!developersExpanded);
  };

  return (
    <IonPage className="main-menu-page gradient-background">
      <IonContent fullscreen>
        {/* Welcome Text */}
        <div className="welcome-animation">
          <div className="welcome-text">
            Hello, TrackMate
          </div>
        </div>

        {/* Weather Widget */}
        <div className="compact-weather-widget">
          <IonCard>
            {loading ? (
              <div className="weather-skeleton-compact">
                <IonSkeletonText animated style={{ width: '40%', height: '24px' }} />
                <IonSkeletonText animated style={{ width: '30%', height: '20px' }} />
              </div>
            ) : weather ? (
              <div className="weather-content-compact">
                <div className="weather-info-compact">
                  <div className="temperature-compact">{weather.temp}°C</div>
                  <div className="condition-compact">{weather.condition}</div>
                  <div className="location-compact">
                    <IonIcon icon={locationOutline} /> {weather.location}
                  </div>
                </div>
                <div className="weather-icon-compact">
                  <img src={weather.icon} alt={weather.condition} />
                </div>
              </div>
            ) : (
              <div className="weather-content-compact">
                <div className="weather-info-compact">
                  <div className="temperature-compact">--°C</div>
                  <div className="condition-compact">
                    Weather Unavailable
                    <IonButton 
                      fill="clear" 
                      size="small" 
                      onClick={handleRefreshWeather}
                      style={{ padding: '0 4px', margin: '0 0 0 8px' }}
                    >
                      <IonIcon 
                        icon={refreshOutline} 
                        style={{ 
                          fontSize: '16px', 
                          color: 'var(--main-menu-secondary-text)'
                        }} 
                      />
                    </IonButton>
                  </div>
                  <div className="location-compact">
                    <IonIcon icon={locationOutline} /> Updating...
                  </div>
                </div>
              </div>
            )}
          </IonCard>
        </div>

        {/* Track Information Cards */}
        <div className="track-info">
          {quickInfo.map((info, index) => (
            <IonCard className="info-card" key={index} button>
              <div className="info-content">
                <IonIcon icon={info.icon} className="info-icon" />
                <div>
                  <h4>
                    {info.title}
                    {info.isNew && <span className="new-tag">New</span>}
                  </h4>
                  <p>{info.description}</p>
                </div>
              </div>
            </IonCard>
          ))}
        </div>

        {/* About and Developers Section */}
        <IonText color="dark">
          <h2 className="section-title">More Information</h2>
        </IonText>
        
        <IonGrid>
          <IonRow>
            {/* About BTF Section */}
            <IonCol size="12" sizeMd="6">
              <div className="dropdown-section">
                <div 
                  className="dropdown-header" 
                  onClick={toggleAbout}
                >
                  <div className="dropdown-title">
                    <IonIcon icon={informationCircleOutline} className="dropdown-icon" />
                    <h3>About BTF</h3>
                  </div>
                  <IonIcon 
                    icon={aboutExpanded ? chevronUpOutline : chevronDownOutline} 
                    className="dropdown-chevron"
                  />
                </div>
                
                <div className={`dropdown-content ${aboutExpanded ? 'expanded' : ''}`}>
                  <IonCard className="about-card">
                    <IonCardContent>
                      <div className="about-content">
                        <div className="about-text">
                          <p>
                            The Bibbulmun Track Foundation is a non-profit community organization dedicated to 
                            the management, maintenance, and marketing of the 1000km Bibbulmun Track. 
                            Established in 1997, the Foundation works to ensure the Track remains one of the world's 
                            great long-distance walking trails.
                          </p>
                          <p>
                            Through volunteer efforts, community support, and partnerships with government 
                            agencies, the Foundation helps thousands of hikers experience the natural beauty 
                            of Western Australia's south-west each year.
                          </p>
                          <p>
                            For more information, visit:
                          </p>
                          <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <IonButton 
                              fill="clear" 
                              size="small" 
                              onClick={() => window.open('https://www.bibbulmuntrack.org.au', '_blank')}
                            >
                              <IonIcon icon={openOutline} style={{ fontSize: '24px', color: 'var(--main-menu-teal)' }} />
                            </IonButton>
                          </div>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </div>
              </div>
            </IonCol>
            
            {/* About TrackMate Section */}
            <IonCol size="12" sizeMd="6">
              <div className="dropdown-section">
                <div 
                  className="dropdown-header" 
                  onClick={toggleAboutTrackMate}
                >
                  <div className="dropdown-title">
                    <IonIcon icon={mapOutline} className="dropdown-icon" />
                    <h3>About TrackMate</h3>
                  </div>
                  <IonIcon 
                    icon={aboutTrackMateExpanded ? chevronUpOutline : chevronDownOutline} 
                    className="dropdown-chevron"
                  />
                </div>
                
                <div className={`dropdown-content ${aboutTrackMateExpanded ? 'expanded' : ''}`}>
                  <IonCard className="about-card">
                    <IonCardContent>
                      <div className="about-content">
                        <div className="about-text">
                          <p>
                            TrackMate is a comprehensive mobile companion app designed specifically for hikers 
                            exploring the Bibbulmun Track. Our app provides real-time weather updates, detailed 
                            track information, and navigation assistance to enhance your hiking experience.
                          </p>
                          <p>
                            Developed in collaboration with experienced hikers and the Bibbulmun Track Foundation, 
                            TrackMate aims to make the 1000km journey more accessible, safe, and enjoyable for 
                            outdoor enthusiasts of all levels.
                          </p>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </div>
              </div>
            </IonCol>
            
            {/* Meet the Developers Section */}
            <IonCol size="12" sizeMd="6">
              <div className="dropdown-section">
                <div 
                  className="dropdown-header" 
                  onClick={toggleDevelopers}
                >
                  <div className="dropdown-title">
                    <IonIcon icon={codeSlashOutline} className="dropdown-icon" />
                    <h3>Meet the Developers</h3>
                  </div>
                  <IonIcon 
                    icon={developersExpanded ? chevronUpOutline : chevronDownOutline} 
                    className="dropdown-chevron"
                  />
                </div>
                
                <div className={`dropdown-content ${developersExpanded ? 'expanded' : ''}`}>
                  <IonCard className="developers-card">
                    <IonCardContent>
                      <div className="developers-content">
                        <div className="developers-text">
                          <p>
                            TrackMate was created by a dedicated team of developers passionate about hiking 
                            and outdoor activities in Western Australia. Our mission is to make the Bibbulmun 
                            Track more accessible through technology.
                          </p>
                          <p>
                            Our team combines expertise in mobile development, UI/UX design, and outdoor 
                            navigation to create a seamless experience for hikers of all levels. We work 
                            closely with the Bibbulmun Track Foundation to ensure accuracy and usefulness.
                          </p>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </div>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Alert for errors */}
        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError(null)}
          header="Error"
          message={error || 'An error occurred'}
          buttons={['OK']}
        />

        {/* Alert for location errors */}
        <IonAlert
          isOpen={!!locationError}
          onDidDismiss={() => setLocationError(null)}
          header="Location Notice"
          message={locationError}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default MainMenu;