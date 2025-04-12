import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trackmate.test',
  appName: 'TrackMate',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 0, // Prevent native splash screen delay
      autoHide: true // Ensures splash is hidden automatically
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#ffffff',
      overlaysWebView: false
    }
  },
  server: {
    androidScheme: 'https' // Recommended for Android WebView compatibility
  }
};

export default config;