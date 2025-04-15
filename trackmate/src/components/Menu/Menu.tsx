/**
 * @fileoverview Menu component for the TrackMate mobile app.
 * @author Marwa
 * @module components/Menu
 * @description A responsive side menu component that provides navigation and information
 * about the Bibbulmun Track Foundation and TrackMate team.
 * 
 * @note Developer Handover
 * The following items should probably be configured with more accurate BTF information:
 * 1. Contact Information
 *    - Update email address in contact section with BTF's official email
 * 2. Foundation Content
 *    - Review and update foundation information with official content
 *    - Add any additional track statistics if needed
 * 3. Social Integration
 *    - Add BTF's social media links
 */

import React, { useRef, useState } from "react";
import {
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
  IonPopover,
  IonMenuToggle,
} from "@ionic/react";
import {
  homeOutline,
  informationCircleOutline,
  peopleOutline,
  mailOutline,
  scanOutline,
  warningOutline,
  helpCircleOutline,
  documentTextOutline,
  personOutline,
  briefcaseOutline,
  libraryOutline,
  chatbubbleOutline,
  shieldOutline,
  megaphoneOutline,
  trailSignOutline,
  locationOutline,
  pricetagOutline,
} from "ionicons/icons";
import "./Menu.css";

/**
 * @interface TeamMember
 * @description Represents a team member or supervisor in the TrackMate project
 * @property {string} name - The full name of the team member
 * @property {string} role - The role/position of the team member in the project
 * @property {string} icon - The icon identifier for the team member's role
 * @property {'member' | 'supervisor'} type - The type of team member (either regular member or supervisor)
 */
interface TeamMember {
  name: string;
  role: string;
  icon: string;
  type: "member" | "supervisor";
}

/**
 * @constant {TeamMember[]} teamMembers
 * @description Array of TrackMate team members with their roles and information
 */
const teamMembers: TeamMember[] = [
  {
    name: "Marwa Artan",
    role: "Communications Officer",
    icon: megaphoneOutline,
    type: "member",
  },
  {
    name: "Wael Tartraf",
    role: "Security Coordinator",
    icon: shieldOutline,
    type: "member",
  },
  {
    name: "Abdullah Mohamed",
    role: "Software Coordinator",
    icon: briefcaseOutline,
    type: "member",
  },
  {
    name: "Steve Ellison John",
    role: "Secretary",
    icon: documentTextOutline,
    type: "member",
  },
  {
    name: "Jeremy Uduwalage",
    role: "Librarian",
    icon: libraryOutline,
    type: "member",
  },
  {
    name: "Roudah Ashfaq",
    role: "Project Activity Coordinator",
    icon: chatbubbleOutline,
    type: "member",
  },
];

/**
 * @constant {TeamMember[]} supervisors
 * @description Array of project supervisors with their roles and information
 */
const supervisors: TeamMember[] = [
  {
    name: "Peter Cole",
    role: "Unit Coordinator",
    icon: briefcaseOutline,
    type: "supervisor",
  },
  {
    name: "Noor Alkhateeb",
    role: "Project Supervisor",
    icon: personOutline,
    type: "supervisor",
  },
];

/**
 * @component Menu
 * @description Main menu component for the TrackMate application. Provides navigation
 * and information about the Bibbulmun Track Foundation and TrackMate team.
 * Features include:
 * - Navigation links to different sections of the app
 * - Information about the Bibbulmun Track Foundation
 * - Team member details with interactive popover displays
 * - Collapsible accordion sections
 * 
 * @returns {JSX.Element} A responsive side menu component
 */
