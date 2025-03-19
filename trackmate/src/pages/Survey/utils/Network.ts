/**
 * Check if device is online
 */
export const isOnline = async (): Promise<boolean> => {
  try {
    return navigator.onLine;
  } catch (error) {
    console.error('Error checking online status:', error);
    return false;
  }
};

/**
 * Add network status change listener
 */
export const addNetworkListener = (callback: (isConnected: boolean) => void): void => {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
};

/**
 * Remove network status change listener
 */
export const removeNetworkListener = (callback: (isConnected: boolean) => void): void => {
  window.removeEventListener('online', () => callback(true));
  window.removeEventListener('offline', () => callback(false));
};