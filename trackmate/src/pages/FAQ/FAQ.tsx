/*
 * FAQ Component - Displays frequently asked questions about the TrackMate app
 * Organizes questions into categories and uses Ionic accordion for expandable Q&A
 *
 * @author: Marwa
 * @date: February 21, 2025
 *
 * Uses ionic accordion to display the questions and answers
 * https://ionicframework.com/docs/api/accordion
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";

function FAQ() {
  /* FAQ data organized by category */
  const faqCategories = [
    {
      title: "General Questions",
      items: [
        {
          question: "What is TrackMate?",
          answer:
            "TrackMate is a mobile application designed for walkers and volunteers on the Bibbulmun Track to easily submit surveys, report trail maintenance issues, and access trail information via QR codes.",
        },
        {
          question: "What devices are supported?",
          answer: "Currently, TrackMate is available for Android devices.",
        },
        {
          question: "Can I use the app without an internet connection?",
          answer:
            "Yes! TrackMate is designed to work offline. Surveys, issue reports, and QR code data are stored locally and synced when internet access is available.",
        },
        {
          question:
            "How does the app contribute to environmental sustainability?",
          answer:
            "TrackMate helps reduce paper waste by eliminating paper-based surveys and encouraging digital feedback, aligning with BTF's sustainability goals.",
        },
      ],
    },
    {
      title: "Survey & Issue Reporting",
      items: [
        {
          question: "How do I submit a survey?",
          answer:
            "You can submit a survey by:\n1. Opening the Survey section in the app and filling out the required details.\n2. If you're offline, the survey will be saved and submitted automatically once you regain internet access.",
        },
        {
          question: "How do I report a maintenance issue?",
          answer:
            "To report an issue:\n1. Open the Issue Reporting section.\n2. Select the issue category (e.g., fallen tree, damaged sign, erosion).\n3. (Optional) Upload a photo of the issue.\n4. Submit the report. If you're offline, it will be sent when you go online.",
        },
        {
          question: "Can I edit a submitted survey or issue report?",
          answer:
            "No, once a survey or issue report is submitted, it cannot be edited. However, you can submit a new survey or report if needed.",
        },
        {
          question:
            "What happens if I lose internet connection while using the app?",
          answer:
            "If you lose internet connectivity:\n1. Surveys and reports will be saved locally in the app.\n2. Once your device reconnects, the data will be automatically submitted to the BTF.",
        },
        {
          question: "Can volunteers track the progress of reported issues?",
          answer:
            "Currently, the app does not provide real-time tracking of reported issues. However, the BTF will review all reports and take necessary actions.",
        },
      ],
    },
    {
      title: "QR Code Features",
      items: [
        {
          question: "What kind of information can I access via QR codes?",
          answer:
            "Scanning a QR code along the trail provides:\n1. Track history & Indigenous heritage information\n2. Emergency guidance (nearest campsite, road access)\n3. Trail alerts (detours, warnings, and updates)",
        },
        {
          question: "How do I scan a QR code?",
          answer:
            "1. Open the QR Code Scanner in the app.\n2. Point your camera at the QR code.\n3. The app will display relevant location-based information or surveys.",
        },
      ],
    },
    {
      title: "Privacy & Data Submission",
      items: [
        {
          question: "Is my personal information stored in the app?",
          answer:
            "No. TrackMate does not require account registration and does not collect personal information. Surveys are anonymous and stored securely.",
        },
        {
          question:
            "How is my data submitted to the Bibbulmun Track Foundation?",
          answer:
            "Survey responses and issue reports are automatically sent via email to the BTF in CSV format for further analysis.",
        },
      ],
    },
    {
      title: "App Updates & Support",
      items: [
        {
          question: "How do I update the app?",
          answer:
            "When a new version is available, you will receive a notification to update TrackMate via the Google Play Store.",
        },
        {
          question: "Who can I contact for support?",
          answer:
            "For any issues or feedback, you can contact the Bibbulmun Track Foundation at support@bibbulmuntrack.org.au.",
        },
      ],
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Frequently Asked Questions</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Page title */}
        <h1 className="ion-padding-start ion-padding-top">
          TrackMate App – Frequently Asked Questions (FAQ)
        </h1>

        {/* Render each category with its corresponding questions */}
        {faqCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="ion-margin-bottom">
            {/* Category title */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{category.title}</IonCardTitle>
              </IonCardHeader>

              {/* Questions for this category */}
              <IonAccordionGroup>
                {category.items.map((item, itemIndex) => (
                  <IonAccordion
                    key={itemIndex}
                    value={`${categoryIndex}-${itemIndex}`}
                  >
                    <IonItem slot="header" color="light">
                      <IonLabel>{item.question}</IonLabel>
                    </IonItem>
                    <div
                      className="ion-padding"
                      slot="content"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {item.answer}
                    </div>
                  </IonAccordion>
                ))}
              </IonAccordionGroup>
            </IonCard>
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
}

export default FAQ;