const Menu: React.FC = () => {
  /**
   * @state popoverState
   * @description State for managing the team member info popover
   * @type {{ event: any; member: TeamMember | null }}
   */
  const [popoverState, setPopoverState] = useState<{
    event: any;
    member: TeamMember | null;
  }>({
    event: null,
    member: null,
  });

  /**
   * @ref accordionGroupRef
   * @description Reference to the IonAccordionGroup element for controlling accordion state
   */
  const accordionGroupRef = useRef<HTMLIonAccordionGroupElement>(null);

  /**
   * @function handleMenuWillClose
   * @description Handles the menu closing event by collapsing all accordions
   */
  const handleMenuWillClose = () => {
    // Collapse all accordions when menu closes
    if (accordionGroupRef.current) {
      accordionGroupRef.current.value = undefined;
    }
  };

  /**
   * @function handleDismiss
   * @description Handles the dismissal of the team member info popover
   */
  const handleDismiss = () => {
    setPopoverState({ event: null, member: null });
  };

  return (
    <div className="menu-wrapper">
      <IonMenu
        contentId="main-content"
        type="overlay"
        onIonWillClose={handleMenuWillClose}
      >
        <IonContent>
          <div className="menu-container">
            <IonList className="menu-list" lines="none">
              <IonMenuToggle autoHide={false}>
                <IonItem
                  routerLink="/menu"
                  className="menu-item active"
                  lines="none"
                  routerDirection="none"
                >
                  <IonIcon icon={homeOutline} slot="start" />
                  <IonLabel>Home</IonLabel>
                </IonItem>
              </IonMenuToggle>

              <IonAccordionGroup ref={accordionGroupRef}>
                <IonAccordion value="about">
                  <IonItem slot="header" className="menu-item" lines="none">
                    <IonIcon icon={informationCircleOutline} slot="start" />
                    <IonLabel>About the Foundation</IonLabel>
                  </IonItem>

                  <div slot="content" className="submenu-content">
                    <IonList lines="none">
                      <div className="foundation-info">
                        <div className="foundation-description">
                          <p>
                            The Bibbulmun Track Foundation maintains and
                            preserves one of the world's great long-distance
                            walking trails, stretching 1000km from Kalamunda to
                            Albany through Western Australia.
                          </p>
                        </div>
                        <div className="foundation-stats">
                          <div className="stat-item">
                            <IonIcon
                              icon={trailSignOutline}
                              className="stat-icon trail-icon"
                            />
                            <span className="stat-value">1000</span>
                            <span className="stat-label">km</span>
                          </div>
                          <div className="stat-item">
                            <IonIcon
                              icon={locationOutline}
                              className="stat-icon location-icon"
                            />
                            <span className="stat-value">9</span>
                            <span className="stat-label">sections</span>
                          </div>
                          <div className="stat-item">
                            <IonIcon
                              icon={pricetagOutline}
                              className="stat-icon tent-icon"
                            />
                            <span className="stat-value">49</span>
                            <span className="stat-label">camps</span>
                          </div>
                        </div>
                      </div>
                    </IonList>
                  </div>
                </IonAccordion>

                <IonAccordion value="team">
                  <IonItem slot="header" className="menu-item" lines="none">
                    <IonIcon icon={peopleOutline} slot="start" />
                    <IonLabel>About TrackMate</IonLabel>
                  </IonItem>

                  <div slot="content" className="submenu-content">
                    <IonList lines="none">
                      <div className="team-group">
                        <h3 className="section-title">Description</h3>
                        <div className="description-container">
                          <IonItem lines="none" className="description-item">
                            <div className="description-content">
                              <p className="team-description">
                                TrackMate is a student-built app created to
                                support walkers on the Bibbulmun Track.
                                <br />
                                <br />
                                Developed by pathlabs, a team of students from
                                Murdoch University Dubai, as part of their IT
                                Professional Practice Project.
                              </p>
                            </div>
                          </IonItem>
                        </div>
                        <h3 className="section-title">Team Members</h3>
                        <div className="team-members">
                          {teamMembers.map((member, index) => (
                            <IonItem
                              key={index}
                              button
                              detail={false}
                              className="team-member"
                              lines="none"
                              routerDirection="none"
                              onClick={(e) =>
                                setPopoverState({
                                  event: e.nativeEvent,
                                  member,
                                })
                              }
                            >
                              <div className="member-avatar">🎓</div>
                              <IonLabel>
                                <h3 className="member-name">{member.name}</h3>
                              </IonLabel>
                            </IonItem>
                          ))}
                        </div>
                        <div className="special-thanks">
                          <h3 className="section-title">Special Thanks to</h3>
                          <div className="team-members">
                            {supervisors.map((supervisor, index) => (
                              <IonItem
                                key={index}
                                button
                                detail={false}
                                className="team-member"
                                lines="none"
                                routerDirection="none"
                                onClick={(e) =>
                                  setPopoverState({
                                    event: e.nativeEvent,
                                    member: supervisor,
                                  })
                                }
                              >
                                <div className="member-avatar">⭐</div>
                                <IonLabel>
                                  <h3 className="member-name">
                                    {supervisor.name}
                                  </h3>
                                </IonLabel>
                              </IonItem>
                            ))}
                          </div>
                        </div>
                      </div>
                    </IonList>
                  </div>
                </IonAccordion>
              </IonAccordionGroup>

              <div className="menu-divider"></div>
              <div className="section-label">QUICK LINKS</div>

              <IonMenuToggle autoHide={false}>
                <IonItem
                  routerLink="/scan"
                  className="menu-item"
                  lines="none"
                  routerDirection="none"
                >
                  <IonIcon icon={scanOutline} slot="start" />
                  <IonLabel>Scan</IonLabel>
                </IonItem>
              </IonMenuToggle>

              <IonMenuToggle autoHide={false}>
                <IonItem
                  routerLink="/issues"
                  className="menu-item"
                  lines="none"
                  routerDirection="none"
                >
                  <IonIcon icon={warningOutline} slot="start" />
                  <IonLabel>Issues</IonLabel>
                </IonItem>
              </IonMenuToggle>

              <IonMenuToggle autoHide={false}>
                <IonItem
                  routerLink="/survey"
                  className="menu-item"
                  lines="none"
                  routerDirection="none"
                >
                  <IonIcon icon={documentTextOutline} slot="start" />
                  <IonLabel>Survey</IonLabel>
                </IonItem>
              </IonMenuToggle>

              <IonMenuToggle autoHide={false}>
                <IonItem
                  routerLink="/faq"
                  className="menu-item"
                  lines="none"
                  routerDirection="none"
                >
                  <IonIcon icon={helpCircleOutline} slot="start" />
                  <IonLabel>FAQ</IonLabel>
                </IonItem>
              </IonMenuToggle>

              <div className="menu-divider"></div>
              <div className="section-label">CONTACT US</div>

              <IonAccordionGroup>
                <IonAccordion value="contact">
                  <IonItem slot="header" className="menu-item" lines="none">
                    <IonIcon icon={mailOutline} slot="start" />
                    <IonLabel>Write to Us</IonLabel>
                  </IonItem>

                  <div slot="content" className="submenu-content">
                    <IonList lines="none">
                      <div className="contact-info">
                        <p className="contact-message">
                          Have questions or feedback? We'd love to hear from
                          you! Get in touch with our team for support,
                          suggestions, or any inquiries.
                        </p>
                        <div className="contact-email">
                          <IonIcon icon={mailOutline} />
                          {/* NOTE: Replace this with your official contact email */}
                          <a href="mailto:pathlabs99@gmail.com">
                            pathlabs99@gmail.com
                          </a>
                        </div>
                      </div>
                    </IonList>
                  </div>
                </IonAccordion>
              </IonAccordionGroup>
              <div className="menu-footer">
                <div className="university-text">
                  Murdoch University Dubai • ICT 302 • IT Professional Practice
                  Project 2025
                </div>
              </div>
            </IonList>
          </div>
        </IonContent>
      </IonMenu>

      <IonPopover
        isOpen={!!popoverState.event}
        event={popoverState.event}
        onDidDismiss={handleDismiss}
        className="member-popover"
      >
        <div className="member-popover-content">
          <div className="member-popover-role">
            <IonIcon icon={popoverState.member?.icon} />
            <span>{popoverState.member?.role}</span>
          </div>
        </div>
      </IonPopover>
    </div>
  );
};

export default Menu;
