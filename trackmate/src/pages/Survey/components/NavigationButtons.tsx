/**
 * @fileoverview Navigation buttons component for the TrackMate survey.
 * @author Abdullah
 * @date 2025-04-13
 * @filename NavigationButtons.tsx
 *
 * This file contains the NavigationButtons component which provides standardized
 * navigation controls for moving between survey questions.
 */

import React from "react";
import { IonButton } from "@ionic/react";

/**
 * Props interface for the NavigationButtons component
 */
interface NavigationButtonsProps {
  /** Callback function for the previous button */
  onPrev: () => void;
  /** Callback function for the next button */
  onNext: () => void;
  /** Optional custom label for the previous button */
  prevLabel?: string;
  /** Optional custom label for the next button */
  nextLabel?: string;
  /** Flag to disable the next button */
  disableNext?: boolean;
  /** Flag to disable the previous button */
  disablePrev?: boolean;
}

/**
 * NavigationButtons component that provides standardized navigation controls
 * for moving between survey questions or sections
 * 
 * @param onPrev - Callback function for the previous button
 * @param onNext - Callback function for the next button
 * @param prevLabel - Optional custom label for the previous button, defaults to "Previous"
 * @param nextLabel - Optional custom label for the next button, defaults to "Next"
 * @param disableNext - Flag to disable the next button, defaults to false
 * @param disablePrev - Flag to disable the previous button, defaults to false
 */
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
