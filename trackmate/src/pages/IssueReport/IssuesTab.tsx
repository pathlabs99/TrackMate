/**
 * @fileoverview Issues Tab container component for the TrackMate mobile app.
 * @author Marwa
 * @module pages/IssueReport
 * @description A container component that wraps the IssueReport form within an
 * IonPage for proper integration with Ionic's tab-based navigation.
 * 
 * @note Developer Handover
 * This is a simple wrapper component that:
 * 1. Provides the IonPage container required by Ionic
 * 2. Renders the IssueReport form component
 * 3. Can be extended to add tab-specific features if needed
 */

import React from "react";
import IssueReportForm from "./IssueReport";
import { IonPage, IonContent } from "@ionic/react";

/**
 * @component IssuesTab
 * @description Container component that wraps the IssueReport form in an IonPage
 * This wrapper is necessary for proper integration with Ionic's tab-based navigation
 * system and ensures correct page layout and transitions.
 * 
 * @returns {JSX.Element} Issues tab container component
 */
const IssuesTab: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <IssueReportForm />
      </IonContent>
    </IonPage>
  );
};

export default IssuesTab;
