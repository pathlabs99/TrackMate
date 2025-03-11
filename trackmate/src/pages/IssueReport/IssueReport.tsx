import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonToast,
  IonLoading,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonActionSheet,
  IonChip,
  IonSelect,
  IonSelectOption,
  isPlatform,
} from "@ionic/react";
import {
  camera,
  image,
  trash,
  location,
  locationOutline,
  cloudUpload,
  wifi,
  wifiOutline,
  cloudOfflineOutline,
} from "ionicons/icons";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";
import { Network } from "@capacitor/network";
import localforage from "localforage";

interface IssueFormData {
  name: string;
  email: string;
  telephone: string;
  dateObserved: string;
  location: string;
  issueType: string;
  urgency: string;
  comments: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

// Server URL
const API_URL = "https://trackmate-server-0uvc.onrender.com";

const IssueReportForm: React.FC = () => {
  const [formData, setFormData] = useState<IssueFormData>({
    name: "",
    email: "",
    telephone: "",
    dateObserved: new Date().toISOString().split("T")[0], // Today's date as default
    location: "",
    issueType: "",
    urgency: "medium", // Default urgency
    comments: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("success");
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Check network status on mount
  useEffect(() => {
    const checkNetworkStatus = async () => {
      const status = await Network.getStatus();
      setIsOnline(status.connected);
    };

    checkNetworkStatus();

    // Listen for network status changes
    const networkListener = Network.addListener(
      "networkStatusChange",
      (status) => {
        // Update online status
        setIsOnline(status.connected);

        // If we're back online, try to sync any saved reports
        if (status.connected) {
          syncPendingReports();
        }
      }
    );

    // Check for stored form data in localStorage
    const loadStoredFormData = async () => {
      const storedData = await localforage.getItem<IssueFormData>(
        "draft-report"
      );
      if (storedData) {
        setFormData(storedData);
      }
    };

    loadStoredFormData();

    return () => {
      networkListener.remove();
    };
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    const saveFormData = async () => {
      await localforage.setItem("draft-report", formData);
    };

    saveFormData();
  }, [formData]);

  // Generate a report ID
  const generateReportId = () => {
    const now = new Date();

    // Format date as YYYYMMDD
    const datePart =
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0");

    // Format time as HHMMSS
    const timePart =
      now.getHours().toString().padStart(2, "0") +
      now.getMinutes().toString().padStart(2, "0") +
      now.getSeconds().toString().padStart(2, "0");

    // Add a random 4-digit number for uniqueness
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();

    return `BTF-${datePart}-${timePart}-${randomPart}`;
  };

  const syncPendingReports = async () => {
    try {
      const pendingReports =
        (await localforage.getItem<any[]>("pending-reports")) || [];

      if (pendingReports.length === 0) return;

      setLoading(true);
      let syncedCount = 0;

      for (const report of pendingReports) {
        try {
          await submitReportToServer(report.data);
          syncedCount++;

          // Remove this report from pending list
          const updatedPendingReports = pendingReports.filter(
            (r) => r.data.reportId !== report.data.reportId
          );
          await localforage.setItem("pending-reports", updatedPendingReports);
        } catch (error) {
          console.error("Error syncing report:", error);
        }
      }

      if (syncedCount > 0) {
        setToastColor("success");
        setToastMessage(`${syncedCount} pending report(s) synced successfully`);
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error during sync:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name) {
      errors.name = "Name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!formData.dateObserved) {
      errors.dateObserved = "Date is required";
    } else {
      // Check if date is within the last 4 weeks
      const selectedDate = new Date(formData.dateObserved);
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28); // 4 weeks = 28 days

      if (selectedDate < fourWeeksAgo) {
        errors.dateObserved = "Date must be within the last 4 weeks";
      }

      // Also check that the date is not in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day

      if (selectedDate > today) {
        errors.dateObserved = "Date cannot be in the future";
      }
    }

    if (!formData.location && !coordinates) {
      errors.location =
        "Location information is required (either description or GPS coordinates)";
    }

    if (!formData.comments) {
      errors.comments = "Issue description is required";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const submitReportToServer = async (reportData: any) => {
    const response = await fetch(`${API_URL}/send-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  };

  const handleSubmit = async () => {
    // Reset validation errors
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      setToastColor("danger");
      setToastMessage("Please correct the errors in the form");
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      // Generate report ID
      const reportId = generateReportId();

      // Create the JSON data object
      const reportData = {
        reportId,
        ...formData,
        coordinates,
        photo,
        submissionDate: new Date().toISOString(),
      };

      if (isOnline) {
        // Send report to server
        await submitReportToServer(reportData);

        setToastColor("success");
        setToastMessage("Report submitted successfully");

        // Clear form on successful submission
        setFormData({
          name: "",
          email: "",
          telephone: "",
          dateObserved: new Date().toISOString().split("T")[0],
          location: "",
          issueType: "",
          urgency: "medium",
          comments: "",
        });
        setPhoto(null);
        setCoordinates(null);

        // Clear draft
        await localforage.removeItem("draft-report");
      } else {
        // Store report for later submission
        const pendingReports =
          (await localforage.getItem<any[]>("pending-reports")) || [];
        pendingReports.push({
          data: reportData,
          timestamp: new Date().toISOString(),
        });

        await localforage.setItem("pending-reports", pendingReports);

        setToastColor("warning");
        setToastMessage(
          "You're offline. Report saved and will be sent automatically when you're back online."
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      setToastColor("danger");
      setToastMessage(`Failed to submit report: ${error.message}`);
    } finally {
      setLoading(false);
      setShowToast(true);
    }
  };

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

  const getCurrentLocation = async () => {
    try {
      setLoading(true);

      // Request permissions
      const permissionStatus = await Geolocation.checkPermissions();

      if (permissionStatus.location !== "granted") {
        const request = await Geolocation.requestPermissions();
        if (request.location !== "granted") {
          throw new Error("Location permission denied");
        }
      }

      // Get current position
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      setCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });

      setToastColor("success");
      setToastMessage("Location captured successfully");
      setShowToast(true);

      // Clear location validation error if it exists
      if (validationErrors.location) {
        const updatedErrors = { ...validationErrors };
        delete updatedErrors.location;
        setValidationErrors(updatedErrors);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setToastColor("danger");
      setToastMessage(`Could not get location: ${error.message}`);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const takePicture = async (sourceType: CameraSource) => {
    try {
      // For web browsers, use a different approach
      if (!isPlatform("capacitor")) {
        // If we're in a browser and using the camera
        if (sourceType === CameraSource.Camera) {
          // Create a file input element
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.capture = "environment"; // Use the back camera if available

          // Create a promise to wait for user input
          const filePromise = new Promise<File | null>((resolve) => {
            input.onchange = (event) => {
              const files = (event.target as HTMLInputElement).files;
              if (files && files.length > 0) {
                resolve(files[0]);
              } else {
                resolve(null);
              }
            };

            // If the user cancels, resolve with null
            input.onclick = () => {
              const cancelCheck = setTimeout(() => {
                if (input.files?.length === 0 || !input.files) {
                  resolve(null);
                }
              }, 1000);

              input.onchange = (event) => {
                clearTimeout(cancelCheck);
                const files = (event.target as HTMLInputElement).files;
                if (files && files.length > 0) {
                  resolve(files[0]);
                } else {
                  resolve(null);
                }
              };
            };
          });

          // Trigger the file selection
          input.click();

          // Wait for user to select a file
          const file = await filePromise;
          if (!file) {
            return; // User canceled
          }

          // Read the file as a data URL
          const reader = new FileReader();
          const dataUrlPromise = new Promise<string>((resolve) => {
            reader.onload = () => {
              resolve(reader.result as string);
            };
          });

          reader.readAsDataURL(file);
          const dataUrl = await dataUrlPromise;

          setPhoto(dataUrl);
        } else {
          // For gallery on web, use a regular file picker
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";

          // Create a promise to wait for user input
          const filePromise = new Promise<File | null>((resolve) => {
            input.onchange = (event) => {
              const files = (event.target as HTMLInputElement).files;
              if (files && files.length > 0) {
                resolve(files[0]);
              } else {
                resolve(null);
              }
            };
          });

          // Trigger the file selection
          input.click();

          // Wait for user to select a file
          const file = await filePromise;
          if (!file) {
            return; // User canceled
          }

          // Read the file as a data URL
          const reader = new FileReader();
          const dataUrlPromise = new Promise<string>((resolve) => {
            reader.onload = () => {
              resolve(reader.result as string);
            };
          });

          reader.readAsDataURL(file);
          const dataUrl = await dataUrlPromise;

          setPhoto(dataUrl);
        }
      } else {
        // Mobile device approach using Capacitor
        try {
          // Request camera permissions
          if (sourceType === CameraSource.Camera) {
            const permissionStatus = await Camera.checkPermissions();
            if (permissionStatus.camera !== "granted") {
              const request = await Camera.requestPermissions();
              if (request.camera !== "granted") {
                throw new Error("Camera permission denied");
              }
            }
          }

          // For photo gallery
          if (sourceType === CameraSource.Photos) {
            const permissionStatus = await Camera.checkPermissions();
            if (permissionStatus.photos !== "granted") {
              const request = await Camera.requestPermissions();
              if (request.photos !== "granted") {
                throw new Error("Photos permission denied");
              }
            }
          }

          // Get the photo
          const image = await Camera.getPhoto({
            quality: 70,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: sourceType,
          });

          setPhoto(image.dataUrl || null);
        } catch (error) {
          console.error("Capacitor camera error:", error);
          throw error; // Re-throw to be caught by the outer catch
        }
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      setToastColor("danger");
      setToastMessage(`Could not capture image: ${error.message}`);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Track Issue Report</IonTitle>
          {/* Network status indicator */}
          <div slot="end" className="ion-padding-end">
            {isOnline ? (
              <IonChip color="success" outline={true}>
                <IonIcon icon={isOnline ? "wifi" : "wifi-outline"} />
                <IonLabel>Online</IonLabel>
              </IonChip>
            ) : (
              <IonChip color="warning" outline={true}>
                <IonIcon icon="cloud-offline-outline" />
                <IonLabel>Offline</IonLabel>
              </IonChip>
            )}
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!isOnline && (
          <IonChip color="warning" className="ion-margin-bottom">
            <IonIcon icon="cloud-offline-outline" />
            <IonLabel>
              You're offline. Report will be saved locally and sent when online.
            </IonLabel>
          </IonChip>
        )}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Report an Issue</IonCardTitle>
            <p style={{ marginTop: "10px", fontSize: "14px" }}>
              <span style={{ color: "#eb445a" }}>*</span> Required fields
            </p>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {/* Personal Information */}
              <IonItem>
                <IonLabel position="stacked">
                  Name <span style={{ color: "#eb445a" }}>*</span>
                </IonLabel>
                <IonInput
                  value={formData.name}
                  onIonChange={(e) =>
                    handleInputChange("name", e.detail.value || "")
                  }
                  placeholder="Your full name"
                  className={validationErrors.name ? "ion-invalid" : ""}
                />
                {validationErrors.name && (
                  <div
                    className="ion-padding-start"
                    style={{ color: "#eb445a", fontSize: "0.8rem" }}
                  >
                    {validationErrors.name}
                  </div>
                )}
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">
                  Email <span style={{ color: "#eb445a" }}>*</span>
                </IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  onIonChange={(e) =>
                    handleInputChange("email", e.detail.value || "")
                  }
                  placeholder="Your email address"
                  className={validationErrors.email ? "ion-invalid" : ""}
                />
                {validationErrors.email && (
                  <div
                    className="ion-padding-start"
                    style={{ color: "#eb445a", fontSize: "0.8rem" }}
                  >
                    {validationErrors.email}
                  </div>
                )}
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Telephone</IonLabel>
                <IonInput
                  type="tel"
                  value={formData.telephone}
                  onIonChange={(e) =>
                    handleInputChange("telephone", e.detail.value || "")
                  }
                  placeholder="Your phone number (optional)"
                />
              </IonItem>

              {/* Date observed - with 4 weeks validation */}
              <IonItem>
                <IonLabel position="stacked">
                  Date Observed <span style={{ color: "#eb445a" }}>*</span>
                </IonLabel>
                <IonInput
                  type="date"
                  value={formData.dateObserved}
                  onIonChange={(e) =>
                    handleInputChange("dateObserved", e.detail.value || "")
                  }
                  className={validationErrors.dateObserved ? "ion-invalid" : ""}
                  max={new Date().toISOString().split("T")[0]} // Disallow future dates
                />
                {validationErrors.dateObserved && (
                  <div
                    className="ion-padding-start"
                    style={{ color: "#eb445a", fontSize: "0.8rem" }}
                  >
                    {validationErrors.dateObserved}
                  </div>
                )}
                <div
                  className="ion-padding-start"
                  style={{ fontSize: "0.8rem", color: "#666" }}
                >
                  Note: Date must be within the last 4 weeks
                </div>
              </IonItem>

              {/* Issue Type */}
              <IonItem>
                <IonLabel position="stacked">Issue Type</IonLabel>
                <IonSelect
                  value={formData.issueType}
                  placeholder="Select issue type"
                  onIonChange={(e) =>
                    handleInputChange("issueType", e.detail.value)
                  }
                >
                  <IonSelectOption value="Fallen Tree">
                    Fallen Tree
                  </IonSelectOption>
                  <IonSelectOption value="Damaged Trail/Erosion">
                    Damaged Trail/Erosion
                  </IonSelectOption>
                  <IonSelectOption value="Damaged/Missing Sign">
                    Damaged/Missing Sign
                  </IonSelectOption>
                  <IonSelectOption value="Damaged Shelter/Facility">
                    Damaged Shelter/Facility
                  </IonSelectOption>
                  <IonSelectOption value="Water Source Issue">
                    Water Source Issue
                  </IonSelectOption>
                  <IonSelectOption value="Wildlife Concern">
                    Wildlife Concern
                  </IonSelectOption>
                  <IonSelectOption value="Overgrown Vegetation">
                    Overgrown Vegetation
                  </IonSelectOption>
                  <IonSelectOption value="Other">Other</IonSelectOption>
                </IonSelect>
              </IonItem>

              {/* Urgency Selection using buttons */}
              <IonItem lines="none">
                <IonLabel position="stacked">Urgency Level</IonLabel>
              </IonItem>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonButton
                      expand="block"
                      fill={formData.urgency === "low" ? "solid" : "outline"}
                      color="success"
                      onClick={() => handleInputChange("urgency", "low")}
                    >
                      Low
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton
                      expand="block"
                      fill={formData.urgency === "medium" ? "solid" : "outline"}
                      color="warning"
                      onClick={() => handleInputChange("urgency", "medium")}
                    >
                      Medium
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton
                      expand="block"
                      fill={formData.urgency === "high" ? "solid" : "outline"}
                      color="danger"
                      onClick={() => handleInputChange("urgency", "high")}
                    >
                      High
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>

              {/* Location with GPS button */}
              <IonItem
                className={validationErrors.location ? "ion-invalid" : ""}
              >
                <IonLabel position="stacked">
                  Location <span style={{ color: "#eb445a" }}>*</span>
                </IonLabel>

                <IonGrid>
                  <IonRow>
                    <IonCol size="8">
                      {coordinates ? (
                        <IonChip color="success">
                          <IonIcon icon={locationOutline} />
                          <IonLabel>GPS coordinates captured</IonLabel>
                        </IonChip>
                      ) : (
                        <p>Please capture your GPS coordinates</p>
                      )}
                    </IonCol>
                    <IonCol size="4">
                      <IonButton onClick={getCurrentLocation} expand="block">
                        <IonIcon slot="start" icon={location} />
                        GPS
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>

                {coordinates && (
                  <div style={{ padding: "10px 0", fontSize: "0.9rem" }}>
                    <p style={{ margin: 0, color: "#2dd36f" }}>
                      <strong>Lat:</strong> {coordinates.latitude.toFixed(6)},
                      <strong> Long:</strong> {coordinates.longitude.toFixed(6)}
                      <br />
                      <small>
                        Accuracy: ±{Math.round(coordinates.accuracy)}m
                      </small>
                    </p>
                  </div>
                )}

                <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                  Optionally, you can describe the location:
                </p>
                <IonTextarea
                  value={formData.location}
                  onIonChange={(e) =>
                    handleInputChange("location", e.detail.value || "")
                  }
                  placeholder="Example: 2km north of Helena shelter"
                />

                {validationErrors.location && (
                  <div
                    className="ion-padding-start"
                    style={{ color: "#eb445a", fontSize: "0.8rem" }}
                  >
                    {validationErrors.location}
                  </div>
                )}
              </IonItem>

              {/* Issue Description */}
              <IonItem>
                <IonLabel position="stacked">
                  Issue Description <span style={{ color: "#eb445a" }}>*</span>
                </IonLabel>
                <IonTextarea
                  value={formData.comments}
                  onIonChange={(e) =>
                    handleInputChange("comments", e.detail.value || "")
                  }
                  placeholder="Please describe the issue in detail"
                  rows={4}
                  className={validationErrors.comments ? "ion-invalid" : ""}
                />
                {validationErrors.comments && (
                  <div
                    className="ion-padding-start"
                    style={{ color: "#eb445a", fontSize: "0.8rem" }}
                  >
                    {validationErrors.comments}
                  </div>
                )}
              </IonItem>

              {/* Photo Section */}
              <IonItem lines="none">
                <IonLabel position="stacked">Photo (Optional)</IonLabel>
                <IonButton
                  expand="block"
                  color="medium"
                  className="ion-margin-top"
                  onClick={() => setShowActionSheet(true)}
                >
                  <IonIcon slot="start" icon={camera} />
                  {photo ? "Change Photo" : "Add Photo"}
                </IonButton>

                {photo && (
                  <div className="ion-margin-top">
                    <img
                      src={photo}
                      alt="Issue"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        display: "block",
                        margin: "0 auto",
                        borderRadius: "8px",
                      }}
                    />
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
              </IonItem>
            </IonList>

            <div className="ion-padding-vertical">
              <IonButton expand="block" onClick={handleSubmit} color="primary">
                <IonIcon slot="start" icon={cloudUpload} />
                Submit Report
              </IonButton>
              <IonButton
                expand="block"
                color="secondary"
                onClick={testConnection}
                className="ion-margin-top"
              >
                Test Connection
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Action sheet for camera options */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: "Take Photo",
              icon: camera,
              handler: () => {
                takePicture(CameraSource.Camera);
              },
            },
            {
              text: "Choose from Gallery",
              icon: image,
              handler: () => {
                takePicture(CameraSource.Photos);
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

export default IssueReportForm;
