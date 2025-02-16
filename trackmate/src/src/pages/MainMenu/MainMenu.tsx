import {
  IonContent,
  IonPage,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import { useHistory } from "react-router";
import "./MainMenu.css";

const MainMenu: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Main Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="menu-container">
          <IonButton 
            expand="block" 
            size="large" 
            onClick={() => history.push("/tab1")}
          >
            QR CODE
          </IonButton>
          
          <IonButton 
            expand="block" 
            size="large" 
            onClick={() => history.push("/tab2")}
          >
            SURVEY
          </IonButton>
          
          <IonButton 
            expand="block" 
            size="large" 
            onClick={() => history.push("/tab3")}
          >
            ISSUE REPORTING
          </IonButton>
          
          <IonButton 
            expand="block" 
            size="large" 
            onClick={() => history.push("/faq")}
          >
            FAQ
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MainMenu; 