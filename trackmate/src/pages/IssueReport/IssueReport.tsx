import React, { useState, useEffect, useRef } from "react";
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  IonChip,
  IonToast,
  IonLoading,
  IonDatetime,
  IonActionSheet,
  IonText,
} from "@ionic/react";
import {
  camera,
  location,
  cloudUpload,
  image,
  trash,
  wifi,
  cloudOfflineOutline,
  arrowForward,
  calendar,
} from "ionicons/icons";
import "./IssueReport.css";

// Import models and services from your existing structure
import {
  defaultFormData,
  IssueFormData,
  Coordinates,
} from "./Models/IssueReport";
import { ValidationErrors } from "./Utils/Validation";
import { Geolocation } from "./Services/Geolocation";
import { Camera } from "./Services/Camera";
import { Network } from "./Services/Network";
import { Storage } from "./Services/Storage";
import { Report } from "./Services/Report";
import { CameraSource } from "@capacitor/camera";
import { BackgroundSync } from "./Services/BackgroundSync";

const IssueReport: React.FC = () => {
  // State management
  const [formData, setFormData] = useState<IssueFormData>(defaultFormData);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("success");
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load initial data and set up listeners
  useEffect(() => {
    async function initialize() {
      try {
        console.log("Initializing IssueReport component");
        
        // Initialize BackgroundSync service
        await BackgroundSync.initialize();

        // Check network status
        const networkStatus = await Network.getNetworkStatus();
        setIsOnline(networkStatus);

        // Listen for network changes
        Network.addNetworkListener((connected) => {
          console.log("Network status changed:", connected ? "online" : "offline");
          setIsOnline(connected);
          
          // If we're coming online, trigger sync directly
          if (connected) {
            BackgroundSync.syncPendingReports().then(count => {
              if (count > 0) {
                setToastColor("success");
                setToastMessage(`${count} pending report(s) synced successfully`);
                setShowToast(true);
              }
            });
          }
        });

        // Load stored draft form data
        const storedData = await Storage.loadFormDraft();
        if (storedData) {
          setFormData(storedData);
        }

        // Show pending reports status and attempt to sync
        checkPendingReports();
        
        console.log("IssueReport component initialized");
      } catch (error) {
        console.error("Initialization error:", error);
      }
    }

    initialize();
    
    // Cleanup when component unmounts
    return () => {
      console.log("IssueReport component unmounting");
    };
  }, []);

  // Check for pending reports and show status
  const checkPendingReports = async () => {
    try {
      const pendingReports = await BackgroundSync.getPendingReports();
      console.log(`Found ${pendingReports.length} pending reports during check`);
      
      if (pendingReports.length > 0) {
        setToastColor("warning");
        setToastMessage(`${pendingReports.length} report(s) pending sync`);
        setShowToast(true);
        
        // Trigger sync attempt
        if (isOnline) {
          BackgroundSync.syncPendingReports();
        }
      }
    } catch (error) {
      console.error("Error checking pending reports:", error);
    }
  };

  // Save form data to local storage when it changes
  useEffect(() => {
    Storage.saveFormDraft(formData);
  }, [formData]);

  // Sync pending reports when online
  const syncPendingReports = async () => {
    try {
      setLoading(true);
      const syncedCount = await BackgroundSync.syncPendingReports();

      if (syncedCount > 0) {
        setToastColor("success");
        setToastMessage(`${syncedCount} pending report(s) synced successfully`);
        setShowToast(true);
      }
    } catch (error) {
      console.error("Sync error:", error);
      setToastColor("danger");
      setToastMessage("Error syncing reports. Please try again later.");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Add function to clear stored reports
  const clearStoredReports = async () => {
    try {
      setLoading(true);
      await BackgroundSync.clearAllPendingReports();
      setToastColor("success");
      setToastMessage("All stored reports cleared");
      setShowToast(true);
    } catch (error) {
      console.error("Error clearing reports:", error);
      setToastColor("danger");
      setToastMessage("Error clearing stored reports");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof IssueFormData, value: string) => {
    // Clear validation error when field is edited
    if (validationErrors[field]) {
      const updatedErrors = { ...validationErrors };
      delete updatedErrors[field];
      setValidationErrors(updatedErrors);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle issue type selection
  const handleIssueTypeSelect = (type: string) => {
    handleInputChange("issueType", type);
  };

  // Handle urgency selection
  const handleUrgencySelect = (level: string) => {
    handleInputChange("urgency", level);
  };

  // Handle date selection
  const handleDateChange = (value: string) => {
    handleInputChange("dateObserved", value);
    setShowDatePicker(false);
  };

  // Handle location capture
  const captureLocation = async () => {
    try {
      setLoading(true);
      const position = await Geolocation.getCurrentLocation();
      setCoordinates(position);

      // Clear location validation error if it exists
      if (validationErrors.location) {
        const updatedErrors = { ...validationErrors };
        delete updatedErrors.location;
        setValidationErrors(updatedErrors);
      }

      setToastColor("success");
      setToastMessage("GPS location captured successfully!");
      setShowToast(true);
    } catch (error: unknown) {
      console.error("Error getting location:", error);
      setToastColor("danger");

      // Handle the unknown error safely
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String(error.message);
      }

      setToastMessage(`Could not get location: ${errorMessage}`);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle photo capture
  const handleTakePhoto = async (sourceType: CameraSource) => {
    try {
      const image = await Camera.takePicture(sourceType);
      setPhoto(image);
    } catch (error: unknown) {
      console.error("Error taking photo:", error);
      setToastColor("danger");

      // Handle the unknown error safely
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String(error.message);
      }

      setToastMessage(`Could not capture image: ${errorMessage}`);
      setShowToast(true);
    }
  };

  // Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make sure all required fields have values
      const completeFormData = {
        ...formData,
        // Ensure required fields have values
        name: formData.name || "",
        email: formData.email || "",
        issueType: formData.issueType || "",
        urgency: formData.urgency || "medium",
        comments: formData.comments || "",
        dateObserved: formData.dateObserved || new Date().toISOString().split("T")[0],
      };

      const result = await Report.submitReport(
        completeFormData,
        coordinates,
        photo,
        isOnline
      );

      setToastColor(result.color);
      setToastMessage(result.message);
      setShowToast(true);

      if (result.success) {
        // Reset form after successful submission or storage
        setFormData(defaultFormData);
        setPhoto(null);
        setCoordinates(null);
      } else {
        // If there were validation errors, update the state
        const validationErrors = Report.validateForm(formData, coordinates);
        setValidationErrors(validationErrors);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setToastColor("danger");
      setToastMessage("Error submitting report. Please try again.");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <IonPage className="gradient-background">
      <IonContent className="ion-padding">
        {/* Add clear stored reports button when offline */}
        {!isOnline && (
          <IonButton
            expand="block"
            color="medium"
            onClick={clearStoredReports}
            className="ion-margin-bottom"
          >
            Clear Stored Reports
          </IonButton>
        )}

        {/* Banner for offline mode */}
        {!isOnline && (
          <div className="network-status network-status-offline">
            <IonIcon icon={cloudOfflineOutline} />
            <span className="ion-padding-start">
              You're offline. Report will be saved locally and sent when online.
            </span>
          </div>
        )}

        <div className="issue-card-container">
          <div className="form-container">
            <h2 className="form-title">Report an Issue</h2>
            <p className="form-subtitle">
              Your reports help us keep the Bibbulmun Track in great condition.
              Please note: in case of an emergency, always contact local
              authorities or emergency services immediately.
            </p>

            <form onSubmit={handleSubmit}>
              <IonItem className="form-item">
                <IonLabel position="stacked" className="field-label">
                  Name <span className="required">*</span>
                </IonLabel>
                <IonInput
                  value={formData.name}
                  onIonChange={(e) =>
                    handleInputChange("name", e.detail.value || "")
                  }
                  placeholder="Your full name"
                  className="input-field"
                />
                {validationErrors.name && (
                  <div className="validation-error">
                    {validationErrors.name}
                  </div>
                )}
              </IonItem>

              <IonItem className="form-item">
                <IonLabel position="stacked" className="field-label">
                  Email <span className="required">*</span>
                </IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  onIonChange={(e) =>
                    handleInputChange("email", e.detail.value || "")
                  }
                  placeholder="your@example.com"
                  className="input-field"
                />
                {validationErrors.email && (
                  <div className="validation-error">
                    {validationErrors.email}
                  </div>
                )}
              </IonItem>

              <IonItem className="form-item">
                <IonLabel position="stacked" className="field-label">
                  Telephone <span className="optional">(optional)</span>
                </IonLabel>
                <IonInput
                  type="tel"
                  value={formData.telephone}
                  onIonChange={(e) =>
                    handleInputChange("telephone", e.detail.value || "")
                  }
                  placeholder="Your phone number"
                  className="input-field"
                />
              </IonItem>

              <IonItem className="form-item">
                <IonLabel position="stacked" className="field-label">
                  Date Observed <span className="required">*</span>
                </IonLabel>

                <div className="date-input">
                  <div
                    className="date-display"
                    onClick={() => setShowDatePicker(true)}
                  >
                    {formatDate(formData.dateObserved)}
                  </div>
                  <IonButton
                    fill="clear"
                    onClick={() => setShowDatePicker(true)}
                  >
                    <IonIcon icon={calendar} />
                  </IonButton>
                </div>

                {showDatePicker && (
                  <IonDatetime
                    presentation="date"
                    value={formData.dateObserved}
                    onIonChange={(e) => handleDateChange(e.detail.value || "")}
                    max={new Date().toISOString()}
                    onIonCancel={() => setShowDatePicker(false)}
                    showDefaultButtons={true}
                  />
                )}

                {validationErrors.dateObserved && (
                  <div className="validation-error">
                    {validationErrors.dateObserved}
                  </div>
                )}
                <IonText className="date-note">
                  Note: Date must be within the last 4 weeks
                </IonText>
              </IonItem>

              <div className="form-section">
                <IonLabel className="field-label chips-label">
                  Issue Type <span className="required">*</span>
                </IonLabel>
                <div className="chip-container">
                  {[
                    "Fallen Tree",
                    "Damaged Trail/Erosion",
                    "Damaged/Missing Sign",
                    "Damaged Shelter/Facility",
                    "Water Source Issue",
                    "Wildlife Concern",
                    "Overgrown Vegetation",
                    "Other",
                  ].map((type) => (
                    <IonChip
                      key={type}
                      className={`issue-chip ${
                        formData.issueType === type ? "selected-chip" : ""
                      }`}
                      onClick={() => handleIssueTypeSelect(type)}
                    >
                      {type}
                    </IonChip>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <IonLabel className="field-label">
                  Urgency Level <span className="required">*</span>
                </IonLabel>
                <div className="urgency-container">
                  <IonChip
                    className={`urgency-chip low ${
                      formData.urgency === "low" ? "selected-chip" : ""
                    }`}
                    onClick={() => handleUrgencySelect("low")}
                  >
                    Low
                  </IonChip>
                  <IonChip
                    className={`urgency-chip medium ${
                      formData.urgency === "medium" ? "selected-chip" : ""
                    }`}
                    onClick={() => handleUrgencySelect("medium")}
                  >
                    Medium
                  </IonChip>
                  <IonChip
                    className={`urgency-chip high ${
                      formData.urgency === "high" ? "selected-chip" : ""
                    }`}
                    onClick={() => handleUrgencySelect("high")}
                  >
                    High
                  </IonChip>
                </div>
              </div>

              <div className="form-section">
                <IonLabel className="field-label">
                  Location <span className="required">*</span>
                </IonLabel>
                <IonButton
                  className="location-button"
                  onClick={captureLocation}
                >
                  <IonIcon slot="start" icon={location} />
                  Capture GPS Location
                </IonButton>

                {coordinates && (
                  <div className="coordinates-display">
                    <strong>Latitude:</strong> {coordinates.latitude.toFixed(6)}
                    <br />
                    <strong>Longitude:</strong>{" "}
                    {coordinates.longitude.toFixed(6)}
                    <br />
                    <strong>Accuracy:</strong> ±
                    {Math.round(coordinates.accuracy)} meters
                  </div>
                )}

                <IonItem className="form-item no-padding">
                  <IonLabel position="stacked" className="description-label">
                    Optionally describe in detail:
                  </IonLabel>
                  <IonTextarea
                    value={formData.location}
                    onIonChange={(e) =>
                      handleInputChange("location", e.detail.value || "")
                    }
                    placeholder="Additional location details (e.g., 2km north of Helena shelter)"
                    className="input-field textarea-field"
                    rows={2}
                  />
                  {validationErrors.location && (
                    <div className="validation-error">
                      {validationErrors.location}
                    </div>
                  )}
                </IonItem>
              </div>

              <IonItem className="form-item">
                <IonLabel position="stacked" className="field-label">
                  Issue Description <span className="required">*</span>
                </IonLabel>
                <IonTextarea
                  value={formData.comments}
                  onIonChange={(e) =>
                    handleInputChange("comments", e.detail.value || "")
                  }
                  placeholder="Please describe the issue in detail"
                  className="input-field textarea-field"
                  rows={3}
                />
                {validationErrors.comments && (
                  <div className="validation-error">
                    {validationErrors.comments}
                  </div>
                )}
              </IonItem>

              <div className="form-section">
                <IonLabel className="field-label">
                  Photo <span className="optional">(optional)</span>
                </IonLabel>
                <IonButton
                  className="photo-button"
                  onClick={() => setShowActionSheet(true)}
                >
                  <IonIcon slot="start" icon={camera} />
                  {photo ? "Change Photo" : "Add Photo"}
                </IonButton>

                {photo && (
                  <div className="photo-container">
                    <img src={photo} alt="Issue" className="issue-photo" />
                    <IonButton
                      expand="block"
                      color="danger"
                      size="small"
                      className="ion-margin-top"
                      onClick={() => setPhoto(null)}
                    >
                      <IonIcon slot="start" icon={trash} />
                      Remove Photo
                    </IonButton>
                  </div>
                )}
              </div>

              <div className="form-action">
                <IonButton
                  expand="block"
                  type="submit"
                  className="submit-button"
                >
                  <span>Submit Report</span>
                  <IonIcon slot="end" icon={arrowForward} />
                </IonButton>
              </div>

              <div className="network-indicator">
                {isOnline ? (
                  <div className="online-status">
                    <IonIcon icon={wifi} />
                    <span>Online - Report will be submitted immediately</span>
                  </div>
                ) : (
                  <div className="offline-status">
                    <IonIcon icon={cloudOfflineOutline} />
                    <span>
                      Offline - Report will be saved and synced when online
                    </span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Action sheet for camera options */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: "Take Photo",
              icon: camera,
              handler: () => {
                handleTakePhoto(CameraSource.Camera);
              },
            },
            {
              text: "Choose from Gallery",
              icon: image,
              handler: () => {
                handleTakePhoto(CameraSource.Photos);
              },
            },
            {
              text: "Cancel",
              role: "cancel",
            },
          ]}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
          color={toastColor}
        />

        <IonLoading isOpen={loading} message="Please wait..." />
      </IonContent>
    </IonPage>
  );
};

export default IssueReport;
