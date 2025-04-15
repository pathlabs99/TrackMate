/**
 * @fileoverview Service exports index for the TrackMate issue reporting system.
 * @author Marwa
 * @filename Index.ts
 *
 * This file serves as a barrel file that exports all services from a single location,
 * making it easier to import multiple services in other files.
 */

// Export all services for easier imports
export { API } from './API';
export { Storage } from './Storage';
export { Geolocation } from './Geolocation';
export { Camera } from './Camera';
export { Network } from './Network';
export { BackgroundSync } from './BackgroundSync';
export { Report } from './Report';