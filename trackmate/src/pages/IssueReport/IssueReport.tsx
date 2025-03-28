import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonIcon,
  IonChip,
  IonToast,
  IonLoading,
  IonActionSheet,
  IonText,
  IonPopover,
  IonDatetime,
  IonModal,
  IonButton,
} from "@ionic/react";
import {
  camera,
  location,
  cloudUpload,
  image,
  trash,
  cloudOfflineOutline,
  arrowForward,
  calendar,
  alertCircleOutline,
  checkmarkOutline,
} from "ionicons/icons";
import "./IssueReport.css";

// Import models and services
import {
  defaultFormData,
  IssueFormData,
  Coordinates,
} from "./Models/IssueReport";
import { ValidationErrors } from "./Utils/Validation";
import { generateReportId } from "./Utils/IDGenerator";
import { Geolocation } from "./Services/Geolocation";
import { Camera } from "./Services/Camera";
import { Network } from "./Services/Network";
import { Storage } from "./Services/Storage";
import { Report } from "./Services/Report";
import { API } from "./Services/API";
import { CameraSource } from "@capacitor/camera";
import localforage from "localforage";

const IssueReport: React.FC = () => {
  // State management
  const [formData, setFormData] = useState<IssueFormData>({
    ...defaultFormData,
    name: "",
    email: "",
    telephone: "",
  });
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const issueTypes = [
    "Fallen Tree",
    "Damaged Trail/Erosion",
    "Damaged/Missing Sign",
    "Damaged Shelter/Facility",
    "Water Source Issue",
    "Wildlife Concern",
    "Overgrown Vegetation",
    "Other"
  ];

  const urgencyLevels = [
    { value: "low", label: "Low", className: "urgency-low" },
    { value: "medium", label: "Medium", className: "urgency-medium" },
    { value: "high", label: "High", className: "urgency-high" }
  ];

  // Load initial data and set up listeners
  useEffect(() => {
    async function initialize() {
      // Check network status
      const networkStatus = await Network.getNetworkStatus();
      setIsOnline(networkStatus);

      // Listen for network changes
      Network.addNetworkListener((connected) => {
        setIsOnline(connected);

        // If we're back online, try to sync any saved reports
        if (connected) {
          syncPendingReports();
        }
      });

      // Load stored draft form data
      const storedData = await Storage.loadFormDraft();
      if (storedData) {
        setFormData(storedData);
      }
    }

    initialize();
  }, []);

  // Save form data to local storage when it changes
  useEffect(() => {
    Storage.saveFormDraft(formData);
  }, [formData]);

  // Add network status effect
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingReports();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync check
    if (navigator.onLine) {
      syncPendingReports();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingReports = async () => {
    if (!isOnline) return;

    try {
      const pendingReports = await Storage.getPendingReports();
      if (pendingReports.length === 0) return;

      let successCount = 0;
      const remainingReports = [];

      for (const report of pendingReports) {
        try {
          await API.submitReport(report.data);
          successCount++;

          // If report had a photo, clean it up
          if (report.data.photo) {
            const photoId = report.data.photo;
            await Storage.deletePhoto(photoId);
          }
        } catch (error) {
          console.error('Error syncing report:', error);
          report.attempts = (report.attempts || 0) + 1;
          if (report.attempts < 3) { // Keep for retry if under max attempts
            remainingReports.push(report);
          }
        }
      }

      // Update storage with remaining reports
      await Storage.updatePendingReports(remainingReports);

      if (successCount > 0) {
        setToastMessage(`Successfully synced ${successCount} report(s)`);
        setToastColor('success');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error in syncPendingReports:', error);
      setToastMessage('Error syncing reports. Will retry later.');
      setToastColor('warning');
      setShowToast(true);
    }
  };

  // Sync pending reports when online
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare report data in the format expected by the server
      const reportData = {
        reportId: generateReportId(), // Generate a unique report ID
        name: formData.name,
        email: formData.email,
        telephone: formData.telephone || '',
        dateObserved: formData.dateObserved,
        issueType: formData.issueType,
        urgency: formData.urgency,
        location: formData.locationDetails || '',
        comments: formData.comments,
        coordinates: coordinates,
        photo: null as string | null,
        submissionDate: new Date().toISOString()
      };

      // If we have a photo ID, get the actual photo data
      if (photo) {
        const photoData = await Storage.getPhoto(photo);
        if (photoData) {
          reportData.photo = photoData;
        }
      }

      if (!isOnline) {
        // Save report for later if offline
        const pendingReport = {
          id: reportData.reportId,
          data: reportData,
          timestamp: new Date().getTime(),
          attempts: 0
        };

        const pendingReports = await Storage.getPendingReports();
        pendingReports.push(pendingReport);
        await Storage.updatePendingReports(pendingReports);

        setToastMessage('Report saved offline. Will sync when online.');
        setToastColor('warning');
        setShowToast(true);
      } else {
        // Submit directly if online
        try {
          await API.submitReport(reportData);
          setToastMessage('Report submitted successfully!');
          setToastColor('success');
          setShowSuccessModal(true);
          
          // Clear the stored photo if submission was successful
          if (photo) {
            await Storage.deletePhoto(photo);
          }
        } catch (error) {
          console.error('Error submitting report:', error);
          // If online submission fails, save for later
          const pendingReport = {
            id: reportData.reportId,
            data: reportData,
            timestamp: new Date().getTime(),
            attempts: 0
          };

          const pendingReports = await Storage.getPendingReports();
          pendingReports.push(pendingReport);
          await Storage.updatePendingReports(pendingReports);

          setToastMessage('Could not submit report. Saved for later.');
          setToastColor('warning');
          setShowToast(true);
          return;
        }
      }

      // Reset form
      setFormData({ ...defaultFormData });
      setPhoto(null);
      setCoordinates(null);
      await Storage.clearFormDraft();
      
    } catch (error) {
      console.error('Error handling report:', error);
      setToastMessage('Error handling report. Please try again.');
      setToastColor('danger');
    } finally {
      setLoading(false);
      setShowToast(true);
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

    // Only update if value has actually changed
    if (formData[field] !== value) {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Handle issue type selection
  const handleIssueTypeSelect = (type: string) => {
    handleInputChange("issueType", type);
  };

  // Handle urgency selection
  const handleUrgencySelect = (level: string) => {
    handleInputChange("urgency", level);
  };

  const formatDate = (date: string | string[]): string => {
    return Array.isArray(date) ? date[0] : date;
  };

  const handleDateChange = (date: string | string[]) => {
    const formattedDate = formatDate(date);
    handleInputChange("dateObserved", formattedDate);
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
      setLoading(true);
      console.log(`Attempting to take photo with source: ${sourceType}`);

      const image = await Camera.takePicture(sourceType);
      console.log(
        "Photo captured successfully:",
        image ? "Image received" : "No image"
      );

      if (image) {
        // Generate a unique ID for the photo
        const photoId = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Save photo to local storage
        await Storage.savePhoto(photoId, image);
        
        // Store the photo ID in the state
        setPhoto(photoId);
        setShowActionSheet(false);
        
        setToastColor("success");
        setToastMessage("Photo captured and saved successfully!");
        setShowToast(true);
      }
    } catch (error: unknown) {
      console.error("Error taking photo:", error);
      setToastColor("danger");

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
    } finally {
      setLoading(false);
    }
  };

  // Load photo for display
  const getPhotoForDisplay = async (photoId: string): Promise<string | null> => {
    try {
      return await Storage.getPhoto(photoId);
    } catch (error) {
      console.error("Error loading photo:", error);
      return null;
    }
  };

  // Render photo preview
  const renderPhotoPreview = () => {
    if (!photo) return null;

    return (
      <IonItem lines="none" className="photo-preview-item">
        <div className="photo-preview-container">
          <img 
            src={photo} 
            alt="Issue" 
            className="photo-preview" 
          />
          <IonButton
            fill="clear"
            className="delete-photo-button"
            onClick={async () => {
              if (photo) {
                await Storage.deletePhoto(photo);
                setPhoto(null);
              }
            }}
          >
            <IonIcon icon={trash} />
          </IonButton>
        </div>
      </IonItem>
    );
  };

  const handlePhotoUpload = () => {
    setShowActionSheet(true);
  };

  return (
    <IonPage className="issue-report-page">
      <IonContent fullscreen>
        <div className="issue-card-container">
          <form className="form-container" onSubmit={handleSubmit}>
            {/* Network status indicator */}
            <IonChip 
              color={isOnline ? "success" : "warning"} 
              className="network-status"
            >
              <IonIcon icon={isOnline ? cloudUpload : cloudOfflineOutline} />
              <IonLabel>{isOnline ? "Online" : "Offline"}</IonLabel>
            </IonChip>

            {!isOnline && (
              <div className="offline-banner">
                <IonIcon icon={cloudOfflineOutline} />
                <span>You're offline. Report will be saved locally and sent when online.</span>
              </div>
            )}

            <div className="form-section">
              <h2 className="form-title">Report an Issue</h2>
              <p className="form-subtitle">
                Your reports help us keep the Bibbulmun Track in great condition.
                Please note: in case of an emergency, always contact local authorities.
              </p>

              <IonLabel>Issue Type <span className="required">*</span></IonLabel>
              <div className="issue-types">
                {issueTypes.map((type) => (
                  <IonChip
                    key={type}
                    className={formData.issueType === type ? "selected" : ""}
                    onClick={() => handleIssueTypeSelect(type)}
                  >
                    {type}
                  </IonChip>
                ))}
              </div>

              <IonLabel>Urgency Level <span className="required">*</span></IonLabel>
              <div className="urgency-options">
                {urgencyLevels.map((level) => (
                  <div
                    key={level.value}
                    className={`urgency-option ${level.className} ${
                      formData.urgency === level.value ? "selected" : ""
                    }`}
                    onClick={() => handleUrgencySelect(level.value)}
                  >
                    {level.label}
                  </div>
                ))}
              </div>

              <label className="field-label" htmlFor="name">Name <span className="required">*</span></label>
              <IonInput
                id="name"
                className="input-field"
                value={formData.name}
                onIonChange={(e) => handleInputChange("name", e.detail.value!)}
                placeholder="Your full name"
                required
                aria-required="true"
                aria-invalid={!!validationErrors.name}
                aria-describedby={validationErrors.name ? "name-error" : undefined}
              />
              {validationErrors.name && (
                <div className="error-message" id="name-error" role="alert">
                  <IonIcon icon={alertCircleOutline} />
                  {validationErrors.name}
                </div>
              )}

              <label className="field-label" htmlFor="email">Email <span className="required">*</span></label>
              <IonInput
                id="email"
                type="email"
                className="input-field"
                value={formData.email}
                onIonChange={(e) => handleInputChange("email", e.detail.value!)}
                placeholder="your@email.com"
                required
                aria-required="true"
                aria-invalid={!!validationErrors.email}
                aria-describedby={validationErrors.email ? "email-error" : undefined}
              />
              {validationErrors.email && (
                <div className="error-message" id="email-error" role="alert">
                  <IonIcon icon={alertCircleOutline} />
                  {validationErrors.email}
                </div>
              )}

              <label className="field-label" htmlFor="telephone">Telephone <span className="optional">(optional)</span></label>
              <IonInput
                id="telephone"
                type="tel"
                className="input-field"
                value={formData.telephone}
                onIonChange={(e) => handleInputChange("telephone", e.detail.value!)}
                placeholder="Your phone number"
                aria-invalid={!!validationErrors.telephone}
                aria-describedby={validationErrors.telephone ? "telephone-error" : undefined}
              />
              {validationErrors.telephone && (
                <div className="error-message" id="telephone-error" role="alert">
                  <IonIcon icon={alertCircleOutline} />
                  {validationErrors.telephone}
                </div>
              )}
            </div>

            <div className="form-section">
              <label className="field-label">Date Observed <span className="required">*</span></label>
              <button
                className="date-button"
                onClick={() => setShowDatePicker(true)}
              >
                <IonIcon icon={calendar} />
                {formData.dateObserved
                  ? new Date(formData.dateObserved).toLocaleDateString()
                  : "Select Date"}
              </button>
              {validationErrors.dateObserved && (
                <div className="error-message" id="date-error" role="alert">
                  <IonIcon icon={alertCircleOutline} />
                  {validationErrors.dateObserved}
                </div>
              )}
              <div className="helper-text">Note: Date must be within the last 4 weeks</div>

              <IonPopover
                isOpen={showDatePicker}
                onDidDismiss={() => setShowDatePicker(false)}
                showBackdrop={true}
                backdropDismiss={true}
              >
                <IonDatetime
                  value={formData.dateObserved}
                  onIonChange={(e) => handleDateChange(e.detail.value!)}
                  presentation="date"
                  showDefaultButtons={true}
                  max={new Date().toISOString()}
                />
              </IonPopover>
            </div>

            <div className="form-section">
              <IonLabel>Location <span className="required">*</span></IonLabel>
              <button
                type="button"
                className="location-button"
                onClick={captureLocation}
              >
                <IonIcon icon={location} />
                Capture GPS Location
              </button>

              <div className="location-details">
                <div className="location-details-header">
                  Location Details <span className="optional">(optional)</span>
                </div>
                <textarea
                  className="location-input"
                  value={formData.locationDetails}
                  onChange={(e) => handleInputChange("locationDetails", e.target.value)}
                  placeholder="Additional location details (e.g., 2km north of Helena shelter)"
                />
              </div>

              <div className="photo-evidence">
                <div className="photo-evidence-header">
                  Photo Evidence <span className="optional">(optional)</span>
                </div>
                <div 
                  className="photo-upload-area"
                  onClick={handlePhotoUpload}
                >
                  <IonIcon icon={cloudUpload} />
                  <span className="photo-upload-text">Add Photo</span>
                </div>
              </div>

              <div className="issue-description">
                <div className="issue-description-header">
                  Issue Description <span className="required">*</span>
                </div>
                <textarea
                  className="description-input"
                  value={formData.comments}
                  onChange={(e) => handleInputChange("comments", e.target.value)}
                  placeholder="Please describe the issue in detail"
                  required
                />
              </div>

              {renderPhotoPreview()}

              <div className="submit-button-container">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {isOnline ? (
                    <>
                      Submit Report
                      <IonIcon icon={arrowForward} />
                    </>
                  ) : (
                    <>
                      Save Offline
                      <IonIcon icon={cloudOfflineOutline} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        <IonLoading isOpen={loading} message="Please wait..." />
        
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
          cssClass="custom-toast"
          icon={checkmarkOutline}
        />

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: "Take Photo",
              icon: camera,
              handler: () => handleTakePhoto(CameraSource.Camera),
            },
            {
              text: "Choose from Gallery",
              icon: image,
              handler: () => handleTakePhoto(CameraSource.Photos),
            },
            {
              text: "Cancel",
              role: "cancel",
            },
          ]}
        />

        <IonModal
          isOpen={showSuccessModal}
          onDidDismiss={() => setShowSuccessModal(false)}
          className="success-modal"
        >
          <div className="modal-content">
            <div className="success-icon">
              <IonIcon icon={checkmarkOutline} />
            </div>
            <h2>Report Submitted</h2>
            <p>Your issue has been successfully reported.</p>
            <IonButton expand="block" onClick={() => setShowSuccessModal(false)}>
              DONE
            </IonButton>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default IssueReport;
