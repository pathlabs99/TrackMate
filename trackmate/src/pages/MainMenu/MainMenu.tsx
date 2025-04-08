import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonIcon,
  IonLabel,
  IonMenu,
  IonList,
  IonItem,
  IonMenuToggle,
  IonRippleEffect,
  IonSkeletonText,
  IonText,
  IonChip,
  IonButtons,
  IonMenuButton,
  IonFooter,
  IonAccordion,
  IonAccordionGroup,
} from "@ionic/react";
import { 
  timeOutline,
  locationOutline,
  compassOutline,
  informationCircleOutline,
  settingsOutline,
  refreshOutline,
  leafOutline,
  trailSignOutline,
  peopleOutline,
  mapOutline,
  informationCircle,
  homeOutline,
  alertCircleOutline,
  waterOutline,
  qrCode,
  heartOutline,
  menu,
  chevronForward,
  chevronDown,
  sunny,
  partlySunny,
  cloud,
  rainy,
  thunderstorm,
  snow
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
  iconType?: string;
}

const MainMenu: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        const iconType = getWeatherIconType(data.current.condition.text.toLowerCase());
        const weatherData = {
          temp: Math.round(data.current.temp_c),
          condition: data.current.condition.text,
          icon: data.current.condition.icon.replace('//cdn.weatherapi.com', 'https://cdn.weatherapi.com'),
          location: data.location.name,
          iconType: iconType
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
        const iconType = getWeatherIconType(data.current.condition.text.toLowerCase());
        const weatherData = {
          temp: Math.round(data.current.temp_c),
          condition: data.current.condition.text,
          icon: data.current.condition.icon.replace('//cdn.weatherapi.com', 'https://cdn.weatherapi.com'),
          location: data.location.name,
          iconType: iconType
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

  const handleWeatherRefresh = async () => {
    setIsRefreshing(true);
    await getUserLocationAndWeather();
    setIsRefreshing(false);
  };

  useEffect(() => {
    // First try to load cached data
    const hasCachedData = loadCachedWeather();
    
    // Then fetch fresh data in the background
    getUserLocationAndWeather();
  }, []);

  const quickInfo = [
    {
      title: "Leave No Trace",
      time: "Guidelines",
      icon: leafOutline,
      description: "Pack out rubbish, stay on trails, use fuel stoves only, camp at designated sites.",
      link: "https://www.bibbulmuntrack.org.au/trip-planner/leave-no-trace/"
    },
    {
      title: "Track Markers",
      time: "Navigation",
      icon: trailSignOutline,
      description: "Follow yellow Waugal markers at intervals and track junctions.",
      link: "https://www.bibbulmuntrack.org.au/the-track/along-the-track/"
    },
    {
      title: "Water Sources",
      time: "Essential",
      icon: waterOutline,
      description: "Carry 3L per person daily. Treat all water before drinking.",
      link: "https://www.bibbulmuntrack.org.au/trip-planner/health-hygiene-safety/"
    }
  ];

  const developers = [
    {
      name: "Marwa Artan",
      emoji: "👩‍💻",
      role: "Communications Officer"
    },
    {
      name: "Wael Tartraf",
      emoji: "👨‍💻",
      role: "Security Coordinator"
    },
    {
      name: "Abdullah Mohamed",
      emoji: "👨‍💻",
      role: "Software Coordinator"
    }
  ];

  const operators = [
    {
      name: "Roudah Ashfaq",
      emoji: "🧠",
      role: "Project Activity Coordinator"
    },
    {
      name: "Jeremy Uduwalage",
      emoji: "📊",
      role: "Librarian"
    },
    {
      name: "Steve Ellison John",
      emoji: "🔍",
      role: "Secretary"
    }
  ];

  // Function to determine which Ionic icon to use based on weather condition
  const getWeatherIconType = (condition: string): string => {
    if (condition.includes('sunny') || condition.includes('clear')) {
      return 'sunny';
    } else if (condition.includes('partly cloudy') || condition.includes('partly sunny')) {
      return 'partlySunny';
    } else if (condition.includes('cloudy') || condition.includes('overcast')) {
      return 'cloud';
    } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('mist')) {
      return 'rainy';
    } else if (condition.includes('thunder') || condition.includes('storm')) {
      return 'thunderstorm';
    } else if (condition.includes('snow') || condition.includes('sleet') || condition.includes('ice')) {
      return 'snow';
    } else {
      return 'partlySunny'; // Default icon
    }
  };

  // Helper function to get the appropriate Ionic icon based on weather condition
  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sunny':
        return sunny;
      case 'partlySunny':
        return partlySunny;
      case 'cloud':
        return cloud;
      case 'rainy':
        return rainy;
      case 'thunderstorm':
        return thunderstorm;
      case 'snow':
        return snow;
      default:
        return partlySunny;
    }
  };

  // Helper function to get the appropriate color for each weather icon
  const getWeatherIconColor = (iconType: string): string => {
    switch (iconType) {
      case 'sunny':
        return '#FFA500'; // Bright orange for sun
      case 'partlySunny':
        return '#4B96F3'; // Blue with orange highlights for partly sunny
      case 'cloud':
        return '#7C9CBF'; // Light blue-gray for clouds
      case 'rainy':
        return '#5B8CDE'; // Blue for rain
      case 'thunderstorm':
        return '#4A6FA5'; // Dark blue for thunderstorms
      case 'snow':
        return '#A8D1E7'; // Light blue for snow
      default:
        return '#4B96F3'; // Default blue
    }
  };

  return (
    <>
      <IonMenu contentId="main-content" className="app-menu">
        <div className="menu-header">
          {/* Empty header for spacing */}
        </div>

        <IonContent className="menu-content">
          <div className="menu-intro">
            <p className="menu-subtitle">Your hiking companion</p>
          </div>
          
          <IonAccordionGroup mode="md" className="transparent-accordion">
            <IonAccordion value="about">
              <IonItem slot="header" className="menu-item" lines="none">
                <IonIcon slot="start" icon={informationCircleOutline} color="primary" />
                <IonLabel>About</IonLabel>
              </IonItem>
              
              <div slot="content" className="accordion-content">
                <div className="foundation-section">
                  <h3>About the Foundation</h3>
                  <p className="foundation-text">
                    The Bibbulmun Track Foundation maintains and preserves one of the world's great long-distance walking trails, 
                    stretching 1000km from Kalamunda to Albany through Western Australia.
                  </p>
                  
                  <div className="foundation-stats">
                    <div className="stat-item">
                      <span className="stat-icon">🗺️</span>
                      <div className="stat-number">1000</div>
                      <div className="stat-label">KM</div>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">🧩</span>
                      <div className="stat-number">9</div>
                      <div className="stat-label">Sections</div>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">⛺</span>
                      <div className="stat-number">49</div>
                      <div className="stat-label">Camps</div>
                    </div>
                  </div>
                </div>
              </div>
            </IonAccordion>
          </IonAccordionGroup>

          <div className="dev-team">
            <h3>Development Team</h3>
            <p>Meet the minds behind TrackMate</p>
            
            <div className="dev-list">
              {developers.map((dev, index) => (
                <div className="dev-item" key={index}>
                  <div className="dev-avatar">{dev.emoji}</div>
                  <div className="dev-name">{dev.name}</div>
                  <div className="dev-tooltip">{dev.role}</div>
                </div>
              ))}
            </div>

            <h3 className="operators-title">Project Operators</h3>
            <p>The team that makes it happen</p>
            
            <div className="dev-list">
              {operators.map((op, index) => (
                <div className="dev-item" key={index}>
                  <div className="dev-avatar">{op.emoji}</div>
                  <div className="dev-name">{op.name}</div>
                  <div className="dev-tooltip">{op.role}</div>
                </div>
              ))}
            </div>
          </div>
        </IonContent>

        <div className="menu-footer">
          <div className="university-name">Murdoch University Dubai</div>
          <p className="project-info">ICT302 Final Project • 2025</p>
        </div>
      </IonMenu>

      <IonPage id="main-content" className="main-menu-page">
        <IonHeader className="ion-no-border header-container">
          <IonToolbar className="main-toolbar">
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>TrackMate</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonContent fullscreen className="ion-padding-horizontal">
          <div className="safe-area-container">
            <div className="content-container">
              {/* Greeting Section */}
              <div className="greeting-section">
                <div className="greeting-content">
                  <h1 className="greeting-text">Hello, TrackMate!</h1>
                </div>
                <div className="greeting-icon">
                  <span role="img" aria-label="pin">📍</span>
                </div>
              </div>

              {/* Weather Widget */}
              <div className="weather-section">
                {loading && !weather ? (
                  <IonCard className="weather-card skeleton">
                    <IonCardContent>
                      <IonSkeletonText animated style={{ width: '60%', height: '28px' }} />
                      <IonSkeletonText animated style={{ width: '40%', height: '20px' }} />
                    </IonCardContent>
                  </IonCard>
                ) : (
                  <IonCard className="weather-card" onClick={handleWeatherRefresh}>
                    <IonCardContent>
                      <div className="weather-content">
                        <div className="weather-main">
                          <div className="weather-icon">
                            {weather?.iconType ? (
                              <IonIcon 
                                icon={getWeatherIcon(weather.iconType)} 
                                style={{ 
                                  fontSize: '48px', 
                                  width: '48px', 
                                  height: '48px',
                                  color: getWeatherIconColor(weather.iconType),
                                  filter: weather.iconType === 'partlySunny' ? 'drop-shadow(0 0 2px #FFA500)' : 
                                         weather.iconType === 'thunderstorm' ? 'drop-shadow(0 0 3px #FFD700)' : 'none'
                                }}
                              />
                            ) : (
                              <IonIcon 
                                icon={partlySunny} 
                                style={{ 
                                  fontSize: '48px', 
                                  width: '48px', 
                                  height: '48px',
                                  color: '#4B96F3',
                                  filter: 'drop-shadow(0 0 2px #FFA500)'
                                }}
                              />
                            )}
                          </div>
                          <div className="weather-temp">
                            <span className="temperature">{weather?.temp}°</span>
                            <span className="unit">C</span>
                          </div>
                        </div>
                        <div className="weather-details">
                          <div className="condition">{weather?.condition}</div>
                          <div className="location">
                            <IonIcon icon={locationOutline} />
                            {weather?.location}
                          </div>
                        </div>
                        <IonIcon 
                          icon={refreshOutline} 
                          className={`weather-refresh ${isRefreshing ? 'spinning' : ''}`} 
                        />
                      </div>
                      <IonRippleEffect />
                    </IonCardContent>
                  </IonCard>
                )}
              </div>

              {/* Track Info Section */}
              <div className="track-info-section">
                <div className="section-header">
                  <h2>Track Info</h2>
                </div>
                <div className="info-cards">
                  {quickInfo.map((info, index) => (
                    <IonCard key={index} className="info-card" button onClick={() => window.open(info.link, '_blank')}>
                      <IonCardContent className="horizontal-card-content">
                        <div className="card-icon">
                          <IonIcon icon={info.icon} />
                        </div>
                        <div className="card-main-content">
                          <div className="card-header">
                            <span className="card-title">{info.title}</span>
                            <IonChip className="card-tag">
                              <IonLabel>{info.time}</IonLabel>
                            </IonChip>
                          </div>
                          <span className="card-description">{info.description}</span>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </IonContent>
      </IonPage>
    </>
  );
};

export default MainMenu;