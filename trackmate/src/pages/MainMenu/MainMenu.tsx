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
  IonText,
  IonChip,
  IonLabel,
  useIonViewDidEnter
} from "@ionic/react";
import { 
  playOutline,
  timeOutline,
  refreshOutline,
  locationOutline,
  leafOutline,
  trailSignOutline,
  peopleOutline,
  compassOutline,
  mapOutline,
  informationCircleOutline,
  homeOutline,
  alertCircleOutline,
  waterOutline,
  qrCode,
  heartOutline,
  informationCircle
} from 'ionicons/icons';
import { 
  StatusBar 
} from '@capacitor/status-bar';
import { Geolocation } from '@capacitor/geolocation';
import "./MainMenu.css";

// WeatherAPI configuration
const API_KEY = '5a77ab9c376246488da51721250903';
const DEFAULT_CITY = 'Perth';
const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1/current.json';

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  location: string;
}

const MainMenu: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  // Load cached weather data
  const loadCachedWeather = () => {
    const cachedData = localStorage.getItem('weatherData');
    const cachedTimestamp = localStorage.getItem('weatherTimestamp');
    
    if (cachedData && cachedTimestamp) {
      const parsedData = JSON.parse(cachedData);
      const timestamp = parseInt(cachedTimestamp);
      
      // Check if cache is less than 30 minutes old
      if (Date.now() - timestamp < 30 * 60 * 1000) {
        setWeather(parsedData);
        return true;
      }
    }
    return false;
  };

  // Save weather data to cache
  const cacheWeatherData = (data: WeatherData) => {
    localStorage.setItem('weatherData', JSON.stringify(data));
    localStorage.setItem('weatherTimestamp', Date.now().toString());
  };

  // Get user's geolocation and weather
  const getUserLocationAndWeather = async () => {
    setLoading(true);
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const url = `${WEATHER_API_BASE_URL}?key=${API_KEY}&q=${latitude},${longitude}&aqi=no`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data) {
        const weatherData = {
          temp: Math.round(data.current.temp_c),
          condition: data.current.condition.text,
          icon: data.current.condition.icon.replace('//cdn.weatherapi.com', 'https://cdn.weatherapi.com'),
          location: data.location.name
        };
        setWeather(weatherData);
        cacheWeatherData(weatherData);
      }
    } catch (err) {
      console.error('Error:', err);
      // Only fetch default city if we don't have cached data
      if (!loadCachedWeather()) {
        fetchWeather(DEFAULT_CITY);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city: string) => {
    try {
      const url = `${WEATHER_API_BASE_URL}?key=${API_KEY}&q=${city}&aqi=no`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data) {
        const weatherData = {
          temp: Math.round(data.current.temp_c),
          condition: data.current.condition.text,
          icon: data.current.condition.icon.replace('//cdn.weatherapi.com', 'https://cdn.weatherapi.com'),
          location: data.location.name
        };
        setWeather(weatherData);
        cacheWeatherData(weatherData);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      // Load cached data if available
      loadCachedWeather();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // First try to load cached data
    const hasCachedData = loadCachedWeather();
    
    // Then fetch fresh data in the background
    getUserLocationAndWeather();
  }, []);

  const featuredContent = [
    {
      title: "Scan & Explore",
      description: "Scan QR codes to learn about your surroundings",
      icon: qrCode,
      isNew: true,
      link: "/scan"
    },
    {
      title: "FAQ",
      description: "Find answers to common questions about TrackMate and the Bibbulmun Track",
      icon: informationCircle,
      isNew: false,
      link: "/faq"
    }
  ];

  const quickInfo = [
    {
      title: "Leave No Trace",
      time: "Guidelines",
      icon: leafOutline,
      description: "Pack out all rubbish, stay on marked trails, use fuel stoves only (no campfires), and camp only at designated sites. Help preserve the track for future walkers.",
      link: "https://www.bibbulmuntrack.org.au/trip-planner/leave-no-trace/"
    },
    {
      title: "Track Markers",
      time: "Navigation",
      icon: trailSignOutline,
      description: "Follow the yellow Waugal (rainbow serpent) trail markers. They're placed at regular intervals and at track junctions. If you haven't seen one for 500m, return to the last marker.",
      link: "https://www.bibbulmuntrack.org.au/the-track/along-the-track/"
    },
    {
      title: "Water Sources",
      time: "Essential",
      icon: waterOutline,
      description: "Water tanks at campsites are not guaranteed. Always carry at least 3L of water per person per day. Treat all water before drinking, even from tanks.",
      link: "https://www.bibbulmuntrack.org.au/trip-planner/health-hygiene-safety/"
    }
  ];

  return (
    <IonPage className="main-menu-page">
      <IonContent fullscreen>
        <div className="safe-area-container">
          <div className="content-container">
            <div className="welcome-section">
              <div className="welcome-text">
                <span className="welcome-message">Hello, TrackMate</span>
                <span className="welcome-emoji">👋</span>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="weather-widget">
              {loading && !weather ? (
                <IonSkeletonText animated style={{ width: '100%', height: '40px', '--border-radius': '8px' }} />
              ) : weather ? (
                <div className="weather-content">
                  <div className="weather-location">
                    <IonIcon icon={locationOutline} />
                    <span>{weather.location}</span>
                    <span>{weather.condition}</span>
                  </div>
                  <div className="weather-info">
                    <span className="temperature">{weather.temp}°C</span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Featured Content */}
            <div className="main-content">
              <div className="section-header">
                <h2>Featured</h2>
              </div>
              <div className="cards-grid">
                {featuredContent.map((item, index) => (
                  <IonCard 
                    key={index} 
                    className="feature-card"
                    routerLink={item.link}
                  >
                    {item.isNew && <div className="new-tag">Try it</div>}
                    <IonCardContent>
                      <div className="card-icon">
                        <IonIcon icon={item.icon} />
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            </div>

            {/* Quick Info Section */}
            <div className="practices-section">
              <div className="section-header">
                <h2>Quick Info</h2>
              </div>
              <div className="practices-list">
                {quickInfo.map((info, index) => (
                  <IonCard 
                    key={index} 
                    className="practice-card"
                    onClick={() => window.open(info.link, '_blank')}
                    style={{ cursor: 'pointer' }}
                  >
                    <IonCardContent>
                      <div className="practice-info">
                        <div className="info-icon">
                          <IonIcon icon={info.icon} />
                        </div>
                        <div className="info-content">
                          <h3>{info.title}</h3>
                          <p>{info.description}</p>
                          <div className="practice-meta">
                            <IonChip>
                              <IonLabel>{info.time}</IonLabel>
                            </IonChip>
                          </div>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div className="about-section">
              <div className="about-header">
                <IonIcon icon={leafOutline} className="about-icon" />
                <h2>About the Foundation</h2>
              </div>
              <div className="about-content">
                <p>
                  The Bibbulmun Track Foundation is a non-profit organization dedicated to supporting, maintaining, and preserving Western Australia's world-class walking trail. Since 1997, we've been the guardians of this 1000km track, connecting Kalamunda to Albany through some of the most beautiful landscapes in the South West.
                </p>
                <div className="about-stats">
                  <div className="stat-item">
                    <span className="stat-number">1000</span>
                    <span className="stat-label">km of track</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">9</span>
                    <span className="stat-label">sections</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">49</span>
                    <span className="stat-label">campsites</span>
                  </div>
                </div>
                <div className="about-cta">
                  <IonButton 
                    fill="clear" 
                    className="learn-more"
                    onClick={() => window.open('https://www.bibbulmuntrack.org.au/the-track/', '_blank')}
                  >
                    Learn More
                    <IonIcon slot="end" icon={playOutline} />
                  </IonButton>
                </div>
              </div>
            </div>

            {/* Meet the Developers */}
            <div className="meet-developers">
              <div className="dev-section">
                <IonText color="medium" className="dev-text">Made with 🧡 by</IonText>
                <div className="dev-cards">
                  <div className="dev-card">
                    <div className="dev-avatar">👩‍🎓</div>
                    <div className="dev-info">Marwa</div>
                  </div>
                  <div className="dev-card">
                    <div className="dev-avatar">👨‍🎓</div>
                    <div className="dev-info">Wael</div>
                  </div>
                  <div className="dev-card">
                    <div className="dev-avatar">👨‍🎓</div>
                    <div className="dev-info">Abdullah</div>
                  </div>
                  <div className="dev-card">
                    <div className="dev-avatar">👨‍🎓</div>
                    <div className="dev-info">Steve</div>
                  </div>
                  <div className="dev-card">
                    <div className="dev-avatar">👩‍🎓</div>
                    <div className="dev-info">Roudah</div>
                  </div>
                  <div className="dev-card">
                    <div className="dev-avatar">👨‍🎓</div>
                    <div className="dev-info">Jeremy</div>
                  </div>
                </div>
              </div>
              <div className="supervisor-section">
                <IonText color="medium" className="supervisor-text">Special thanks to our supervisors</IonText>
                <div className="supervisor-cards">
                  <div className="supervisor-card">
                    <div className="supervisor-avatar">👨‍🏫</div>
                    <div className="supervisor-info">Peter Cole</div>
                  </div>
                  <div className="supervisor-card">
                    <div className="supervisor-avatar">👩‍🏫</div>
                    <div className="supervisor-info">Noor Alkhateeb</div>
                  </div>
                </div>
              </div>
              <div className="project-info">
                <IonText color="medium" className="project-text">Murdoch University Dubai • ICT302 Final Project • 2025</IonText>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MainMenu;