import React, { useState, useRef, useEffect } from "react";
import {
  IonButton,
  IonLoading,
  IonToast,
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
  IonInput,
  IonCheckbox,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// Import components
import SurveyCard from "./components/SurveyCard";

// Import services and utilities
import SurveyService from "./services/SurveyService";
import { FormData } from "./models/FormData";
import { isOnline } from "./utils/Network";

// Import CSS
import "./Survey.css";

// Define the initial form data
const initialFormData: FormData = {
  lastVisitDate: "",
  visitedLastFourWeeks: "",
  walkDuration: "",
  heardOfFoundation: "",
  farmStay: "",
  resort: "",
  otherAccommodation: "",
  otherAccommodationNights: "",
  promptedToWalk: [],
  transportUsed: "",
  tripType: "",
  satisfaction: "",
  gender: "",
  otherTransport: "",
  tripDuration: "",
  numberOfNights: "",
  noStay: "",
  selfContained: "",
  trackTent: "",
  trackShelter: "",
  backpackers: "",
  hotel: "",
  bnb: "",
  familyFriends: "",
  otherCampsite: "",
  logbookRecord: "",
  numberOfTrips: "",
  numberOfFullDays: "",
  numberOfHalfDays: "",
  otherCost: "",
  mapsCost: "",
  activitiesCost: "",
  mealsOutCost: "",
  accommodationCost: "",
  foodSuppliesCost: "",
  travelCost: "",
  equipmentCost: "",
  expenseTiming: "",
  numberOfPeople: "",
  bushwalkingExpense: "",
  customPoints: "",
  finishPoint: "",
  startPoint: "",
  trackDistance: "",
  residence: "",
  stateTerritory: "",
  overseasCountry: "",
  otherOverseasCountry: "",
  decisionTime: "",
  postcode: "",
  intendToWalkAgain: "",
  bibbulmunMainReason: "",
  ageGroup: "",
  otherTravelGroup: "",
  travelGroup: [],
  childrenUnder4Count: "",
  adultCount: "",
  children5to17Count: "",
  recommendToFriends: "",
  noneStay: "",
  agreement_0: "",
  agreement_1: "",
  agreement_2: "",
  agreement_3: "",
  agreement_4: "",
  agreement_5: "",
  agreement_6: "",
  agreement_7: "",
  agreement_8: "",
  agreement_9: "",
  agreement_10: "",
  agreement_11: "",
  agreement_12: "",
  society_agreement_0: "",
  society_agreement_1: "",
  society_agreement_2: "",
  society_agreement_3: "",
  society_agreement_4: "",
  society_agreement_5: "",
  society_agreement_6: "",
  society_agreement_7: "",
  submitted: false,
};

const Survey: React.FC = () => {
  // Form data state
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.on("slideChange", () =>
        setCurrentSlide(swiperRef.current.activeIndex)
      );
    }
    retryPendingSubmissions();
  }, []);

  // Handle input changes for all form fields
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement> | any,
    field?: string
  ) => {
    const name = event.target?.name || field;
    const value =
      event.detail?.value !== undefined
        ? event.detail.value
        : event.target?.value;
    const checked =
      event.detail?.checked !== undefined
        ? event.detail.checked
        : event.target?.checked;

    let updatedValue: any = value;

    if (name === "promptedToWalk" || name === "travelGroup") {
      const currentValue =
        (formData[name as keyof FormData] as string[]) || [];
      updatedValue = checked
        ? [...currentValue, value]
        : currentValue.filter((item: string) => item !== value);
    }

    if (name === "heardOfFoundation") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (value === "No") {
        swiperRef.current?.slideTo(1);
        return;
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: updatedValue,
      }));
    }

    // Validate field if needed
    validateField(name, updatedValue);
  };

  // Validate a field and update errors
  const validateField = (name: string, value: any) => {
    let error = "";

    if (name === "visitedLastFourWeeks" && !value) {
      error = "Please select an option";
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error;
  };

  const handleStartSurvey = () => {
    swiperRef.current?.slideTo(2); // Skip to first real question
  };

  const resetFormAndGoToStart = () => {
    setFormData({ ...initialFormData, submitted: false });
    setErrors({});
    swiperRef.current?.slideTo(0);
  };

  // Placeholder for pending submissions retry
  const retryPendingSubmissions = async () => {
    try {
      const online = await isOnline();
      if (online) {
        // Implement your retry logic here
      }
    } catch (error) {
      // Silently handle errors as logging is removed
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    // Check if required fields are populated
    const requiredFields = [
      "visitedLastFourWeeks",
      "heardOfFoundation",
      "transportUsed",
    ];
    const isFormValid = requiredFields.every(
      (field) => formData[field as keyof FormData]
    );
  
    if (!isFormValid) {
      setToastMessage("Please fill out all required fields.");
      setShowToast(true);
      return;
    }
  
    setIsLoading(true);
    try {
      const online = await isOnline();
      if (online) {
        await SurveyService.submitSurvey(formData);
        setToastMessage("✓ Survey was submitted as CSV");
      } else {
        await SurveyService.saveOffline(formData);
        setToastMessage(
          "Survey saved locally as CSV and will be sent when internet is restored"
        );
      }
    } catch (error) {
      await SurveyService.saveOffline(formData);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setToastMessage(`Error submitting survey: ${errorMessage}. Saved locally as CSV`);
    } finally {
      setIsLoading(false);
      setShowToast(true);
      setFormData((prev) => ({ ...prev, submitted: true }));
      
      
      // Add a slight delay before resetting to ensure UI renders properly
      setTimeout(() => {
        setFormData(initialFormData);
        setErrors({});
        swiperRef.current?.slideTo(0);
      }, 300); // 300ms delay
    }

    setIsLoading(true);
    try {
      const online = await isOnline();
      if (online) {
        await SurveyService.submitSurvey(formData);
        setToastMessage("✓ Survey was submitted as CSV");
      } else {
        await SurveyService.saveOffline(formData);
        setToastMessage(
          "Survey saved locally as CSV and will be sent when internet is restored"
        );
      }
    } catch (error) {
      await SurveyService.saveOffline(formData);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setToastMessage(`Error submitting survey: ${errorMessage}. Saved locally as CSV`);
    } finally {
      setIsLoading(false);
      setShowToast(true);
    }

    resetFormAndGoToStart();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Survey</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="survey-page">
          <div className="survey-wrapper">
            <Swiper
              ref={swiperRef}
              allowTouchMove={false}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              className="survey-swiper"
            >
              {/* Welcome Slide */}
              <SwiperSlide>
                <SurveyCard
                  title="Welcome to the Bibbulmun Track Survey"
                  content={
                    <div className="welcome-screen">
                      <p className="welcome-text">
                        Please complete the survey about your Bibbulmun Track
                        experience.
                      </p>
                      <IonButton
                        expand="block"
                        onClick={handleStartSurvey}
                        className="start-button"
                      >
                        Start Survey
                      </IonButton>
                    </div>
                  }
                />
              </SwiperSlide>

              {/* Question 1 */}
              <SwiperSlide>
                <SurveyCard
                  title="1: Have you visited the Bibbulmun Track in the LAST FOUR WEEKS?"
                  content={
                    <>
                      <IonRadioGroup
                        value={formData.visitedLastFourWeeks}
                        name="visitedLastFourWeeks"
                        onIonChange={handleInputChange}
                      >
                        <IonItem lines="none" className="radio-item">
                          <IonRadio slot="start" value="yes" />
                          <IonLabel className="radio-label">
                            Yes (Please continue survey)
                          </IonLabel>
                        </IonItem>
                        <IonItem lines="none" className="radio-item">
                          <IonRadio slot="start" value="no" />
                          <IonLabel className="radio-label">
                            No (Thank you for your time. The survey is complete.)
                          </IonLabel>
                        </IonItem>
                      </IonRadioGroup>
                      {errors.visitedLastFourWeeks && (
                        <p className="error-message">
                          {errors.visitedLastFourWeeks}
                        </p>
                      )}
                      <div className="navigation-container">
                        <IonButton
                          className="prev-button"
                          onClick={() => swiperRef.current?.slidePrev()}
                        >
                          Previous
                        </IonButton>
                        <IonButton
                          className="next-button"
                          onClick={() => {
                            if (formData.visitedLastFourWeeks === "no") {
                              swiperRef.current?.slideTo(1);
                            } else {
                              swiperRef.current?.slideNext();
                            }
                          }}
                        >
                          Next
                        </IonButton>
                      </div>
                    </>
                  }
                />
              </SwiperSlide>

              {/* Question 2 */}
              <SwiperSlide>
                <SurveyCard
                  title="2: What was the date of your last visit?"
                  content={
                    <>
                      <IonItem>
                        <IonInput
                          type="date"
                          name="lastVisitDate"
                          value={formData.lastVisitDate}
                          onIonChange={handleInputChange}
                          placeholder="mm/dd/yyyy"
                        />
                        {errors.lastVisitDate && (
                          <p className="error-message">{errors.lastVisitDate}</p>
                        )}
                      </IonItem>
                      <div className="navigation-container">
                        <IonButton
                          className="prev-button"
                          onClick={() => swiperRef.current?.slidePrev()}
                        >
                          Previous
                        </IonButton>
                        <IonButton
                          className="next-button"
                          onClick={() => swiperRef.current?.slideNext()}
                        >
                          Next
                        </IonButton>
                      </div>
                    </>
                  }
                />
              </SwiperSlide>

              {/* Question 3 */}
              <SwiperSlide>
                <SurveyCard
                  title="3: Have you heard of the Bibbulmun Track Foundation or Friends of the Bibbulmun Track previously?"
                  content={
                    <>
                      <IonRadioGroup
                        name="heardOfFoundation"
                        value={formData.heardOfFoundation}
                        onIonChange={handleInputChange}
                      >
                        <IonItem lines="none" className="radio-item">
                          <IonRadio slot="start" value="heardBefore" />
                          <IonLabel className="radio-label">
                            Yes - Heard of them before
                          </IonLabel>
                        </IonItem>
                        <IonItem lines="none" className="radio-item">
                          <IonRadio slot="start" value="currentMember" />
                          <IonLabel className="radio-label">
                            Yes - Current member
                          </IonLabel>
                        </IonItem>
                        <IonItem lines="none" className="radio-item">
                          <IonRadio slot="start" value="formerMember" />
                          <IonLabel className="radio-label">
                            Yes - Used to be a member
                          </IonLabel>
                        </IonItem>
                        <IonItem lines="none" className="radio-item">
                          <IonRadio slot="start" value="No" />
                          <IonLabel className="radio-label">No</IonLabel>
                        </IonItem>
                      </IonRadioGroup>
                      {errors.heardOfFoundation && (
                        <p className="error-message">{errors.heardOfFoundation}</p>
                      )}
                      <div className="navigation-container">
                        <IonButton
                          className="prev-button"
                          onClick={() => swiperRef.current?.slidePrev()}
                        >
                          Previous
                        </IonButton>
                        <IonButton
                          className="next-button"
                          onClick={() => swiperRef.current?.slideNext()}
                        >
                          Next
                        </IonButton>
                      </div>
                    </>
                  }
                />
              </SwiperSlide>

              {/* Question 4 */}
              <SwiperSlide>
                <SurveyCard
                  title="4: What first prompted you to walk the Bibbulmun Track?"
                  content={
                    <>
                      <div className="checkbox-group">
                        {[
                          "Bibbulmun Track Foundation website",
                          "Brochure",
                          "Department of Parks and Wildlife website",
                          "Top Trail/Trails WA website",
                          "Word of mouth/friends",
                          "Other website",
                          "Tour operator",
                          "Tourist magazine/map",
                          "Visitor Centre (local tourism office)",
                          "School Trip",
                          "Local knowledge",
                          "Other",
                          "Bibbulmun Track Foundation event",
                        ].map((option) => (
                          <IonItem key={option} lines="none" className="checkbox-item">
                            <IonCheckbox
                              slot="start"
                              name="promptedToWalk"
                              value={option}
                              checked={formData.promptedToWalk.includes(option)}
                              onIonChange={(e) => handleInputChange(e)}
                            />
                            <IonLabel className="checkbox-label">{option}</IonLabel>
                          </IonItem>
                        ))}
                      </div>
                      {errors.promptedToWalk && (
                        <p className="error-message">{errors.promptedToWalk}</p>
                      )}
                      <div className="navigation-container">
                        <IonButton
                          className="prev-button"
                          onClick={() => swiperRef.current?.slidePrev()}
                        >
                          Previous
                        </IonButton>
                        <IonButton
                          className="next-button"
                          onClick={() => swiperRef.current?.slideNext()}
                        >
                          Next
                        </IonButton>
                      </div>
                    </>
                  }
                />
              </SwiperSlide>

              {/* Question 5 */}
              <SwiperSlide>
                <SurveyCard
                  title="5: What form of transport did you use to arrive at the Bibbulmun Track for your last trip?"
                  content={
                    <>
                      <div>
                        <IonRadioGroup
                          value={formData.transportUsed}
                          name="transportUsed"
                          onIonChange={handleInputChange}
                        >
                          <IonItem lines="none" className="radio-item">
                            <IonRadio slot="start" value="Walked" />
                            <IonLabel className="radio-label">Walked</IonLabel>
                          </IonItem>
                          <IonItem lines="none" className="radio-item">
                            <IonRadio slot="start" value="Car (my own)" />
                            <IonLabel className="radio-label">Car (my own)</IonLabel>
                          </IonItem>
                          <IonItem lines="none" className="radio-item">
                            <IonRadio slot="start" value="Car (dropped off)" />
                            <IonLabel className="radio-label">Car (dropped off)</IonLabel>
                          </IonItem>
                          <IonItem lines="none" className="radio-item">
                            <IonRadio slot="start" value="Public transport (bus/train)" />
                            <IonLabel className="radio-label">
                              Public transport (bus/train)
                            </IonLabel>
                          </IonItem>
                          <IonItem lines="none" className="radio-item">
                            <IonRadio slot="start" value="Tour bus/coach" />
                            <IonLabel className="radio-label">Tour bus/coach</IonLabel>
                          </IonItem>
                          <IonItem lines="none" className="radio-item">
                            <IonRadio slot="start" value="Taxi" />
                            <IonLabel className="radio-label">Taxi</IonLabel>
                          </IonItem>
                          <IonItem lines="none" className="radio-item">
                            <IonRadio slot="start" value="Transport operator" />
                            <IonLabel className="radio-label">Transport operator</IonLabel>
                          </IonItem>
                          <IonItem lines="none" className="radio-item">
                            <IonRadio slot="start" value="Other" />
                            <IonLabel className="radio-label">Other</IonLabel>
                          </IonItem>
                        </IonRadioGroup>
                        {formData.transportUsed === "Other" && (
                          <IonItem lines="none">
                            <IonLabel position="floating">Please specify</IonLabel>
                            <IonInput
                              placeholder="Enter transport type"
                              value={formData.otherTransport}
                              name="otherTransport"
                              onIonChange={handleInputChange}
                            />
                            {errors.otherTransport && (
                              <p className="error-message">{errors.otherTransport}</p>
                            )}
                          </IonItem>
                        )}
                      </div>
                      {errors.transportUsed && (
                        <p className="error-message">{errors.transportUsed}</p>
                      )}
                      <div className="navigation-container">
                        <IonButton
                          className="prev-button"
                          onClick={() => swiperRef.current?.slidePrev()}
                        >
                          Previous
                        </IonButton>
                        <IonButton
                          className="next-button"
                          onClick={() => swiperRef.current?.slideNext()}
                        >
                          Next
                        </IonButton>
                      </div>
                    </>
                  }
                />
              </SwiperSlide>

              {/* Question 6 */}
              <SwiperSlide>
                <SurveyCard
                  title="6: Please indicate if your last trip was an"
                  content={
                    <>
                      <IonRadioGroup
                        name="tripType"
                        value={formData.tripType}
                        onIonChange={handleInputChange}
                      >
                        <IonItem lines="none" className="radio-item">
                          <IonRadio slot="start" value="outAndBack" />
                          <IonLabel className="radio-label">out and back walk</IonLabel>
                        </IonItem>
                        <IonItem lines="none" className="radio-item">
                          <IonRadio slot="start" value="oneWay" />
                          <IonLabel className="radio-label">one way</IonLabel>
                        </IonItem>
                      </IonRadioGroup>
                      {errors.tripType && (
                        <p className="error-message">{errors.tripType}</p>
                      )}
                      <div className="navigation-container">
                        <IonButton
                          className="prev-button"
                          onClick={() => swiperRef.current?.slidePrev()}
                        >
                          Previous
                        </IonButton>
                        <IonButton
                          className="next-button"
                          onClick={() => swiperRef.current?.slideNext()}
                        >
                          Next
                        </IonButton>
                      </div>
                    </>
                  }
                />
              </SwiperSlide>

              {/* Question 7 */}
              <SwiperSlide>
                <SurveyCard
                  title="7: How long did you walk on the Bibbulmun Track during your last trip?"
                  content={
                    <>
                      <IonRadioGroup
                        value={formData.walkDuration}
                        name="walkDuration"
                        onIonChange={handleInputChange}
                      >
                        <IonItem lines="none" className="radio-item">
                          <IonRadio slot="start" value="lessThan2Hours" />
                          <IonLabel className="radio-label">Less than 2 hours</IonLabel>
                        </IonItem>
                        <IonItem lines="none" className="radio-item">
                          <IonRadio slot="start" value="2to4Hours" />
                          <IonLabel className="radio-label">2 to 4 hours</IonLabel>
                        </IonItem>
                        <IonItem lines="none" className="radio-item">
                          <IonRadio slot="start" value="4HoursTo1Day" />
                          <IonLabel className="radio-label">4 hours to 1 day</IonLabel>
                        </IonItem>
                        <IonItem lines="none" className="radio-item">
                          <IonRadio slot="start" value="overnight" />
                          <IonLabel className="radio-label">
                            Overnight (please specify number of nights)
                          </IonLabel>
                        </IonItem>
                      </IonRadioGroup>
                      {formData.walkDuration === "overnight" && (
                        <IonItem lines="none">
                          <IonLabel position="floating">Number of nights</IonLabel>
                          <IonInput
                            placeholder="Enter number of nights"
                            value={formData.numberOfNights}
                            name="numberOfNights"
                            type="number"
                            onIonChange={handleInputChange}
                          />
                          {errors.numberOfNights && (
                            <p className="error-message">{errors.numberOfNights}</p>
                          )}
                        </IonItem>
                      )}
                      {errors.walkDuration && (
                        <p className="error-message">{errors.walkDuration}</p>
                      )}
                      <div className="navigation-container">
                        <IonButton
                          className="prev-button"
                          onClick={() => swiperRef.current?.slidePrev()}
                        >
                          Previous
                        </IonButton>
                        <IonButton
                          className="next-button"
                          onClick={() => swiperRef.current?.slideNext()}
                        >
                          Next
                        </IonButton>
                      </div>
                    </>
                  }
                />
              </SwiperSlide>

              {/* Question 8 */}
              <SwiperSlide>
                <SurveyCard
                  title="8: During your last Bibbulmun Track trip, indicate where you stayed and the number of nights."
                  content={
                    <>
                      <IonRadioGroup
                        value={formData.noneStay}
                        name="noneStay"
                        onIonChange={handleInputChange}
                      >
                        <IonItem lines="none" className="radio-item">
                          <IonRadio slot="start" value="true" />
                          <IonLabel className="radio-label">None</IonLabel>
                        </IonItem>
                      </IonRadioGroup>

                      {formData.noneStay !== "true" && (
                        <div className="form-grid">
                          <IonItem lines="none">
                            <IonLabel>Did not stay overnight</IonLabel>
                            <IonInput
                              type="number"
                              placeholder="Enter 1 if applicable"
                              name="noStay"
                              value={formData.noStay}
                              onIonChange={handleInputChange}
                              disabled={formData.noneStay === "true"}
                            />
                            {errors.noStay && (
                              <p className="error-message">{errors.noStay}</p>
                            )}
                          </IonItem>
                          <IonItem lines="none">
                            <IonLabel>Bibbulmun Track camp site - shelter</IonLabel>
                            <IonInput
                              type="number"
                              placeholder="Number of nights"
                              name="trackShelter"
                              value={formData.trackShelter}
                              onIonChange={handleInputChange}
                              disabled={formData.noneStay === "true"}
                            />
                            {errors.trackShelter && (
                              <p className="error-message">{errors.trackShelter}</p>
                            )}
                          </IonItem>
                          <IonItem lines="none">
                            <IonLabel>Bibbulmun Track camp site - tent</IonLabel>
                            <IonInput
                              type="number"
                              placeholder="Number of nights"
                              name="trackTent"
                              value={formData.trackTent}
                              onIonChange={handleInputChange}
                              disabled={formData.noneStay === "true"}
                            />
                            {errors.trackTent && (
                              <p className="error-message">{errors.trackTent}</p>
                            )}
                          </IonItem>
                          <IonItem lines="none">
                            <IonLabel>Backpackers/visitor hostel</IonLabel>
                            <IonInput
                              type="number"
                              placeholder="Number of nights"
                              name="backpackers"
                              value={formData.backpackers}
                              onIonChange={handleInputChange}
                              disabled={formData.noneStay === "true"}
                            />
                            {errors.backpackers && (
                              <p className="error-message">{errors.backpackers}</p>
                            )}
                          </IonItem>
                          <IonItem lines="none">
                            <IonLabel>Hotel/motel/motor inn</IonLabel>
                            <IonInput
                              type="number"
                              placeholder="Number of nights"
                              name="hotel"
                              value={formData.hotel}
                              onIonChange={handleInputChange}
                              disabled={formData.noneStay === "true"}
                            />
                            {errors.hotel && (
                              <p className="error-message">{errors.hotel}</p>
                            )}
                          </IonItem>
                        </div>
                      )}

                      <div className="navigation-container">
                        <IonButton
                          className="prev-button"
                          onClick={() => swiperRef.current?.slidePrev()}
                        >
                          Previous
                        </IonButton>
                        <IonButton
                          className="next-button"
                          onClick={() => swiperRef.current?.slideNext()}
                        >
                          Next
                        </IonButton>
                      </div>
                    </>
                  }
                />
              </SwiperSlide>

              {/* Final completion slide */}
              <SwiperSlide>
                <SurveyCard
                  title="Thank You for Completing the Survey"
                  content={
                    <div className="completion-screen">
                      <p className="completion-text">
                        Your feedback is valuable to us. Thank you for taking the
                        time to complete this survey.
                      </p>
                      <IonButton
                        expand="block"
                        onClick={handleSubmit}
                        className="submit-button"
                      >
                        Submit Survey
                      </IonButton>
                    </div>
                  }
                />
              </SwiperSlide>
            </Swiper>

            {/* Progress bar */}
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      (currentSlide / (swiperRef.current?.slides?.length || 1)) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Loading indicator */}
          <IonLoading isOpen={isLoading} message="Processing your survey..." />

          {/* Toast message */}
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={3000}
            position="bottom"
            cssClass="success-toast"
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Survey;