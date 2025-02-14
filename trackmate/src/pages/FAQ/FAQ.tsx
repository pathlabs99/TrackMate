/*  FAQ component with a list of questions and answers ¨
Uses ionic accordion to display the questions and answers
https://ionicframework.com/docs/api/accordion
*/

import React from "react";
import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";

function FAQ() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>FAQ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonAccordionGroup>
          <IonAccordion value="first">
            <IonItem slot="header" color="light">
              <IonLabel>Question 1</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              Answer 1.
            </div>
          </IonAccordion>

          <IonAccordion value="second">
            <IonItem slot="header" color="light">
              <IonLabel>Question 2</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              Answer 2.
            </div>
          </IonAccordion>

          <IonAccordion value="third">
            <IonItem slot="header" color="light">
              <IonLabel>Question 3</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              Answer 3
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
}

export default FAQ;
