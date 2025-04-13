/**
 * @fileoverview Geolocation service for the TrackMate issue reporting system.
 * @author Abdullah
 * @date 2025-04-13
 * @filename Geolocation.ts
 *
 * This file contains the Geolocation service which provides functionality
 * for accessing device location data for issue reports.
 */

import { Geolocation as CapacitorGeolocation } from "@capacitor/geolocation";
import { Coordinates } from "../Models/IssueReport";

/**
 * Extended coordinates interface with accuracy
 */
interface ExtendedCoordinates extends Coordinates {
  accuracy?: number;
}

/**
 * Geolocation service class that provides methods for
 * accessing device location data
 */
export class Geolocation {
  /**
   * Get current device location with permission handling
   * 
   * @returns Promise resolving to coordinates object with latitude, longitude and accuracy
   * @throws Error if location permissions are denied or location cannot be retrieved
   */
  static async getCurrentLocation(): Promise<ExtendedCoordinates> {
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
      // Silent error handling
      throw error;
    }
  }
}