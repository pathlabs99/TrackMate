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
   * @effect
   * @description Fetches and sets the current location on component mount
   * Uses Capacitor's Geolocation API and OpenStreetMap's reverse geocoding
   * Falls back to 'Perth' if location services are unavailable
   */
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        setIsLoadingLocation(true);
        const coordinates = await Geolocation.getCurrentPosition();
        const { latitude, longitude } = coordinates.coords;
        
        // Use reverse geocoding to get location details
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`
        );
        const data = await response.json();
        
        if (data.address) {
          // Try to get the most specific location name
          const location = data.address.suburb || 
                         data.address.neighbourhood || 
                         data.address.quarter || 
                         data.address.city_district ||
                         data.address.town || 
                         data.address.city || 
                         data.address.village || 
                         'Perth'; // Fallback to Perth if no specific location found
          
          setLocationName(location);
        }
      } catch (error) {
        console.error('Error getting location:', error);
        setLocationName('Perth'); // Fallback to Perth on error
      } finally {
        setIsLoadingLocation(false);
      }
    };

    getCurrentLocation();
  }, []);

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
        <span className="primary-location">{locationName || 'Perth'}</span>
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