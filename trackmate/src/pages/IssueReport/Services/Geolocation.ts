// Services/GeolocationService.ts
import { Geolocation as CapacitorGeolocation } from "@capacitor/geolocation";
import { Coordinates } from "../Models/IssueReport";

export class Geolocation {
  /**
   * Get current device location
   */
  static async getCurrentLocation(): Promise<Coordinates> {
    try {
      // Request permissions
      const permissionStatus = await CapacitorGeolocation.checkPermissions();

      if (permissionStatus.location !== "granted") {
        const request = await CapacitorGeolocation.requestPermissions();
        if (request.location !== "granted") {
          throw new Error("Location permission denied");
        }
      }

      // Get current position
      const position = await CapacitorGeolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
    } catch (error) {
      console.error("Error getting location:", error);
      throw error;
    }
  }
}