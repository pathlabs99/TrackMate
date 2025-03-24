import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonCard,
  IonCardContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonRippleEffect,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonText,
  IonButton,
} from "@ionic/react";
import { 
  chevronDown, 
  chevronForward, 
  chevronUpCircleOutline, 
  chevronDownCircleOutline 
} from "ionicons/icons";
import "./FAQ.css";

const FAQ: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  const faqData = [
    {
      question: "What is TrackMate?",
      answer: "TrackMate is a mobile application designed for walkers and volunteers on the Bibbulmun Track to easily submit surveys, report trail maintenance issues, and access trail information via QR codes."
    },
    {
      question: "What devices are supported?",
      answer: "Currently, TrackMate is available for Android devices."
    },
    {
      question: "Can I use the app without an internet connection?",
      answer: "Yes! TrackMate is designed to work offline. Surveys, issue reports, and QR code data are stored locally and synced when internet access is available."
    },
    {
      question: "How does the app contribute to environmental sustainability?",
      answer: "TrackMate helps reduce paper waste by eliminating paper-based surveys and encouraging digital feedback, aligning with BTF's sustainability goals."
    },
    {
      question: "How do I submit a survey?",
      answer: "You can submit a survey by:\n1. Opening the Survey section in the app and filling out the required details.\n2. If you're offline, the survey will be saved and submitted automatically once you regain internet access."
    },
    {
      question: "How do I report a maintenance issue?",
      answer: "To report an issue:\n1. Open the Issue Reporting section.\n2. Select the issue category (e.g., fallen tree, damaged sign, erosion).\n3. (Optional) Upload a photo of the issue.\n4. Submit the report. If you're offline, it will be sent when you go online."
    },
    {
      question: "Can I edit a submitted survey or issue report?",
      answer: "No, once a survey or issue report is submitted, it cannot be edited. However, you can submit a new survey or report if needed."
    },
    {
      question: "What happens if I lose internet connection?",
      answer: "If you lose internet connectivity:\n1. Surveys and reports will be saved locally in the app.\n2. Once your device reconnects, the data will be automatically submitted to the BTF."
    },
    {
      question: "Can volunteers track the progress of reported issues?",
      answer: "Currently, the app does not provide real-time tracking of reported issues. However, the BTF will review all reports and take necessary actions."
    },
    {
      question: "What kind of information can I access via QR codes?",
      answer: "Scanning a QR code along the trail provides:\n1. Track history & Indigenous heritage information\n2. Emergency guidance (nearest campsite, road access)\n3. Trail alerts (detours, warnings, and updates)"
    },
    {
      question: "How do I scan a QR code?",
      answer: "1. Open the QR Code Scanner in the app.\n2. Point your camera at the QR code.\n3. The app will display relevant location-based information or surveys."
    },
    {
      question: "Is my personal information stored in the app?",
      answer: "No. TrackMate does not require account registration and does not collect personal information. Surveys are anonymous and stored securely."
    },
    {
      question: "How is my data submitted to the Bibbulmun Track Foundation?",
      answer: "Survey responses and issue reports are automatically sent via email to the BTF in CSV format for further analysis."
    },
    {
      question: "How do I update the app?",
      answer: "When a new version is available, you will receive a notification to update TrackMate via the Google Play Store."
    },
    {
      question: "Who can I contact for support?",
      answer: "For any issues or feedback, you can contact the Bibbulmun Track Foundation at support@bibbulmuntrack.org.au."
    }
  ];

  const toggleItem = (index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const expandAll = () => {
    const expanded: { [key: string]: boolean } = {};
    faqData.forEach((_, index) => {
      expanded[index] = true;
    });
    setExpandedItems(expanded);
  };

  const collapseAll = () => {
    setExpandedItems({});
  };

  const filteredFAQs = faqData.filter(item =>
    item.question.toLowerCase().includes(searchText.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchText.toLowerCase())
  );

  const isAllExpanded = filteredFAQs.length > 0 && 
    filteredFAQs.every((_, index) => expandedItems[index]);

  return (
    <IonPage className="gradient-background">
      <IonHeader className="ion-no-border">
        <IonToolbar className="transparent-toolbar">
          <IonTitle className="faq-title">Frequently Asked Questions</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="faq-container">
          <IonText color="medium" className="faq-subtitle">
            Find answers to common questions about TrackMate and the Bibbulmun Track. Can't find what you're looking for? Contact us at support@bibbulmuntrack.org.au
          </IonText>
          
          <IonSearchbar
            value={searchText}
            onIonInput={e => setSearchText(e.detail.value || "")}
            placeholder="Search FAQs..."
            className="custom-searchbar"
          />

          <div className="expand-collapse-container">
            {!isAllExpanded ? (
              <IonButton 
                fill="clear" 
                onClick={expandAll}
                className="expand-collapse-button"
              >
                <IonIcon slot="start" icon={chevronDownCircleOutline} />
                Expand All
              </IonButton>
            ) : (
              <IonButton 
                fill="clear" 
                onClick={collapseAll}
                className="expand-collapse-button"
              >
                <IonIcon slot="start" icon={chevronUpCircleOutline} />
                Collapse All
              </IonButton>
            )}
          </div>
          
          {filteredFAQs.map((item, index) => (
            <IonCard key={index} className="faq-card ion-activatable ripple-parent">
              <IonCardContent className="ion-no-padding">
                <IonItem
                  lines="none"
                  detail={false}
                  onClick={() => toggleItem(index)}
                  className="faq-item"
                >
                  <IonLabel className="ion-text-wrap">
                    <h2>{item.question}</h2>
                  </IonLabel>
                  <IonIcon
                    icon={expandedItems[index] ? chevronDown : chevronForward}
                    slot="end"
                    className={`transition-icon ${expandedItems[index] ? 'rotated' : ''}`}
                  />
                </IonItem>
                {expandedItems[index] && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
                <IonRippleEffect />
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FAQ;
