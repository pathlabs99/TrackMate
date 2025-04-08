import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/react';
import './ResponsiveLayout.css';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  className?: string;
  contentClassName?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  title,
  showHeader = true,
  className = '',
  contentClassName = '',
}) => {
  return (
    <IonPage className={`responsive-page ${className}`}>
      {showHeader && (
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
      )}
      <IonContent className={`responsive-content ${contentClassName}`}>
        <div className="responsive-container">
          {children}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ResponsiveLayout; 