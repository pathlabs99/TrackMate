import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trackmate.test',
  appName: 'TrackMate',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'light',
      backgroundColor: '#ffffff',
      overlaysWebView: false
    }
  }
};

export default config;