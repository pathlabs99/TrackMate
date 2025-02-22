import React, { useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAlert,
  useIonRouter,
  useIonViewDidEnter,
  useIonViewWillLeave,
  useIonViewDidLeave,
} from '@ionic/react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useState } from 'react';
import './Tab1.css';

const Tab1: React.FC = () => {
  const router = useIonRouter();
  const [showPermissionError, setShowPermissionError] = useState<boolean>(false);
  const [showInvalidQRError, setShowInvalidQRError] = useState<boolean>(false);

  // Handle hardware back button
  useEffect(() => {
    const handleBackButton = (ev: any) => {
      ev.detail.register(10, () => {
        cleanupScanner();
        router.push('/menu', 'back');
      });
    };

    document.addEventListener('ionBackButton', handleBackButton);

    return () => {
      document.removeEventListener('ionBackButton', handleBackButton);
    };
  }, [router]);

  // Start scanning when view enters
  useIonViewDidEnter(() => {
    startScan();
  });

  // Cleanup when view will leave
  useIonViewWillLeave(() => {
    cleanupScanner();
  });

  // Additional cleanup when view has left
  useIonViewDidLeave(() => {
    cleanupScanner();
  });

  const cleanupScanner = async () => {
    try {
      document.querySelector('body')?.classList.remove('scanner-active');
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  };

  const handleQRNavigation = async (qrContent: string) => {
    const validQRCodes = ['qr1', 'qr2', 'qr3', 'qr4', 'qr5', 'qr6', 'qr7', 'qr8', 'qr9'];
    const qrCode = qrContent.toLowerCase().trim();
    
    if (validQRCodes.includes(qrCode)) {
      await cleanupScanner();
      // Use replace to prevent navigation stack issues
      router.push(`/${qrCode}`, 'root', 'replace');
    } else {
      await cleanupScanner();
      setShowInvalidQRError(true);
    }
  };

  const startScan = async () => {
    try {
      // Ensure cleanup before starting
      await cleanupScanner();

      // Check camera permission
      const status = await BarcodeScanner.checkPermission({ force: true });
      
      if (!status.granted) {
        setShowPermissionError(true);
        return;
      }

      // Prepare scanner
      await BarcodeScanner.prepare();

      // Make background of WebView transparent
      await BarcodeScanner.hideBackground();
      document.querySelector('body')?.classList.add('scanner-active');

      // Start scanning with optimized settings
      const result = await BarcodeScanner.startScan({
        targetedFormats: ['QR_CODE'],
        scanMode: 'SINGLE',
        returnBarcodeText: true,
        detectorSize: 1.0,
        detectorAspectRatio: 1.0,
      });
      
      if (result.hasContent) {
        await handleQRNavigation(result.content);
      } else {
        // If no content, cleanup and return to menu
        await cleanupScanner();
        router.push('/menu', 'back');
      }
    } catch (error) {
      console.error('Scanning error:', error);
      await cleanupScanner();
      router.push('/menu', 'back');
    }
  };

  const openDeviceSettings = () => {
    if ((window as any).cordova?.plugins?.diagnostic) {
      (window as any).cordova.plugins.diagnostic.switchToSettings();
    }
  };

  const handleRetry = async () => {
    setShowInvalidQRError(false);
    await startScan();
  };

  const handleCancel = async () => {
    await cleanupScanner();
    router.push('/menu', 'back');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>QR Scanner</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonAlert
          isOpen={showPermissionError}
          onDidDismiss={handleCancel}
          header={'Camera Permission Required'}
          message={'Please enable camera access in your device settings to use the QR scanner.'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: handleCancel
            },
            {
              text: 'Open Settings',
              handler: openDeviceSettings
            }
          ]}
        />

        <IonAlert
          isOpen={showInvalidQRError}
          onDidDismiss={handleCancel}
          header={'Invalid QR Code'}
          message={'The scanned QR code is not valid for this application. Please scan a valid QR code.'}
          buttons={[
            {
              text: 'Cancel',
              handler: handleCancel
            },
            {
              text: 'Try Again',
              handler: handleRetry
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab1; 