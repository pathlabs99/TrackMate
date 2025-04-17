/**
 * @fileoverview Weather widget component for the TrackMate mobile app.
 * @author Marwa
 * @module components/WeatherWidget
 * @description A responsive weather widget that displays current weather conditions
 * and location information using geolocation services.
 * 
 * @note Developer Handover
 * The following can be customized:
 * 1. Location Services
 *    - Uses OpenStreetMap for reverse geocoding
 *    - Falls back to 'Perth' if location services fail
 * 2. Weather Metrics
 *    - Default values are provided for offline/testing use
 *    - Integration with a weather API can be added
 */

import React, { useEffect, useState } from 'react';
import { IonIcon } from '@ionic/react';
import { 
  locationOutline, 
  cloudyOutline,
  waterOutline, 
  sunnyOutline,
  rainyOutline,
  thunderstormOutline
} from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import './WeatherWidget.css';

/**
 * @interface WeatherWidgetProps
 * @description Props for configuring the weather widget display
 */
interface WeatherWidgetProps {
  /** Current temperature in Celsius */
  temp?: number;
  /** Weather condition description (e.g., "Partly Cloudy") */
  condition?: string;
  /** Wind speed in kilometers per hour */
  windSpeed?: number;
  /** Humidity percentage */
  humidity?: number;
  /** UV index value */
  uv?: number;
  /** Loading state flag */
  loading?: boolean;
}

/**
 * @component WeatherWidget
 * @description Displays current weather information and location
 * Features include:
 * - Real-time location detection
 * - Temperature display
 * - Weather condition
 * - Wind speed, humidity, and UV index
 * - Loading state handling
 * 
 * @param {WeatherWidgetProps} props - Component props
 * @param {number} [props.temp=24] - Temperature in Celsius
 * @param {string} [props.condition="Partly Cloudy"] - Weather condition
 * @param {number} [props.windSpeed=12] - Wind speed in km/h
 * @param {number} [props.humidity=65] - Humidity percentage
 * @param {number} [props.uv=6] - UV index
 * @param {boolean} [props.loading=false] - Loading state
 * @returns {JSX.Element} Weather widget component
 */
const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  temp = 24,
  condition = "Partly Cloudy",
  windSpeed = 12,
  humidity = 65,
  uv = 6,
  loading = false
}) => {
  /**
   * @state locationName
   * @description Current location name from reverse geocoding
   * @type {string | null}
   */
  const [locationName, setLocationName] = useState<string | null>(null);

  /**
   * @state isLoadingLocation
   * @description Loading state for location detection
   * @type {boolean}
   */
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  /**
   * @state permissionState
   * @description Current state of location permission
   * @type {string}
   */
  const [permissionState, setPermissionState] = useState<string>('prompt');

  /**
   * Function to get current location using Capacitor's Geolocation API
   */
  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      
      // Check permission first
      const permissionStatus = await Geolocation.checkPermissions();
      setPermissionState(permissionStatus.location);
      
      if (permissionStatus.location !== 'granted') {
        // Request permission if not granted
        const requestResult = await Geolocation.requestPermissions();
        setPermissionState(requestResult.location);
        
        // If permission was denied, use default location
        if (requestResult.location !== 'granted') {
          setLocationName('Perth'); // Fallback to Perth
          setIsLoadingLocation(false);
          return;
        }
      }
      
      // Get coordinates with high accuracy and timeout options
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
      
      const { latitude, longitude } = coordinates.coords;
      
      // Use reverse geocoding to get location details
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'TrackMate App (https://github.com/trackmate/app)'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.address) {
        // Try to get the most specific location name
        const location = data.address.suburb || 
                       data.address.neighbourhood || 
                       data.address.quarter || 
                       data.address.city_district ||
                       data.address.town || 
                       data.address.city || 
                       data.address.village;
        
        if (location) {
          setLocationName(location);
        } else {
          setLocationName('Perth');
        }
      } else {
        setLocationName('Perth');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationName('Perth'); // Fallback to Perth on error
    } finally {
      setIsLoadingLocation(false);
    }
  };

  /**
   * @effect
   * @description Fetches and sets the current location on component mount
   */
  useEffect(() => {
    getCurrentLocation();
  }, []);

  /**
   * Retry getting location when user clicks on location name
   */
  const handleLocationClick = () => {
    if (permissionState !== 'granted') {
      getCurrentLocation();
    }
  };

  if (loading || isLoadingLocation) {
    return (
      <div className="weather-widget loading">
        <div className="loading-placeholder" />
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="location">
        <IonIcon icon={locationOutline} className="location-icon" />
        <span className="primary-location" onClick={handleLocationClick}>{locationName || 'Perth'}</span>
      </div>

      <div className="main-weather">
        <div className="temperature">{temp}°C</div>
        <div className="weather-icon">
          <IonIcon icon={cloudyOutline} />
        </div>
      </div>

      <div className="condition">{condition}</div>

      <div className="weather-metrics">
        <div className="metric">
          <IonIcon icon={rainyOutline} className="wind-icon" />
          <span>{windSpeed} km/h</span>
        </div>
        <div className="metric">
          <IonIcon icon={waterOutline} className="humidity-icon" />
          <span>{humidity}%</span>
        </div>
        <div className="metric">
          <IonIcon icon={sunnyOutline} className="uv-icon" />
          <span>UV {uv}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;