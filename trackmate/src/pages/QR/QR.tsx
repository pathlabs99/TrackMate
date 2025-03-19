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
} from "@ionic/react";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { useState, useEffect } from "react";
import "./QR.css";

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

const QRScanner: React.FC = () => {
  
  const router = useIonRouter();
  const [showPermissionError, setShowPermissionError] = useState<boolean>(false);
  const [showInvalidQRError, setShowInvalidQRError] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const handleBackButton = (ev: any) => {
      ev.detail.register(10, async () => {
        await cleanupScanner();
        router.push("/menu", "back");
      });
    };
    document.addEventListener("ionBackButton", handleBackButton);
    return () => document.removeEventListener("ionBackButton", handleBackButton);
  }, [router]);

  useIonViewDidEnter(() => {
    if (!isScanning) {
      startScan();
    }
  });

  useIonViewWillLeave(() => {
    cleanupScanner();
  });

  useIonViewDidLeave(() => {
    cleanupScanner();
  });

  // Scanner cleanup function
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
    } catch (error) {
      
    }
  };

  // QR code validation and navigation
  const handleQRNavigation = async (qrContent: string) => {
    const qrCode = qrContent.toLowerCase().trim();
    const normalizedQrCode = qrCode
      .replace("balingup", "balingup") // Ensure consistent casing
      .replace("donnellyriver", "donnelly-river") // Match route format
      .replace("darlingrange", "darling-range"); // Match route format

    if (VALID_QR_CODES.map((code) => code.toLowerCase().trim()).includes(qrCode)) {
      await cleanupScanner();
      
      router.push(`/qr/${normalizedQrCode}`, "root", "replace");
    } else {
      await cleanupScanner();
      setShowInvalidQRError(true);
    }
  };

  // Scanner initialization and frame setup
  const startScan = async () => {
    if (isScanning) return;

    try {
      setIsScanning(true);

      // Check camera permissions
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (!status.granted) {
        setShowPermissionError(true);
        setIsScanning(false);
        return;
      }

      // Create scanner frame with corner markers
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
        router.push("/menu", "back");
      }
    } catch (error) {
      await cleanupScanner();
      router.push("/menu", "back");
    }
  };

  // Handler functions
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
    router.push("/menu", "back");
  };

  // Component render
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>QR Scanner</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Permission Error Alert */}
        <IonAlert
          isOpen={showPermissionError}
          onDidDismiss={handleCancel}
          header={"Camera Permission Required"}
          message={"Please enable camera access in your device settings to use the QR scanner."}
          buttons={[
            { text: "Cancel", role: "cancel", handler: handleCancel },
            { text: "Open Settings", handler: openDeviceSettings },
          ]}
        />

        {/* Invalid QR Code Alert */}
        <IonAlert
          isOpen={showInvalidQRError}
          onDidDismiss={handleCancel}
          header={"Invalid QR Code"}
          message={"The scanned QR code is not valid for this application. Please scan a valid QR code."}
          buttons={[
            { text: "Cancel", handler: handleCancel },
            { text: "Try Again", handler: handleRetry },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default QRScanner;