import React, { useState } from "react";
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
} from "@ionic/react";

/*
 * IssueReportForm - Component for TrackMate that provides
 * a form interface for users to report issues or problems encountered
 * on the track . Collects user information, issue location,
 * date, and problem details.
 *
 * @authors:
 * - Marwa (initial implementation, 21/02/25)
 * - Wael (email submission functionality, 03/03/25)
 *
 * Features implemented:
 * - Basic form validation for required fields
 * - Email validation
 * - CSV conversion of form data
 * - Basic API integration for email submission
 * - Loading indicator and toast notifications
 *
 * TO-DO:
 * - Error handling and retry logic
 * - Implement geolocation to auto-fill coordinates
 * - Add file upload for photos of issues // not sure if needed
 * - Add offline support with local storage
 */

interface IssueFormData {
  name: string;
  email: string;
  telephone: string;
  dateObserved: string;
  location: string;
  comments: string;
}

// Use relative path instead of full URL
const API_URL = "https://1bb7-2-49-133-227.ngrok-free.app";

const IssueReportForm: React.FC = () => {
  const [formData, setFormData] = useState<IssueFormData>({
    name: "",
    email: "",
    telephone: "",
    dateObserved: "",
    location: "",
    comments: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const convertToCSV = (data: IssueFormData): string => {
    const headers = [
      "Name",
      "Email",
      "Telephone",
      "Date Observed",
      "Location",
      "Comments",
    ];
    const values = [
      data.name,
      data.email,
      data.telephone,
      data.dateObserved,
      data.location,
      data.comments,
    ];
    return `${headers.join(",")}\n${values.join(",")}`;
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.dateObserved ||
      !formData.location ||
      !formData.comments
    ) {
      setToastMessage("Please fill in all required fields");
      setShowToast(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setToastMessage("Please enter a valid email address");
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      const csvData = convertToCSV(formData);
      const fileName = `issue_report_${
        new Date().toISOString().split("T")[0]
      }.csv`;

      console.log("Attempting to submit report to:", `${API_URL}/send-report`);

      const response = await fetch(`${API_URL}/send-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          csvData,
          fileName,
        }),
      });

      console.log("Response status:", response.status);
      const responseData = await response.text();
      console.log("Response data:", responseData);

      if (response.ok) {
        setToastMessage("Report submitted successfully");
        setFormData({
          name: "",
          email: "",
          telephone: "",
          dateObserved: "",
          location: "",
          comments: "",
        });
      } else {
        throw new Error(
          `Failed to submit report: ${response.status} ${responseData}`
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      setToastMessage(`Failed to submit report: ${error.message}`);
    } finally {
      setLoading(false);
      setShowToast(true);
    }
  };

  const testConnection = async () => {
    try {
      setLoading(true);
      console.log("Testing connection to:", `${API_URL}/test`);

      const response = await fetch(`${API_URL}/test`, {
        headers: {
          Accept: "application/json",
        },
      });

      const responseData = await response.text();
      console.log("Test response status:", response.status);
      console.log("Test response data:", responseData);

      alert(
        `Connection test result:\nStatus: ${response.status}\nResponse: ${responseData}\nAPI URL: ${API_URL}`
      );
    } catch (error) {
      console.error("Connection test error:", error);
      alert(`Connection test failed:\n${error.message}\nAPI URL: ${API_URL}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof IssueFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Track Issue Report</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Report an Issue</IonCardTitle>
            <p style={{ marginTop: "10px", fontSize: "14px" }}>
              <span style={{ color: "#eb445a" }}>*</span> Required fields
            </p>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
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
                  required={true}
                />
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
                  required={true}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Telephone</IonLabel>
                <IonInput
                  type="tel"
                  value={formData.telephone}
                  onIonChange={(e) =>
                    handleInputChange("telephone", e.detail.value || "")
                  }
                  placeholder="Your phone number"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">
                  Date Observed <span style={{ color: "#eb445a" }}>*</span>
                </IonLabel>
                <IonInput
                  value={formData.dateObserved}
                  onIonChange={(e) =>
                    handleInputChange("dateObserved", e.detail.value || "")
                  }
                  placeholder="DD/MM/YYYY"
                  required={true}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">
                  Location <span style={{ color: "#eb445a" }}>*</span>
                </IonLabel>
                <IonTextarea
                  value={formData.location}
                  onIonChange={(e) =>
                    handleInputChange("location", e.detail.value || "")
                  }
                  placeholder="Describe the location"
                  required={true}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">
                  Comments <span style={{ color: "#eb445a" }}>*</span>
                </IonLabel>
                <IonTextarea
                  value={formData.comments}
                  onIonChange={(e) =>
                    handleInputChange("comments", e.detail.value || "")
                  }
                  placeholder="Describe the issue"
                  required={true}
                />
              </IonItem>
            </IonList>

            <div className="ion-padding-top">
              <IonButton expand="block" onClick={handleSubmit}>
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

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
        />

        <IonLoading isOpen={loading} message="Please wait..." />
      </IonContent>
    </IonPage>
  );
};

export default IssueReportForm;
