import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonRadio, IonRadioGroup, IonInput, IonButton, IonText,
  IonCheckbox, IonTextarea, IonSelect, IonSelectOption, IonLoading, IonToast,
  IonButtons,
  IonIcon,
  IonList,
  IonProgressBar,
  IonRow,
  IonGrid,
  IonCol
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Import Swiper styles
import { generateCSV, saveOfflineSubmission, sendCSVToBTF, isOnline, retryPendingSubmissions } from './surveyUtils';
import { arrowBack, arrowForward, checkmark } from 'ionicons/icons';
import './Tab2.css';

interface FormData {
  lastVisitDate: string;
  heardOfFoundation: string;
  promptedToWalk: string[];
  transportUsed: string;
  tripType: string;
  satisfaction: string;
  gender: string;
  otherTransport: string;
  tripDuration: string;
  numberOfNights: string;
  noStay: string;
  selfContained: string;
  trackTent: string;
  trackShelter: string;
  backpackers: string;
  hotel: string;
  bnb: string;
  familyFriends: string;
  otherCampsite: string;
  logbookRecord: string;
  numberOfTrips: string;
  numberOfFullDays: string;
  numberOfHalfDays: string;
  otherCost: string;
  mapsCost: string;
  activitiesCost: string;
  mealsOutCost: string;
  accommodationCost: string;
  foodSuppliesCost: string;
  travelCost: string;
  equipmentCost: string;
  expenseTiming: string;
  numberOfPeople: string;
  bushwalkingExpense: string;
  customPoints: string;
  finishPoint: string;
  startPoint: string;
  trackDistance: string;
  residence: string;
  stateTerritory: string;
  overseasCountry: string;
  otherOverseasCountry: string;
  decisionTime: string;
  postcode: string;
  intendToWalkAgain: string;
  bibbulmunMainReason: string;
  ageGroup: string;
  otherTravelGroup: string;
  travelGroup: string[];
  childrenUnder4Count: string;
  adultCount: string;
  children5to17Count: string;
  agreement_0: string;
  agreement_1: string;
  agreement_2: string;
  agreement_3: string;
  agreement_4: string;
  agreement_5: string;
  agreement_6: string;
  agreement_7: string;
  agreement_8: string;
  agreement_9: string;
  agreement_10: string;
  agreement_11: string;
  agreement_12: string;
  society_agreement_0: string;
  society_agreement_1: string;
  society_agreement_2: string;
  society_agreement_3: string;
  society_agreement_4: string;
  society_agreement_5: string;
  society_agreement_6: string;
  society_agreement_7: string;
  [key: string]: string | string[] | undefined;
}

