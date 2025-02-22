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
 * @author: Marwa
 * @date: 21/02/25
 *
 * TODO:
 * - Add form validation and error handling
 * - Implement form submission to backend service
 * - Add loading state indicator during submission
 * - Add success/error notifications after submission
 * - Implement geolocation to auto-fill coordinates
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
