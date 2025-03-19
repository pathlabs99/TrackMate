import React from "react";
import { IonButton } from "@ionic/react";

interface NavigationButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  prevLabel?: string;
  nextLabel?: string;
  disableNext?: boolean;
  disablePrev?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrev,
  onNext,
  prevLabel = "Previous",
  nextLabel = "Next",
  disableNext = false,
  disablePrev = false,
}) => {
  return (
    <div className="navigation-container">
      <IonButton
        className="prev-button"
        onClick={onPrev}
        disabled={disablePrev}
      >
        {prevLabel}
      </IonButton>
      <IonButton
        className="next-button"
        onClick={onNext}
        disabled={disableNext}
      >
        {nextLabel}
      </IonButton>
    </div>
  );
};

export default NavigationButtons;