const Tab2: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    lastVisitDate: '',
    heardOfFoundation: '',
    promptedToWalk: [],
    transportUsed: '',
    tripType: '',
    satisfaction: '',
    gender: '',
    otherTransport: '',
    tripDuration: '',
    numberOfNights: '',
    noStay: '',
    selfContained: '',
    trackTent: '',
    trackShelter: '',
    backpackers: '',
    hotel: '',
    bnb: '',
    familyFriends: '',
    otherCampsite: '',
    logbookRecord: '',
    numberOfTrips: '',
    numberOfFullDays: '',
    numberOfHalfDays: '',
    otherCost: '',
    mapsCost: '',
    activitiesCost: '',
    mealsOutCost: '',
    accommodationCost: '',
    foodSuppliesCost: '',
    travelCost: '',
    equipmentCost: '',
    expenseTiming: '',
    numberOfPeople: '',
    bushwalkingExpense: '',
    customPoints: '',
    finishPoint: '',
    startPoint: '',
    trackDistance: '',
    residence: '',
    stateTerritory: '',
    overseasCountry: '',
    otherOverseasCountry: '',
    decisionTime: '',
    postcode: '',
    intendToWalkAgain: '',
    bibbulmunMainReason: '',
    ageGroup: '',
    otherTravelGroup: '',
    travelGroup: [],
    childrenUnder4Count: '',
    adultCount: '',
    children5to17Count: '',
    agreement_0: '',
    agreement_1: '',
    agreement_2: '',
    agreement_3: '',
    agreement_4: '',
    agreement_5: '',
    agreement_6: '',
    agreement_7: '',
    agreement_8: '',
    agreement_9: '',
    agreement_10: '',
    agreement_11: '',
    agreement_12: '',
    society_agreement_0: '',
    society_agreement_1: '',
    society_agreement_2: '',
    society_agreement_3: '',
    society_agreement_4: '',
    society_agreement_5: '',
    society_agreement_6: '',
    society_agreement_7: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.on('slideChange', () => setCurrentSlide(swiperRef.current.activeIndex));
    }
    retryPendingSubmissions();
  }, []);

  const handleInputChange = (event: any, field?: string) => {
    const name = event.target?.name || field;
    const value = event.detail?.value !== undefined ? event.detail.value : event.target?.value;
    const checked = event.detail?.checked !== undefined ? event.detail.checked : event.target?.checked;

    let updatedValue: any = value;

    console.log(`handleInputChange: name=${name}, value=${value}, checked=${checked}`);

    if (name === 'promptedToWalk' || name === 'travelGroup') {
      const currentValue = (formData[name as keyof typeof formData] as string[]) || [];
      updatedValue = checked
        ? [...currentValue, value]
        : currentValue.filter((item: string) => item !== value);
    }

    if (name === 'heardOfFoundation') {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (value === 'No') {
        swiperRef.current?.slideTo(1);
        return;
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: updatedValue,
      }));
    }

    const error = validateField(name, updatedValue);
    setErrors((prev) => {
      if (error) {
        return { ...prev, [name]: error };
      }
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const validateField = (name: string, value: any): string => {
    if (name === 'heardOfFoundation' && !value) return 'Please select an option.';
    if (name === 'lastVisitDate') {
      if (!value) return 'Please select a date.';

      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today to midnight for accurate comparison
      const fourWeeksAgo = new Date(today);
      fourWeeksAgo.setDate(today.getDate() - 28); // 28 days = 4 weeks

      if (selectedDate > today) {
        return 'The date cannot be in the future.';
      }
      if (selectedDate < fourWeeksAgo) {
        return 'The date must be within the last four weeks.';
      }
    }
    if (name === 'promptedToWalk' && (!value || value.length === 0)) return 'Please select at least one option.';
    if (name === 'transportUsed' && !value) return 'Please select an option.';
    if (name === 'otherTransport' && value === '' && formData.transportUsed === 'Other') return 'Please specify other transport.';
    if (name === 'tripType' && !value) return 'Please select an option.';
    if (name === 'tripDuration' && !value) return 'Please select an option.';
    if (name === 'numberOfNights' && !value && formData.tripDuration === 'Overnight') return 'Please enter the number of nights.';
    if (name === 'logbookRecord' && !value) return 'Please select an option.';
    if (name === 'satisfaction' && !value) return 'Please select an option.';
    if (name === 'gender' && !value) return 'Please select an option.';
    if (name === 'overseasCountry' && !value) return 'Please select a country.';
    if (name === 'otherOverseasCountry' && formData.overseasCountry === 'other' && !value) return 'Please specify the country.';
    return '';
  };

  const isContinueButtonDisabled = (currentSlide: number) => {
    const disabled = (() => {
      switch (currentSlide) {
        case 0: return false; // Welcome slide: no validation needed
        case 1: return !formData.heardOfFoundation; // "No" slide or Question 1
        case 2:
          const result = !formData.transportUsed || (formData.transportUsed === 'Other' && !formData.otherTransport);
          console.log(`Slide 2: transportUsed=${formData.transportUsed}, otherTransport=${formData.otherTransport}, disabled=${result}`);
          return result;
        case 3: return !formData.tripType;
        default: return false;
      }
    })();
    return disabled;
  };

  const handleNext = () => {
    if (!isContinueButtonDisabled(currentSlide)) {
      swiperRef.current?.slideNext();
    }
  };

  const handleStartSurvey = () => {
    swiperRef.current?.slideTo(2); // Directly go to Question 1 (slide 2)
  };


  const resetFormAndGoToStart = () => {
    setFormData({
      lastVisitDate: '',
      heardOfFoundation: '',
      promptedToWalk: [],
      transportUsed: '',
      tripType: '',
      satisfaction: '',
      gender: '',
      otherTransport: '',
      tripDuration: '',
      numberOfNights: '',
      noStay: '',
      selfContained: '',
      trackTent: '',
      trackShelter: '',
      backpackers: '',
      hotel: '',
      bnb: '',
      familyFriends: '',
      otherCampsite: '',
      logbookRecord: '',
      numberOfTrips: '',
      numberOfFullDays: '',
      numberOfHalfDays: '',
      otherCost: '',
      mapsCost: '',
      activitiesCost: '',
      mealsOutCost: '',
      accommodationCost: '',
      foodSuppliesCost: '',
      travelCost: '',
      equipmentCost: '',
      expenseTiming: '',
      numberOfPeople: '',
      bushwalkingExpense: '',
      customPoints: '',
      finishPoint: '',
      startPoint: '',
      trackDistance: '',
      residence: '',
      stateTerritory: '',
      overseasCountry: '',
      otherOverseasCountry: '',
      decisionTime: '',
      postcode: '',
      intendToWalkAgain: '',
      bibbulmunMainReason: '',
      ageGroup: '',
      otherTravelGroup: '',
      travelGroup: [],
      childrenUnder4Count: '',
      adultCount: '',
      children5to17Count: '',
      agreement_0: '',
      agreement_1: '',
      agreement_2: '',
      agreement_3: '',
      agreement_4: '',
      agreement_5: '',
      agreement_6: '',
      agreement_7: '',
      agreement_8: '',
      agreement_9: '',
      agreement_10: '',
      agreement_11: '',
      agreement_12: '',
      society_agreement_0: '',
      society_agreement_1: '',
      society_agreement_2: '',
      society_agreement_3: '',
      society_agreement_4: '',
      society_agreement_5: '',
      society_agreement_6: '',
      society_agreement_7: ''
    });
    setErrors({});
    swiperRef.current?.slideTo(0);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToastMessage('Please correct the errors in the form.');
      setShowToast(true);
      return;
    }

    if (formData.heardOfFoundation === 'No') {
      setToastMessage('Survey complete. Thank you for your time!');
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    const submissionData = {
      ...formData,
      timestamp: new Date().toISOString(),
    };

    try {
      const csv = await generateCSV(submissionData);
      const onlineStatus = await isOnline();

      if (onlineStatus) {
        console.log('Submitting survey to server...');
        await sendCSVToBTF(csv);
        console.log('Survey submitted successfully');
        setToastMessage('✓ Survey was submitted'); // Online success message with checkmark
      } else {
        console.log('Saving survey offline...');
        await saveOfflineSubmission(submissionData);
        setToastMessage('Survey is saved locally and will be sent when internet is restored'); // Offline message
      }
    } catch (error: unknown) {
      console.error('Submission error:', error);
      await saveOfflineSubmission(submissionData);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setToastMessage(`Error submitting survey: ${errorMessage}. Saved locally and will be sent when internet is restored`);
    } finally {
      setIsLoading(false);
      setShowToast(true);
    }

    resetFormAndGoToStart();
  };
  return (
    <IonPage>
      <IonContent fullscreen>
        <Swiper
          ref={swiperRef}
          allowTouchMove={false}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {/* Welcome Slide */}
          <SwiperSlide>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Welcome</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>Please complete the survey about your Bibbulmun Track experience.</p>
                <IonButton expand="block" onClick={handleStartSurvey}>Start Survey</IonButton>
              </IonCardContent>
            </IonCard>
          </SwiperSlide>

          {/* "No" Slide */}
          <SwiperSlide>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Thank You</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>Thank you for your time. If you haven’t heard of the Foundation, we won’t proceed with further questions.</p>
                <IonButton expand="block" onClick={resetFormAndGoToStart}>Restart</IonButton>
              </IonCardContent>
            </IonCard>
          </SwiperSlide>

          {/* Question 1 */}

          <IonContent>
            <div className="center-content">
              <IonGrid>
                <IonRow className="ion-justify-content-center">
                  <IonCol size="12">
                    <SwiperSlide>
                      <IonItem lines="none" className="ion-padding">
                        <IonText className="question-text">
                          <h2>1. Have you visited the Bibbulmun Track in the LAST FOUR WEEKS?</h2>
                        </IonText>
                      </IonItem>

                      <IonList className="radio-list">
                        <IonRadioGroup
                          name="heardOfFoundation"
                          value={formData.heardOfFoundation}
                          onIonChange={handleInputChange}
                        >
                          <IonItem className="radio-item">
                            <IonLabel>Yes (Please continue survey)</IonLabel>
                            <IonRadio slot="start" value="Yes" />
                          </IonItem>
                          <IonItem className="radio-item">
                            <IonLabel>No (Thank you for your time. The survey is complete.)</IonLabel>
                            <IonRadio slot="start" value="No" />
                          </IonItem>
                        </IonRadioGroup>
                      </IonList>

                      {errors.heardOfFoundation && <p className="error-text">{errors.heardOfFoundation}</p>}

                      <IonRow className="ion-padding">
                        <IonCol size="6">
                          <IonButton expand="block" onClick={() => swiperRef.current?.slideTo(0)}>
                            <IonIcon icon={arrowBack} /> Previous
                          </IonButton>
                        </IonCol>
                        <IonCol size="6">
                          <IonButton
                            expand="block"
                            onClick={() => swiperRef.current?.slideNext()}
                            disabled={!formData.heardOfFoundation}
                            className="continue-button"
                          >
                            Next <IonIcon icon={arrowForward} />
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </SwiperSlide>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </IonContent>

          {/* Question 2 */}
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <SwiperSlide>
                  <IonItem lines="none" className="ion-padding">
                    <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                      <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        Please tell us about your last visit (within the last four weeks) to the Bibbulmun Track, how you heard about the track, and how you accessed the track (please answer for yourself only).
                      </h2>
                      <p style={{ marginTop: '8px' }}>
                        2. What was the date of your last visit?
                      </p>
                    </IonLabel>
                  </IonItem>
                  <IonItem className="ion-padding">
                    <IonInput
                      type="date"
                      name="lastVisitDate"
                      value={formData.lastVisitDate}
                      onIonChange={handleInputChange}
                    />
                    {errors.lastVisitDate && <p style={{ color: 'red' }}>{errors.lastVisitDate}</p>}
                  </IonItem>
                  <IonButtons className="ion-padding">
                    <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                      <IonIcon icon={arrowBack} /> Previous
                    </IonButton>
                    <IonButton
                      expand="block"
                      onClick={() => swiperRef.current?.slideNext()}
                      disabled={!!errors.lastVisitDate}
                      className="ion-margin-top"
                    >
                      Continue <IonIcon icon={arrowForward} />
                    </IonButton>
                  </IonButtons>
                </SwiperSlide>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Question 3 */}
          <SwiperSlide>
            <IonItem className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                3. Have you heard of the Bibbulmun Track Foundation or Friends of the Bibbulmun Track previously?
              </IonLabel>
              <IonList className="mt-4">
                <IonRadioGroup
                  name="heardOfFoundation"
                  value={formData.heardOfFoundation}
                  onIonChange={handleInputChange}
                >
                  <IonItem lines="none">
                    <IonLabel>Yes - Heard of them before</IonLabel>
                    <IonRadio slot="start" value="heardBefore" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>Yes - Current member</IonLabel>
                    <IonRadio slot="start" value="currentMember" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>Yes - Used to be a member</IonLabel>
                    <IonRadio slot="start" value="formerMember" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>No</IonLabel>
                    <IonRadio slot="start" value="No" />
                  </IonItem>
                </IonRadioGroup>
              </IonList>
              {errors.heardOfFoundation && <p style={{ color: 'red' }}>{errors.heardOfFoundation}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 4 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                4. What first prompted you to walk the Bibbulmun Track? (Select all that apply)
              </IonLabel>
              <div className="mt-4">
                <IonList>
                  {[
                    'Bibbulmun Track Foundation website',
                    'Brochure',
                    'Department of Parks and Wildlife website',
                    'Top Trail/Trails WA website',
                    'Word of mouth/friends',
                    'Other website',
                    'Tour operator',
                    'Tourist magazine/map',
                    'Visitor Centre (local tourism office)',
                    'School Trip',
                    'Local knowledge',
                    'Other',
                    'Bibbulmun Track Foundation event',
                  ].map((option) => (
                    <IonItem key={option} lines="none">
                      <IonCheckbox
                        slot="start"
                        name="promptedToWalk"
                        value={option}
                        checked={formData.promptedToWalk.includes(option)}
                        onIonChange={(e) => handleInputChange(e)}
                      />
                      <IonLabel>{option}</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </div>
              {errors.promptedToWalk && <p style={{ color: 'red' }}>{errors.promptedToWalk}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.promptedToWalk}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 5 */}
          <SwiperSlide>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Question 5: How did you get to the Bibbulmun Track?</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonRadioGroup name="transportUsed" value={formData.transportUsed} onIonChange={handleInputChange}>
                  {['Car (My own)', 'Car (Someone else’s)', 'Bus', 'Other'].map((option) => (
                    <IonItem key={option} lines="none">
                      <IonLabel>{option}</IonLabel>
                      <IonRadio slot="start" value={option} />
                    </IonItem>
                  ))}
                </IonRadioGroup>
                {formData.transportUsed === 'Other' && (
                  <IonItem>
                    <IonLabel position="floating">Please specify</IonLabel>
                    <IonInput
                      name="otherTransport"
                      value={formData.otherTransport}
                      onIonChange={handleInputChange}
                      debounce={300}
                    />
                  </IonItem>
                )}
                {errors.transportUsed && <IonText color="danger"><p>{errors.transportUsed}</p></IonText>}
                {errors.otherTransport && <IonText color="danger"><p>{errors.otherTransport}</p></IonText>}
                <IonButtons className="ion-padding">
                  <IonButton onClick={() => swiperRef.current?.slidePrev()} size="small">
                    <IonIcon icon={arrowBack} /> Previous
                  </IonButton>
                  <IonButton
                    expand="block"
                    onClick={handleNext}
                    disabled={isContinueButtonDisabled(currentSlide)}
                    size="small"
                    className="ion-margin-top"
                  >
                    Continue
                  </IonButton>
                </IonButtons>
              </IonCardContent>
            </IonCard>
          </SwiperSlide>

          {/* Question 6 */}
          <SwiperSlide>
            <IonItem className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                6. Please indicate if your last trip was an
              </IonLabel>
              <IonList className="mt-4">
                <IonRadioGroup name="tripType" value={formData.tripType} onIonChange={handleInputChange}>
                  <IonItem lines="none">
                    <IonLabel>out and back walk</IonLabel>
                    <IonRadio slot="start" value="outAndBack" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>one way</IonLabel>
                    <IonRadio slot="start" value="oneWay" />
                  </IonItem>
                </IonRadioGroup>
              </IonList>
              {errors.tripType && <p style={{ color: 'red' }}>{errors.tripType}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.tripType}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 7 */}
          <SwiperSlide>
            <IonItem className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                7. How long did you walk on the Bibbulmun Track during your last trip?
              </IonLabel>
              <IonList className="mt-4">
                <IonRadioGroup name="tripDuration" value={formData.tripDuration} onIonChange={handleInputChange}>
                  <IonItem lines="none">
                    <IonLabel>Less than 2 hours</IonLabel>
                    <IonRadio slot="start" value="Less than 2 hours" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>2 to 4 hours</IonLabel>
                    <IonRadio slot="start" value="2 to 4 hours" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>4 hours to 1 day</IonLabel>
                    <IonRadio slot="start" value="4 hours to 1 day" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>Overnight</IonLabel>
                    <IonRadio slot="start" value="Overnight" />
                  </IonItem>
                </IonRadioGroup>
                {formData.tripDuration === 'Overnight' && (
                  <IonItem lines="none">
                    <IonLabel position="floating">Please specify number of nights</IonLabel>
                    <IonInput
                      type="number"
                      value={formData.numberOfNights}
                      name="numberOfNights"
                      onIonChange={handleInputChange}
                    />
                    {errors.numberOfNights && <p style={{ color: 'red' }}>{errors.numberOfNights}</p>}
                  </IonItem>
                )}
              </IonList>
              {errors.tripDuration && <p style={{ color: 'red' }}>{errors.tripDuration}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.tripDuration || !!errors.numberOfNights}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 8 */}
          <SwiperSlide>
            <IonItem className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                8. During your most recent trip to the Bibbulmun Track, please indicate where you stayed by completing the number of nights stayed (e.g. 5) for each type of accommodation where applicable? (If you did not stay overnight please indicate below and go to next question)
              </IonLabel>
              <IonList className="mt-4">
                <IonItem lines="none">
                  <IonLabel>Did not stay overnight</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Enter 1 if applicable"
                    name="noStay"
                    value={formData.noStay}
                    onIonChange={handleInputChange}
                  />
                  {errors.noStay && <p style={{ color: 'red' }}>{errors.noStay}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Bibbulmun Track camp site - shelter</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Number of nights"
                    name="trackShelter"
                    value={formData.trackShelter}
                    onIonChange={handleInputChange}
                  />
                  {errors.trackShelter && <p style={{ color: 'red' }}>{errors.trackShelter}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Bibbulmun Track camp site - tent</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Number of nights"
                    name="trackTent"
                    value={formData.trackTent}
                    onIonChange={handleInputChange}
                  />
                  {errors.trackTent && <p style={{ color: 'red' }}>{errors.trackTent}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Backpackers/visitor hostel</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Number of nights"
                    name="backpackers"
                    value={formData.backpackers}
                    onIonChange={handleInputChange}
                  />
                  {errors.backpackers && <p style={{ color: 'red' }}>{errors.backpackers}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Bed and breakfast/guest house</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Number of nights"
                    name="bnb"
                    value={formData.bnb}
                    onIonChange={handleInputChange}
                  />
                  {errors.bnb && <p style={{ color: 'red' }}>{errors.bnb}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Other camp site/caravan park off the trail</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Number of nights"
                    name="otherCampsite"
                    value={formData.otherCampsite}
                    onIonChange={handleInputChange}
                  />
                  {errors.otherCampsite && <p style={{ color: 'red' }}>{errors.otherCampsite}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Family and friends</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Number of nights"
                    name="familyFriends"
                    value={formData.familyFriends}
                    onIonChange={handleInputChange}
                  />
                  {errors.familyFriends && <p style={{ color: 'red' }}>{errors.familyFriends}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Self-contained accommodation/chalets/units</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Number of nights"
                    name="selfContained"
                    value={formData.selfContained}
                    onIonChange={handleInputChange}
                  />
                  {errors.selfContained && <p style={{ color: 'red' }}>{errors.selfContained}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Hotel/motel/motor inn</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Number of nights"
                    name="hotel"
                    value={formData.hotel}
                    onIonChange={handleInputChange}
                  />
                  {errors.hotel && <p style={{ color: 'red' }}>{errors.hotel}</p>}
                </IonItem>
              </IonList>
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.noStay || !!errors.trackShelter || !!errors.trackTent || !!errors.backpackers || !!errors.bnb || !!errors.otherCampsite || !!errors.familyFriends || !!errors.selfContained || !!errors.hotel}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 9 */}
          <SwiperSlide>
            <IonItem className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                9. Did you record your walk in a green log-book at the campsites?
              </IonLabel>
              <IonList className="mt-4">
                <IonRadioGroup name="logbookRecord" value={formData.logbookRecord} onIonChange={handleInputChange}>
                  <IonItem lines="none">
                    <IonLabel>Yes</IonLabel>
                    <IonRadio slot="start" value="yes" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>No</IonLabel>
                    <IonRadio slot="start" value="no" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>Didn't visit a camp site</IonLabel>
                    <IonRadio slot="start" value="notVisited" />
                  </IonItem>
                </IonRadioGroup>
              </IonList>
              {errors.logbookRecord && <p style={{ color: 'red' }}>{errors.logbookRecord}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.logbookRecord}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 10 */}
          <SwiperSlide>
            <IonItem className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                10. Including your last trip, how often have you used the Bibbulmun Track in the last 12 months?
              </IonLabel>
              <IonList className="mt-4">
                <IonItem lines="none">
                  <IonLabel>Number of individual TRIPS (if first time = 1):</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Enter number"
                    name="numberOfTrips"
                    value={formData.numberOfTrips}
                    onIonChange={handleInputChange}
                  />
                  {errors.numberOfTrips && <p style={{ color: 'red' }}>{errors.numberOfTrips}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Total number of HALF DAYS (e.g. &lt;4 hours) spent on the trail over last 12 months:</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Enter number"
                    name="numberOfHalfDays"
                    value={formData.numberOfHalfDays}
                    onIonChange={handleInputChange}
                  />
                  {errors.numberOfHalfDays && <p style={{ color: 'red' }}>{errors.numberOfHalfDays}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Total number of FULL DAYS (e.g. &gt;4 hours) spent on the trail over last 12 months:</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Enter number"
                    name="numberOfFullDays"
                    value={formData.numberOfFullDays}
                    onIonChange={handleInputChange}
                  />
                  {errors.numberOfFullDays && <p style={{ color: 'red' }}>{errors.numberOfFullDays}</p>}
                </IonItem>
              </IonList>
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.numberOfTrips || !!errors.numberOfHalfDays || !!errors.numberOfFullDays}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 11 */}
          <SwiperSlide>
            <IonItem className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                11. For your last trip, overall how satisfied were you with your walk on the Bibbulmun Track?
              </IonLabel>
              <IonList className="mt-4">
                <IonRadioGroup value={formData.satisfaction} name="satisfaction" onIonChange={handleInputChange}>
                  <IonItem lines="none">
                    <IonLabel>Not at all satisfied</IonLabel>
                    <IonRadio slot="start" value="1" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>2</IonLabel>
                    <IonRadio slot="start" value="2" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>3</IonLabel>
                    <IonRadio slot="start" value="3" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>4</IonLabel>
                    <IonRadio slot="start" value="4" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>Extremely satisfied</IonLabel>
                    <IonRadio slot="start" value="5" />
                  </IonItem>
                </IonRadioGroup>
              </IonList>
              {errors.satisfaction && <p style={{ color: 'red' }}>{errors.satisfaction}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.satisfaction}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 12 - Fixed to use correct field name */}
          <SwiperSlide>
            <IonItem className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                12. How strongly would you recommend a walk on the Bibbulmun Track to friends who share your interests?
              </IonLabel>
              <IonList className="mt-4">
                <IonRadioGroup value={formData.satisfaction} name="satisfaction" onIonChange={handleInputChange}>
                  <IonItem lines="none">
                    <IonLabel>Not at all</IonLabel>
                    <IonRadio slot="start" value="1" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>2</IonLabel>
                    <IonRadio slot="start" value="2" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>3</IonLabel>
                    <IonRadio slot="start" value="3" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>4</IonLabel>
                    <IonRadio slot="start" value="4" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>Very Strongly</IonLabel>
                    <IonRadio slot="start" value="5" />
                  </IonItem>
                </IonRadioGroup>
              </IonList>
              {errors.satisfaction && <p style={{ color: 'red' }}>{errors.satisfaction}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.satisfaction}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 13 */}
          <SwiperSlide>
            <IonItem lines="none" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  We would like to know about what you spent on your most recent trip to the Bibbulmun Track. This includes what you spent on your most recent walk or in preparation for this walk, including travelling to and from the track. This helps us calculate a value of the track to its users.
                </h2>
                <p style={{ marginTop: '8px' }}>
                  During your most recent trip to the Bibbulmun Track in the last four weeks, would you mind telling us how much you spent to access and use the track? ($Australian - type in amount only e.g. 50 (no $) to nearest dollar value). (If money was not spent for a particular category please leave blank).
                </p>
              </IonLabel>
            </IonItem>
            <IonItem className="ion-padding">
              <IonList className="mt-4">
                <IonItem lines="none">
                  <IonLabel>Travel/transport (fuel, car hire, taxi etc.) to and from the Bibbulmun Track:</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Enter amount"
                    name="travelCost"
                    value={formData.travelCost}
                    onIonChange={handleInputChange}
                  />
                  {errors.travelCost && <p style={{ color: 'red' }}>{errors.travelCost}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Accommodation:</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Enter amount"
                    name="accommodationCost"
                    value={formData.accommodationCost}
                    onIonChange={handleInputChange}
                  />
                  {errors.accommodationCost && <p style={{ color: 'red' }}>{errors.accommodationCost}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Food/drink supplies/medicinals:</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Enter amount"
                    name="foodSuppliesCost"
                    value={formData.foodSuppliesCost}
                    onIonChange={handleInputChange}
                  />
                  {errors.foodSuppliesCost && <p style={{ color: 'red' }}>{errors.foodSuppliesCost}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Meals (eating out):</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Enter amount"
                    name="mealsOutCost"
                    value={formData.mealsOutCost}
                    onIonChange={handleInputChange}
                  />
                  {errors.mealsOutCost && <p style={{ color: 'red' }}>{errors.mealsOutCost}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Activities (sightseeing trips, tours, lessons, etc.):</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Enter amount"
                    name="activitiesCost"
                    value={formData.activitiesCost}
                    onIonChange={handleInputChange}
                  />
                  {errors.activitiesCost && <p style={{ color: 'red' }}>{errors.activitiesCost}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Equipment (purchased or hired for this trip):</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Enter amount"
                    name="equipmentCost"
                    value={formData.equipmentCost}
                    onIonChange={handleInputChange}
                  />
                  {errors.equipmentCost && <p style={{ color: 'red' }}>{errors.equipmentCost}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Maps, guides and other publications (purchased for this trip):</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Enter amount"
                    name="mapsCost"
                    value={formData.mapsCost}
                    onIonChange={handleInputChange}
                  />
                  {errors.mapsCost && <p style={{ color: 'red' }}>{errors.mapsCost}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Other (clothing, merchandise, souvenirs, etc. purchased for this trip):</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Enter amount"
                    name="otherCost"
                    value={formData.otherCost}
                    onIonChange={handleInputChange}
                  />
                  {errors.otherCost && <p style={{ color: 'red' }}>{errors.otherCost}</p>}
                </IonItem>
              </IonList>
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.travelCost || !!errors.accommodationCost || !!errors.foodSuppliesCost || !!errors.mealsOutCost || !!errors.activitiesCost || !!errors.equipmentCost || !!errors.mapsCost || !!errors.otherCost}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 14 */}
          <SwiperSlide>
            <IonItem className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                14. Please indicate if the above figures are:
              </IonLabel>
              <IonList className="mt-4">
                <IonRadioGroup name="expenseTiming" value={formData.expenseTiming} onIonChange={handleInputChange}>
                  <IonItem lines="none">
                    <IonLabel>per night</IonLabel>
                    <IonRadio slot="start" value="perNight" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>for the total length of your most recent trip</IonLabel>
                    <IonRadio slot="start" value="totalTrip" />
                  </IonItem>
                </IonRadioGroup>
              </IonList>
              {errors.expenseTiming && <p style={{ color: 'red' }}>{errors.expenseTiming}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.expenseTiming}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 15 */}
          <SwiperSlide>
            <IonItem className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                15. Including yourself, how many people do these figures cover?
              </IonLabel>
              <IonList className="mt-4">
                <IonItem lines="none">
                  <IonInput
                    type="number"
                    placeholder="Enter number of people"
                    name="numberOfPeople"
                    value={formData.numberOfPeople}
                    onIonChange={handleInputChange}
                  />
                  {errors.numberOfPeople && <p style={{ color: 'red' }}>{errors.numberOfPeople}</p>}
                </IonItem>
              </IonList>
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.numberOfPeople}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 16 */}
          <SwiperSlide>
            <IonItem className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                16. How much would you spend ($ Australian) on bushwalking gear in an average year? (e.g. backpack, books, clothes, shoes, maps etc.)
              </IonLabel>
              <IonList className="mt-4">
                <IonItem lines="none">
                  <IonInput
                    type="number"
                    placeholder="Enter amount in AUD"
                    name="bushwalkingExpense"
                    value={formData.bushwalkingExpense}
                    onIonChange={handleInputChange}
                  />
                  {errors.bushwalkingExpense && <p style={{ color: 'red' }}>{errors.bushwalkingExpense}</p>}
                </IonItem>
              </IonList>
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.bushwalkingExpense}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 17 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                17. What was the start and finish point for your walk on the Bibbulmun Track during your last trip?
              </IonLabel>
              <div className="mt-4">
                <IonList>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div>
                      <IonLabel>Start point</IonLabel>
                      <IonSelect
                        placeholder="Select start point"
                        name="startPoint"
                        value={formData.startPoint}
                        onIonChange={handleInputChange}
                      >
                        <IonSelectOption value="darling-range">1. The Darling Range (Kalamunda to Dwellingup)</IonSelectOption>
                        <IonSelectOption value="dwellingup">2. Dwellingup (Dwellingup to Collie)</IonSelectOption>
                        <IonSelectOption value="collie">3. Collie (Collie to Balingup)</IonSelectOption>
                        <IonSelectOption value="balingup">4. Balingup (Balingup to Donnelly River Village)</IonSelectOption>
                        <IonSelectOption value="donnelly-river">5. Donnelly River (Donnelly River Village to Pemberton)</IonSelectOption>
                        <IonSelectOption value="pemberton">6. Pemberton (Pemberton to Northcliffe)</IonSelectOption>
                        <IonSelectOption value="northcliffe">7. Northcliffe (Northcliffe to Walpole)</IonSelectOption>
                        <IonSelectOption value="walpole">8. Walpole (Walpole to Denmark)</IonSelectOption>
                        <IonSelectOption value="denmark-albany">9. Denmark / Albany (Denmark to Albany)</IonSelectOption>
                      </IonSelect>
                      {errors.startPoint && <p style={{ color: 'red' }}>{errors.startPoint}</p>}
                    </div>
                    <div>
                      <IonLabel>Finish/turn around point</IonLabel>
                      <IonSelect
                        placeholder="Select finish point"
                        name="finishPoint"
                        value={formData.finishPoint}
                        onIonChange={handleInputChange}
                      >
                        <IonSelectOption value="darling-range">1. The Darling Range (Kalamunda to Dwellingup)</IonSelectOption>
                        <IonSelectOption value="dwellingup">2. Dwellingup (Dwellingup to Collie)</IonSelectOption>
                        <IonSelectOption value="collie">3. Collie (Collie to Balingup)</IonSelectOption>
                        <IonSelectOption value="balingup">4. Balingup (Balingup to Donnelly River Village)</IonSelectOption>
                        <IonSelectOption value="donnelly-river">5. Donnelly River (Donnelly River Village to Pemberton)</IonSelectOption>
                        <IonSelectOption value="pemberton">6. Pemberton (Pemberton to Northcliffe)</IonSelectOption>
                        <IonSelectOption value="northcliffe">7. Northcliffe (Northcliffe to Walpole)</IonSelectOption>
                        <IonSelectOption value="walpole">8. Walpole (Walpole to Denmark)</IonSelectOption>
                        <IonSelectOption value="denmark-albany">9. Denmark / Albany (Denmark to Albany)</IonSelectOption>
                      </IonSelect>
                      {errors.finishPoint && <p style={{ color: 'red' }}>{errors.finishPoint}</p>}
                    </div>
                  </div>
                  <div className="mt-4 w-full">
                    <IonLabel>If different to the above (please specify start and finish point)</IonLabel>
                    <IonTextarea
                      placeholder="Enter custom start and finish points"
                      name="customPoints"
                      value={formData.customPoints}
                      onIonChange={handleInputChange}
                    />
                    {errors.customPoints && <p style={{ color: 'red' }}>{errors.customPoints}</p>}
                  </div>
                </IonList>
              </div>
            </IonItem>
            <div className="mt-4">
              <IonButton
                fill="clear"
                onClick={() => window.open('Bibbulmun Track section by section map', '_blank')}
              >
                View Track Map
              </IonButton>
            </div>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.startPoint || !!errors.finishPoint || !!errors.customPoints}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 18 */}
          <SwiperSlide>
            <IonItem className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                18. How many kilometres did you cover in total during your last trip on the Bibbulmun Track? (Please use a whole number)
              </IonLabel>
              <IonList className="mt-4">
                <IonItem lines="none">
                  <IonInput
                    type="number"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    min="0"
                    step="1"
                    placeholder="Enter distance in kilometres"
                    name="trackDistance"
                    value={formData.trackDistance}
                    onIonChange={handleInputChange}
                  />
                  {errors.trackDistance && <p style={{ color: 'red' }}>{errors.trackDistance}</p>}
                </IonItem>
              </IonList>
              <div className="mt-4">
                <IonButton
                  fill="clear"
                  onClick={() => window.open('https://www.bibbulmuntrack.org.au/trip-planner/distance-calculator/', '_blank')}
                >
                  Need help? Use the distance calculator
                </IonButton>
              </div>
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.trackDistance}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 19 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                19. Please indicate on the scale below your level of agreement with each of the following statements. Walking on the Bibbulmun Track provides me with the following opportunities or benefits:
              </IonLabel>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-sm">
                      <th className="p-2 text-left w-48">Statement</th>
                      <th className="p-2 text-center">Very strongly disagree</th>
                      <th className="p-2 text-center">Strongly disagree</th>
                      <th className="p-2 text-center">Disagree</th>
                      <th className="p-2 text-center">Undecided</th>
                      <th className="p-2 text-center">Agree</th>
                      <th className="p-2 text-center">Strongly agree</th>
                      <th className="p-2 text-center">Very strongly agree</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      'Access natural experiences',
                      'Appreciate scenic beauty',
                      'Challenge yourself',
                      'Engage in an active/healthy activity',
                      'Escape the urban environment',
                      'Experience something new and different',
                      'Relax and unwind',
                      'Socialise with friends and family',
                      'Participate in outdoor recreation activities',
                      'Connect with nature',
                      'Improve quality of life',
                      'Increase appreciation of the natural environment',
                      'Achieve physical and mental health benefits'
                    ].map((statement, index) => {
                      const valueKey = `agreement_${index}`;
                      return (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="p-2">{statement}</td>
                          <td colSpan={7} className="p-2">
                            <IonRadioGroup
                              name={valueKey}
                              value={formData[valueKey] || ''}
                              onIonChange={(e) => handleInputChange({ target: { name: valueKey, value: e.detail.value } })}
                            >
                              <div className="flex justify-between">
                                {['vsd', 'sd', 'd', 'u', 'a', 'sa', 'vsa'].map((value) => (
                                  <IonRadio
                                    key={value}
                                    slot="start"
                                    value={value}
                                    labelPlacement="end"
                                    className="mr-4"
                                  >
                                    {value === 'vsd' && 'Very strongly disagree'}
                                    {value === 'sd' && 'Strongly disagree'}
                                    {value === 'd' && 'Disagree'}
                                    {value === 'u' && 'Undecided'}
                                    {value === 'a' && 'Agree'}
                                    {value === 'sa' && 'Strongly agree'}
                                    {value === 'vsa' && 'Very strongly agree'}
                                  </IonRadio>
                                ))}
                              </div>
                            </IonRadioGroup>
                            {!formData[valueKey] && <p style={{ color: 'red' }}>Please select one option for "{statement}"</p>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={
                  ![
                    'agreement_0', 'agreement_1', 'agreement_2', 'agreement_3', 'agreement_4',
                    'agreement_5', 'agreement_6', 'agreement_7', 'agreement_8', 'agreement_9',
                    'agreement_10', 'agreement_11', 'agreement_12'
                  ].every((key) => formData[key])
                }
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 20 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                20. Please indicate on the scale below your level of agreement with each of the following statements. The Bibbulmun Track provides the following benefits to society:
              </IonLabel>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-sm">
                      <th className="p-2 text-left w-48">Statement</th>
                      <th className="p-2 text-center">Very strongly disagree</th>
                      <th className="p-2 text-center">Strongly disagree</th>
                      <th className="p-2 text-center">Disagree</th>
                      <th className="p-2 text-center">Undecided</th>
                      <th className="p-2 text-center">Agree</th>
                      <th className="p-2 text-center">Strongly agree</th>
                      <th className="p-2 text-center">Very strongly agree</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      'Provision of green corridors/spaces',
                      'Increased community wellbeing',
                      'Increased tourism in regional centres',
                      'Increased community pride',
                      'Generation of employment',
                      'Protection of biological diversity',
                      'Encouraging physical fitness and healthy lifestyles',
                      'Increased business investment'
                    ].map((statement, index) => {
                      const valueKey = `society_agreement_${index}`;
                      return (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="p-2">{statement}</td>
                          <td colSpan={7} className="p-2">
                            <IonRadioGroup
                              name={valueKey}
                              value={formData[valueKey] || ''}
                              onIonChange={(e) => handleInputChange({ target: { name: valueKey, value: e.detail.value } })}
                            >
                              <div className="flex justify-between">
                                {['vsd', 'sd', 'd', 'u', 'a', 'sa', 'vsa'].map((value) => (
                                  <IonRadio
                                    key={value}
                                    slot="start"
                                    value={value}
                                    labelPlacement="end"
                                    className="mr-4"
                                  >
                                    {value === 'vsd' && 'Very strongly disagree'}
                                    {value === 'sd' && 'Strongly disagree'}
                                    {value === 'd' && 'Disagree'}
                                    {value === 'u' && 'Undecided'}
                                    {value === 'a' && 'Agree'}
                                    {value === 'sa' && 'Strongly agree'}
                                    {value === 'vsa' && 'Very strongly agree'}
                                  </IonRadio>
                                ))}
                              </div>
                            </IonRadioGroup>
                            {!formData[valueKey] && <p style={{ color: 'red' }}>Please select one option for "{statement}"</p>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={
                  ![
                    'society_agreement_0', 'society_agreement_1', 'society_agreement_2',
                    'society_agreement_3', 'society_agreement_4', 'society_agreement_5',
                    'society_agreement_6', 'society_agreement_7'
                  ].every((key) => formData[key])
                }
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 21 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                Please tell us some information about yourself
              </IonLabel>
              <div className="mt-4">
                <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                  21. Where is your usual place of residence?
                </IonLabel>
                <IonList className="mt-4">
                  <IonRadioGroup
                    value={formData.residence}
                    name="residence"
                    onIonChange={handleInputChange}
                  >
                    <IonItem lines="none">
                      <IonRadio value="australia" />
                      <IonLabel className="ml-2">Australia</IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonRadio value="overseas" />
                      <IonLabel className="ml-2">Overseas</IonLabel>
                    </IonItem>
                  </IonRadioGroup>
                </IonList>
              </div>
              {errors.residence && <p style={{ color: 'red' }}>{errors.residence}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.residence}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 22 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                22. If you are an Australian resident, what state/territory do you live in?
              </IonLabel>
              <IonList className="mt-4">
                <IonRadioGroup
                  value={formData.stateTerritory}
                  name="stateTerritory"
                  onIonChange={handleInputChange}
                >
                  <IonItem lines="none">
                    <IonRadio value="australianCapitalTerritory" />
                    <IonLabel className="ml-2">Australian Capital Territory</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonRadio value="newSouthWales" />
                    <IonLabel className="ml-2">New South Wales</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonRadio value="northernTerritory" />
                    <IonLabel className="ml-2">Northern Territory</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonRadio value="queensland" />
                    <IonLabel className="ml-2">Queensland</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonRadio value="southAustralia" />
                    <IonLabel className="ml-2">South Australia</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonRadio value="tasmania" />
                    <IonLabel className="ml-2">Tasmania</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonRadio value="victoria" />
                    <IonLabel className="ml-2">Victoria</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonRadio value="westernAustralia" />
                    <IonLabel className="ml-2">Western Australia</IonLabel>
                  </IonItem>
                </IonRadioGroup>
              </IonList>
              {errors.stateTerritory && <p style={{ color: 'red' }}>{errors.stateTerritory}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.stateTerritory}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 23 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                23. If you normally reside overseas, what country are you from? (please select from the list below)
              </IonLabel>
              <div className="mt-4">
                <IonList>
                  <IonRadioGroup
                    value={formData.overseasCountry}
                    name="overseasCountry"
                    onIonChange={handleInputChange}
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <IonItem lines="none">
                        <IonRadio value="austria" />
                        <IonLabel className="ml-2">Austria</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="belgium" />
                        <IonLabel className="ml-2">Belgium</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="canada" />
                        <IonLabel className="ml-2">Canada</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="china" />
                        <IonLabel className="ml-2">China</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="denmark" />
                        <IonLabel className="ml-2">Denmark</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="france" />
                        <IonLabel className="ml-2">France</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="germany" />
                        <IonLabel className="ml-2">Germany</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="hongKong" />
                        <IonLabel className="ml-2">Hong Kong</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="india" />
                        <IonLabel className="ml-2">India</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="indonesia" />
                        <IonLabel className="ml-2">Indonesia</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="italy" />
                        <IonLabel className="ml-2">Italy</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="japan" />
                        <IonLabel className="ml-2">Japan</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="korea" />
                        <IonLabel className="ml-2">Korea</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="malaysia" />
                        <IonLabel className="ml-2">Malaysia</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="netherlands" />
                        <IonLabel className="ml-2">Netherlands</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="newZealand" />
                        <IonLabel className="ml-2">New Zealand</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="norway" />
                        <IonLabel className="ml-2">Norway</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="singapore" />
                        <IonLabel className="ml-2">Singapore</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="southAfrica" />
                        <IonLabel className="ml-2">South Africa</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="southAmerica" />
                        <IonLabel className="ml-2">South America</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="sweden" />
                        <IonLabel className="ml-2">Sweden</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="switzerland" />
                        <IonLabel className="ml-2">Switzerland</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="taiwan" />
                        <IonLabel className="ml-2">Taiwan</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="unitedKingdom" />
                        <IonLabel className="ml-2">United Kingdom</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="unitedStatesOfAmerica" />
                        <IonLabel className="ml-2">United States of America</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="other" />
                        <IonLabel className="ml-2">Other</IonLabel>
                      </IonItem>
                    </div>
                    {formData.overseasCountry === 'other' && (
                      <IonItem lines="none">
                        <IonLabel position="floating">Please specify</IonLabel>
                        <IonInput
                          placeholder="Enter country"
                          value={formData.otherOverseasCountry}
                          name="otherOverseasCountry"
                          onIonChange={handleInputChange}
                          className="ml-2"
                        />
                        {errors.otherOverseasCountry && <p style={{ color: 'red' }}>{errors.otherOverseasCountry}</p>}
                      </IonItem>
                    )}
                  </IonRadioGroup>
                </IonList>
              </div>
              {errors.overseasCountry && <p style={{ color: 'red' }}>{errors.overseasCountry}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.overseasCountry || !!errors.otherOverseasCountry}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 24 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                24. If from overseas or interstate, when did you decide to walk on the Bibbulmun Track?
              </IonLabel>
              <div className="mt-4">
                <IonList>
                  <IonRadioGroup
                    value={formData.decisionTime}
                    name="decisionTime"
                    onIonChange={handleInputChange}
                  >
                    <IonItem lines="none">
                      <IonRadio value="beforeArriving" />
                      <IonLabel className="ml-2">Before arriving in Western Australia</IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonRadio value="afterArriving" />
                      <IonLabel className="ml-2">After arriving in Western Australia</IonLabel>
                    </IonItem>
                  </IonRadioGroup>
                </IonList>
              </div>
              {errors.decisionTime && <p style={{ color: 'red' }}>{errors.decisionTime}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.decisionTime}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 25 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                25. If you are a Western Australian resident, what is your postcode?
              </IonLabel>
              <div className="mt-4">
                <IonInput
                  placeholder="Your postcode"
                  value={formData.postcode}
                  name="postcode"
                  type="number"
                  onIonChange={handleInputChange}
                />
                {errors.postcode && <p style={{ color: 'red' }}>{errors.postcode}</p>}
              </div>
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.postcode}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 26 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                26. Do you intend to walk on the Bibbulmun Track again?
              </IonLabel>
              <div className="mt-4">
                <IonList>
                  <IonRadioGroup
                    value={formData.intendToWalkAgain}
                    name="intendToWalkAgain"
                    onIonChange={handleInputChange}
                  >
                    <IonItem lines="none">
                      <IonRadio value="yes" />
                      <IonLabel className="ml-2">Yes</IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonRadio value="no" />
                      <IonLabel className="ml-2">No</IonLabel>
                    </IonItem>
                  </IonRadioGroup>
                </IonList>
              </div>
              {errors.intendToWalkAgain && <p style={{ color: 'red' }}>{errors.intendToWalkAgain}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.intendToWalkAgain}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 27 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                27. Was the Bibbulmun Track the main reason you came to this particular area?
              </IonLabel>
              <div className="mt-4">
                <IonList>
                  <IonRadioGroup
                    value={formData.bibbulmunMainReason}
                    name="bibbulmunMainReason"
                    onIonChange={handleInputChange}
                  >
                    <IonItem lines="none">
                      <IonRadio value="yes" />
                      <IonLabel className="ml-2">Yes</IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonRadio value="no" />
                      <IonLabel className="ml-2">No</IonLabel>
                    </IonItem>
                  </IonRadioGroup>
                </IonList>
              </div>
              {errors.bibbulmunMainReason && <p style={{ color: 'red' }}>{errors.bibbulmunMainReason}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.bibbulmunMainReason}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 28 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                28. Your gender?
              </IonLabel>
              <div className="mt-4">
                <IonList>
                  <IonRadioGroup
                    value={formData.gender}
                    name="gender"
                    onIonChange={handleInputChange}
                  >
                    <IonItem lines="none">
                      <IonRadio value="male" />
                      <IonLabel className="ml-2">Male</IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonRadio value="female" />
                      <IonLabel className="ml-2">Female</IonLabel>
                    </IonItem>
                  </IonRadioGroup>
                </IonList>
              </div>
              {errors.gender && <p style={{ color: 'red' }}>{errors.gender}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.gender}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 29 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                29. Your age group
              </IonLabel>
              <div className="mt-4">
                <IonList>
                  <IonRadioGroup
                    value={formData.ageGroup}
                    name="ageGroup"
                    onIonChange={handleInputChange}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <IonItem lines="none">
                        <IonRadio value="18-24" />
                        <IonLabel className="ml-2">18-24</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="25-34" />
                        <IonLabel className="ml-2">25-34</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="35-44" />
                        <IonLabel className="ml-2">35-44</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="45-54" />
                        <IonLabel className="ml-2">45-54</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="55-64" />
                        <IonLabel className="ml-2">55-64</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="65-69" />
                        <IonLabel className="ml-2">65-69</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="70-75" />
                        <IonLabel className="ml-2">70-75</IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonRadio value="75 or older" />
                        <IonLabel className="ml-2">75 or older</IonLabel>
                      </IonItem>
                    </div>
                  </IonRadioGroup>
                </IonList>
              </div>
              {errors.ageGroup && <p style={{ color: 'red' }}>{errors.ageGroup}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.ageGroup}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 30 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                30. Which best describes the travel group you visited the Bibbulmun Track with during your most recent trip?
              </IonLabel>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      name="travelGroup"
                      value="byYourself"
                      checked={formData.travelGroup.includes("byYourself")}
                      onIonChange={(e) => handleInputChange(e)}
                    />
                    <IonLabel>By yourself</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      name="travelGroup"
                      value="withSchoolUniversityGroup"
                      checked={formData.travelGroup.includes("withSchoolUniversityGroup")}
                      onIonChange={(e) => handleInputChange(e)}
                    />
                    <IonLabel>With school/university group</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      name="travelGroup"
                      value="withFriends"
                      checked={formData.travelGroup.includes("withFriends")}
                      onIonChange={(e) => handleInputChange(e)}
                    />
                    <IonLabel>With friends</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      name="travelGroup"
                      value="withClubOrganisation"
                      checked={formData.travelGroup.includes("withClubOrganisation")}
                      onIonChange={(e) => handleInputChange(e)}
                    />
                    <IonLabel>With a club/organisation</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      name="travelGroup"
                      value="withFamily"
                      checked={formData.travelGroup.includes("withFamily")}
                      onIonChange={(e) => handleInputChange(e)}
                    />
                    <IonLabel>With family</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      name="travelGroup"
                      value="tourGroup"
                      checked={formData.travelGroup.includes("tourGroup")}
                      onIonChange={(e) => handleInputChange(e)}
                    />
                    <IonLabel>Tour group</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      name="travelGroup"
                      value="withSpousePartner"
                      checked={formData.travelGroup.includes("withSpousePartner")}
                      onIonChange={(e) => handleInputChange(e)}
                    />
                    <IonLabel>With spouse/partner</IonLabel>
                  </IonItem>
                </div>
                <IonItem lines="none">
                  <IonCheckbox
                    slot="start"
                    name="travelGroup"
                    value="other"
                    checked={formData.travelGroup.includes("other")}
                    onIonChange={(e) => handleInputChange(e)}
                  />
                  <IonLabel>Other:</IonLabel>
                  <IonInput
                    placeholder="Please specify"
                    value={formData.otherTravelGroup}
                    name="otherTravelGroup"
                    onIonChange={handleInputChange}
                    disabled={!formData.travelGroup.includes("other")}
                    className="ml-2"
                  />
                  {errors.otherTravelGroup && <p style={{ color: 'red' }}>{errors.otherTravelGroup}</p>}
                </IonItem>
              </div>
              {errors.travelGroup && <p style={{ color: 'red' }}>{errors.travelGroup}</p>}
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.travelGroup || !!errors.otherTravelGroup}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 31 */}
          <SwiperSlide>
            <IonItem lines="full" className="ion-padding">
              <IonLabel position="stacked" className="text-2xl font-bold" style={{ marginBottom: '16px' }}>
                31. Including yourself, how many people in your personal (i.e. family) group were adults and how many were children during your last trip to the Bibbulmun Track?
              </IonLabel>
              <div className="mt-4 space-y-4">
                <IonItem lines="none">
                  <IonLabel position="floating">Number of adults</IonLabel>
                  <IonInput
                    value={formData.adultCount}
                    name="adultCount"
                    type="number"
                    onIonChange={handleInputChange}
                  />
                  {errors.adultCount && <p style={{ color: 'red' }}>{errors.adultCount}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel position="floating">Number of children (aged 4 and under)</IonLabel>
                  <IonInput
                    value={formData.childrenUnder4Count}
                    name="childrenUnder4Count"
                    type="number"
                    onIonChange={handleInputChange}
                  />
                  {errors.childrenUnder4Count && <p style={{ color: 'red' }}>{errors.childrenUnder4Count}</p>}
                </IonItem>
                <IonItem lines="none">
                  <IonLabel position="floating">Number of children (aged 5 to 17)</IonLabel>
                  <IonInput
                    value={formData.children5to17Count}
                    name="children5to17Count"
                    type="number"
                    onIonChange={handleInputChange}
                  />
                  {errors.children5to17Count && <p style={{ color: 'red' }}>{errors.children5to17Count}</p>}
                </IonItem>
              </div>
            </IonItem>
            <IonButtons className="ion-padding">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={!!errors.adultCount || !!errors.childrenUnder4Count || !!errors.children5to17Count}
                className="ion-margin-top"
              >
                Continue <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Final Slide */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>Thank you for completing the survey!</IonLabel>
            </IonItem>
            <div className="ion-padding ion-text-center">
              <IonButton
                expand="block"
                onClick={handleSubmit}
                className="ion-margin-top"
                disabled={Object.keys(errors).length > 0}
              >
                Submit Survey
              </IonButton>
            </div>
          </SwiperSlide>
        </Swiper>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage} // Use the dynamic message from handleSubmit
          duration={3000}
          position="bottom"
          color="success"
          cssClass="success-toast"
        />
        <IonLoading
          isOpen={isLoading}
          spinner="crescent" // Use an indeterminate spinner instead of a static progress bar
          message="Processing your submission..." // Simplify to just a message
        />
      </IonContent>
    </IonPage>
  );
};
  export default Tab2;