/**
 * @fileoverview Main menu component for the TrackMate mobile app.
 * @author TrackMate Team
 * @date 2025-04-13
 * @filename MainMenu.tsx
 *
 * This file contains the main menu component which serves as the landing page
 * for the TrackMate app. It displays weather information, track essentials,
 * and provides navigation to other app features.
 */

import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButtons,
  IonButton
} from "@ionic/react";
import { 
  leafOutline,
  trailSignOutline,
  waterOutline,
  sunny,
  partlySunny,
  cloud,
  rainy,
  thunderstorm,
  snow
} from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import WeatherWidget from "../../components/WeatherWidget/WeatherWidget";
import "./MainMenu.css";

// WeatherAPI configuration
const API_KEY = '5a77ab9c376246488da51721250903';
const DEFAULT_CITY = 'Perth';
const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1/current.json';

/**
 * Interface for weather data structure
 * @interface WeatherData
 */
interface WeatherData {
  /** Current temperature in Celsius */
  temp: number;
  /** Weather condition text description */
  condition: string;
  /** URL to weather condition icon */
  icon: string;
  /** Location name */
  location: string;
  /** Icon type for Ionic icons */
  iconType?: string;
  /** Wind speed in km/h */
  wind_kph?: number;
  /** Humidity percentage */
  humidity?: number;
  /** UV index */
  uv?: number;
}

/**
 * Main menu component for the TrackMate application
 * Displays weather information, track essentials, and navigation options
 * 
 * @returns {JSX.Element} Rendered component
 */
const MainMenu: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Loads cached weather data from localStorage
   * 
   * @returns {boolean} True if valid cached data was loaded, false otherwise
   */
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

  /**
   * Saves weather data to localStorage cache
   * 
   * @param {WeatherData} data - Weather data to cache
   */
  const cacheWeatherData = (data: WeatherData) => {
    localStorage.setItem('weatherData', JSON.stringify(data));
    localStorage.setItem('weatherTimestamp', Date.now().toString());
  };

  /**
   * Gets user's geolocation and fetches weather for that location
   * Falls back to cached data or default city if geolocation fails
   * 
   * @async
   */
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
          iconType: iconType,
          wind_kph: data.current.wind_kph,
          humidity: data.current.humidity,
          uv: data.current.uv
        };
        setWeather(weatherData);
        cacheWeatherData(weatherData);
      }
    } catch (err) {
      // Fall back to cached data or default city if geolocation fails
      if (!loadCachedWeather()) {
        fetchWeather(DEFAULT_CITY);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches weather data for a specific city
   * 
   * @async
   * @param {string} city - City name to fetch weather for
   */
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
          iconType: iconType,
          wind_kph: data.current.wind_kph,
          humidity: data.current.humidity,
          uv: data.current.uv
        };
        setWeather(weatherData);
        cacheWeatherData(weatherData);
      }
    } catch (err) {
      // Load cached data if available on error
      loadCachedWeather();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles manual weather refresh button click
   * 
   * @async
   */
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
      icon: waterOutline,
      title: 'Water Sources',
      description: 'Water tanks are available at each campsite but must be treated before drinking.​',
      link: 'https://www.bibbulmuntrack.org.au/trip-planner/track-sections/'
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

  const handleQuickInfoClick = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <IonPage id="main-content" className="main-menu-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton className="menu-button" onClick={() => document.querySelector('ion-menu')?.toggle()}>
              <div className="staggered-menu-icon">
                <span></span>
                <span></span>
              </div>
            </IonButton>
          </IonButtons>
          <IonTitle className="ion-text-center">Bibbulmun Track Overview</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding-horizontal">
        <div className="safe-area-container">
          <div className="content-container">
            {/* Weather Section */}
            <div className="weather-section">
              <div className="section-header">
                <h2>Today's Conditions</h2>
              </div>
              <WeatherWidget 
                temp={weather?.temp}
                condition={weather?.condition}
                windSpeed={weather?.wind_kph}
                humidity={weather?.humidity}
                uv={weather?.uv}
                loading={loading}
              />
            </div>

            {/* Track Essentials Section */}
            <div className="track-info-section">
              <div className="section-header">
                <h2>Track Essentials</h2>
                <p className="section-subtext">Tap a card to explore official Bibbulmun Track information</p>
              </div>
              <div className="info-cards">
                {quickInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className="info-card"
                    onClick={() => handleQuickInfoClick(info.link)}
                  >
                    <IonIcon icon={info.icon} className="info-icon" />
                    <div className="info-content">
                      <h3>{info.title}</h3>
                      <p>{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default MainMenu;