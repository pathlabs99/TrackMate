import React from "react";
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
const IssueReportForm: React.FC = () => {
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
              {/* Name field */}
              <IonItem>
                <IonLabel position="stacked">
                  Name <span style={{ color: "#eb445a" }}>*</span>
                </IonLabel>
                <IonInput placeholder="Your full name" required={true} />
              </IonItem>

              {/* Email field */}
              <IonItem>
                <IonLabel position="stacked">
                  Email <span style={{ color: "#eb445a" }}>*</span>
                </IonLabel>
                <IonInput
                  type="email"
                  placeholder="Your email address"
                  required={true}
                />
              </IonItem>

              {/* Telephone field */}
              <IonItem>
                <IonLabel position="stacked">Telephone</IonLabel>
                <IonInput type="tel" placeholder="Phone number" />
              </IonItem>

              {/* Date Observed field */}
              <IonItem>
                <IonLabel position="stacked">
                  When was the problem observed?{" "}
                  <span style={{ color: "#eb445a" }}>*</span>
                </IonLabel>
                <IonInput placeholder="DD/MM/YYYY" />
              </IonItem>

              {/* Location field */}
              <IonItem>
                <IonLabel position="stacked">
                  Where was the problem?{" "}
                  <span style={{ color: "#eb445a" }}>*</span>
                </IonLabel>
                <IonTextarea
                  placeholder="Give GPS coordinates, Guidebook Track Note or accurate distance from landmark (e.g campsite or vehicle access point)"
                  rows={3}
                  required={true}
                />
              </IonItem>

              {/* Comments field */}
              <IonItem>
                <IonLabel position="stacked">
                  Comments <span style={{ color: "#eb445a" }}>*</span>
                </IonLabel>
                <IonTextarea
                  placeholder="Describe the issue in detail"
                  rows={6}
                  required={true}
                />
              </IonItem>
            </IonList>

            <div className="ion-padding-top">
              <IonButton expand="block" type="submit">
                Submit Report
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default IssueReportForm;
