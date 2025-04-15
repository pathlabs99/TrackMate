/**
 * @fileoverview FAQ page component for the TrackMate mobile app.
 * @author Marwa
 * @module pages/FAQ
 * @description A comprehensive FAQ page that provides searchable answers to common
 * questions about TrackMate and the Bibbulmun Track.
 * 
 * @note Developer Handover
 * The following can be customized:
 * 1. Content Management
 *    - FAQ entries are stored in faqData array
 *    - Update questions and answers as needed
 * 2. Contact Information
 *    - Update support email in subtitle text
 * 3. Search Functionality
 *    - Currently searches both questions and answers
 *    - Search behavior can be modified if needed
 */

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
import { motion, AnimatePresence } from "framer-motion";

/**
 * @interface FAQItem
 * @description Represents a single FAQ entry with question and answer
 */
interface FAQItem {
  question: string;
  answer: string;
}

/**
 * @component FAQ
 * @description FAQ page with searchable questions and answers
 * Features include:
 * - Searchable FAQ entries
 * - Expandable/collapsible answers
 * - Expand/collapse all functionality
 * - Smooth animations and transitions
 * - Responsive card layout
 * 
 * @returns {JSX.Element} FAQ page component
 */
const FAQ: React.FC = () => {
  /**
   * @state searchText
   * @description Current search query for filtering FAQs
   */
  const [searchText, setSearchText] = useState("");

  /**
   * @state expandedItems
   * @description Tracks which FAQ items are expanded
   */
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  /**
   * @constant faqData
   * @description Array of FAQ items with questions and answers
   * @type {FAQItem[]}
   */
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

  /**
   * @function toggleItem
   * @description Toggles the expanded state of a specific FAQ item
   * @param {number} index - Index of the FAQ item to toggle
   */
  const toggleItem = (index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  /**
   * @function expandAll
   * @description Expands all currently filtered FAQ items
   */
  const expandAll = () => {
    const expanded: { [key: string]: boolean } = {};
    faqData.forEach((_, index) => {
      expanded[index] = true;
    });
    setExpandedItems(expanded);
  };

  /**
   * @function collapseAll
   * @description Collapses all FAQ items
   */
  const collapseAll = () => {
    setExpandedItems({});
  };

  /**
   * @constant filteredFAQs
   * @description FAQs filtered based on search text
   */
  const filteredFAQs = faqData.filter(item =>
    item.question.toLowerCase().includes(searchText.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchText.toLowerCase())
  );

  /**
   * @constant isAllExpanded
   * @description Checks if all filtered FAQs are currently expanded
   */
  const isAllExpanded = filteredFAQs.length > 0 && 
    filteredFAQs.every((_, index) => expandedItems[index]);

  // Animation variants for smoother transitions
  const iconVariants = {
    collapsed: { rotate: 0, scale: 1 },
    expanded: { rotate: 90, scale: 1.1 }
  };

  const contentVariants = {
    collapsed: { 
      height: 0,
      opacity: 0,
      y: -10,
      transition: { 
        height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.15 },
        y: { duration: 0.15 }
      }
    },
    expanded: { 
      height: "auto",
      opacity: 1,
      y: 0,
      transition: { 
        height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.25, delay: 0.1 },
        y: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
      }
    }
  };

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
                  <div className="faq-question-container">
                    <IonLabel className="ion-text-wrap faq-question">
                      <h2>{item.question}</h2>
                    </IonLabel>
                  </div>
                  <motion.div
                    className="icon-container"
                    variants={iconVariants}
                    initial="collapsed"
                    animate={expandedItems[index] ? "expanded" : "collapsed"}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      duration: 0.3
                    }}
                    slot="end"
                  >
                    <IonIcon
                      icon={chevronForward}
                      className="transition-icon"
                    />
                  </motion.div>
                </IonItem>
                <AnimatePresence initial={false}>
                  {expandedItems[index] && (
                    <motion.div 
                      className="faq-answer"
                      key={`answer-${index}`}
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      layout
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
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
