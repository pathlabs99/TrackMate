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

interface WeatherWidgetProps {
  temp?: number;
  condition?: string;
  windSpeed?: number;
  humidity?: number;
  uv?: number;
  loading?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  temp = 24,
  condition = "Partly Cloudy",
  windSpeed = 12,
  humidity = 65,
  uv = 6,
  loading = false
}) => {
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

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