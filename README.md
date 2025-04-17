# TrackMate

TrackMate is a student-built app created to support walkers on the Bibbulmun Track. Developed by pathlabs, a team of students from Murdoch University Dubai, as part of their IT Professional Practice Project.

The app is built with Ionic React and Capacitor, providing a cross-platform mobile experience.

## Features

- QR Code scanning functionality
- Camera integration
- Geolocation services
- Local notifications
- Background task support
- File system operations
- Network status monitoring
- Offline data storage

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm 
- Ionic CLI
- Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/pathlabs99/TrackMate.git
cd TrackMate
cd trackmate
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Build and sync with Capacitor:
```bash
ionic build
npx cap sync android
```

## Running on Android

1. Prerequisites:
   - Android Studio installed
   - USB debugging enabled on your device (for physical device testing)
   - Android Virtual Device set up (for emulator testing)

2. Open in Android Studio:
```bash
npx cap open android
```

3. Device Setup:
   - Connect your phone via USB with USB Debugging enabled
   - OR use an Android Virtual Device in Android Studio

4. Build and Run:
   - Wait for Gradle build to complete
   - Click the Run button (▶️) in Android Studio
   - The app will install and launch on your device

## Development

- Run the app in development mode:
```bash
ionic serve
```

- Build the app for production:
```bash
ionic build
```

- Add native platforms:
```bash
ionic cap add android
ionic cap add ios
```

- Open native IDEs:
```bash
ionic cap open android
ionic cap open ios
```

## Project Structure

```
src/
├── App.tsx         # Main application component and routing
├── assets/          # Static assets and onboarding images
├── components/      # Reusable UI components
│   ├── Menu/       # Navigation menu component
│   ├── SplashScreen/
│   └── WeatherWidget/
├── pages/          # Application pages/routes
│   ├── FAQ/
│   ├── IssueReport/    # Issue reporting functionality
│   │   ├── Components/
│   │   ├── Models/
│   │   └── Services/
│   ├── MainMenu/      # Main application dashboard
│   ├── Onboarding/    # User onboarding flow
│   ├── QR/           # QR code scanning and related views
│   └── Survey/       # Survey system
│       ├── components/
│       ├── hooks/
│       ├── models/
│       └── services/
├── theme/         # Global styling and theme configuration
├── types/         # TypeScript type definitions
└── utils/         # Shared utility functions
```

Key Directories:
- `/src/pages/IssueReport`: Contains the issue reporting system with offline support
- `/src/pages/QR`: QR code scanning and location-specific information
- `/src/pages/Survey`: Comprehensive survey system with offline capabilities
- `/src/components`: Shared components like WeatherWidget and SplashScreen
- `/src/utils`: Common utilities and helper functions

## Technologies Used

- Ionic Framework
- React
- Capacitor
- TypeScript
- Vite
- Various Capacitor plugins for native functionality

## Building for Production

1. Build the project:
```bash
ionic build
```

2. Sync with Capacitor:
```bash
ionic cap sync
```

3. Build using native IDEs (Android Studio)

## License

2025 Murdoch University. All rights reserved.

## Contributors

Developed by pathlabs Developer Team
