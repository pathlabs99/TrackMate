import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonAlert,
  useIonViewDidEnter,
  useIonViewWillLeave,
  useIonViewDidLeave,
  useIonRouter,
} from '@ionic/react';
import { scanOutline, flashlightOutline } from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import './QR.css';

// List of valid QR codes
const VALID_QR_CODES = [
  "DarlingRange",
  "Dwellingup",
  "Collie",
  "Balingup",
  "DonnellyRiver",
  "Pemberton",
  "Northcliffe",
  "Walpole",
  "Denmark",
];

const QR: React.FC = () => {
  const router = useIonRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [showPermissionError, setShowPermissionError] = useState(false);
  const [showInvalidQRError, setShowInvalidQRError] = useState(false);

  // Cleanup function
  const cleanupScanner = async () => {
    try {
      setIsScanning(false);
      const frame = document.querySelector(".scanner-frame");
      if (frame) {
        frame.remove();
      }
      document.body.classList.remove("scanner-active");
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
      setFlashlightOn(false);
      await BarcodeScanner.disableTorch();
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  };

  // Handle back button
  useEffect(() => {
    const handleBackButton = (ev: any) => {
      ev.detail.register(10, async () => {
        await cleanupScanner();
        router.push("/menu", "back");
      });
    };
    document.addEventListener("ionBackButton", handleBackButton);
    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
      cleanupScanner();
    };
  }, [router]);

  // View lifecycle hooks
  useIonViewDidEnter(() => {
    if (isScanning) {
      startScan();
    }
  });

  useIonViewWillLeave(() => {
    cleanupScanner();
  });

  useIonViewDidLeave(() => {
    cleanupScanner();
  });

  const handleQRNavigation = async (qrContent: string) => {
    const qrCode = qrContent.toLowerCase().trim();
    const validCode = VALID_QR_CODES.find(code => code.toLowerCase() === qrCode);

    if (validCode) {
      await cleanupScanner();
      // Use the exact case from VALID_QR_CODES for the route
      router.push(`/${validCode}`, "forward");
    } else {
      await cleanupScanner();
      setShowInvalidQRError(true);
    }
  };

  const startScan = async () => {
    if (isScanning) return;

    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      
      if (!status.granted) {
        setShowPermissionError(true);
        return;
      }

      setIsScanning(true);

      // Create scanner frame
      const frame = document.createElement("div");
      frame.className = "scanner-frame";

      ["top-left", "top-right", "bottom-left", "bottom-right"].forEach((position) => {
        const corner = document.createElement("div");
        corner.className = `corner corner-${position}`;
        frame.appendChild(corner);
      });

      document.body.appendChild(frame);

      // Initialize scanner
      await BarcodeScanner.prepare();
      document.body.classList.add("scanner-active");
      await BarcodeScanner.hideBackground();

      // Start scanning
      const result = await BarcodeScanner.startScan({
        targetedFormats: ["QR_CODE"],
      });

      if (result.hasContent) {
        await handleQRNavigation(result.content);
      } else {
        await cleanupScanner();
      }
    } catch (error) {
      console.error('Scanner error:', error);
      await cleanupScanner();
    }
  };

  const toggleFlashlight = async () => {
    try {
      if (flashlightOn) {
        await BarcodeScanner.disableTorch();
      } else {
        await BarcodeScanner.enableTorch();
      }
      setFlashlightOn(!flashlightOn);
    } catch (error) {
      console.error('Flashlight error:', error);
    }
  };

  const handleRetry = async () => {
    setShowInvalidQRError(false);
    await startScan();
  };

  const handleCancel = async () => {
    await cleanupScanner();
    router.push("/menu", "back");
  };

  const openDeviceSettings = () => {
    if ((window as any).cordova?.plugins?.diagnostic) {
      (window as any).cordova.plugins.diagnostic.switchToSettings();
    }
  };

  return (
    <IonPage className="qr-intro">
      <IonContent className={`intro-content ${isScanning ? 'scanning-active' : ''}`} fullscreen>
        {!isScanning ? (
          <div className="content-container">
            <div className="intro-logo">
              <IonIcon icon={scanOutline} />
            </div>
            <p className="intro-text">
              Scan QR codes along the trail to access detailed information about your location, nearby routes, and directions to main roads.
            </p>
            <div className="bottom-container">
              <IonButton 
                className="start-button"
                onClick={startScan}
              >
                Get Started
              </IonButton>
            </div>
          </div>
        ) : (
          <div className="scanner-controls">
            <IonButton
              className="flashlight-button"
              fill="clear"
              onClick={toggleFlashlight}
            >
              <IonIcon icon={flashlightOutline} />
            </IonButton>
            <IonButton
              className="stop-scan-button"
              onClick={handleCancel}
            >
              Cancel
            </IonButton>
          </div>
        )}

        <IonAlert
          isOpen={showPermissionError}
          onDidDismiss={handleCancel}
          header={"Camera Permission Required"}
          message={"Please enable camera access in your device settings to use the QR scanner."}
          buttons={[
            { text: "Cancel", role: "cancel", handler: handleCancel },
            { text: "Open Settings", handler: openDeviceSettings }
          ]}
        />

        <IonAlert
          isOpen={showInvalidQRError}
          onDidDismiss={handleCancel}
          header={"Invalid QR Code"}
          message={"The scanned QR code is not valid for this application. Please scan a valid QR code."}
          buttons={[
            { text: "Cancel", handler: handleCancel },
            { text: "Try Again", handler: handleRetry }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default QR;