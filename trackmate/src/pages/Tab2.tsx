import React, { useState, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonCardContent,
  IonCard,
  IonButtons,
  IonRadioGroup,
  IonRadio,
  IonCheckbox,
  IonList,
  IonTextarea
} from '@ionic/react';
import { arrowForward, arrowBack } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './Tab2.css';

const Tab2: React.FC = (): React.JSX.Element => {
  const [formData, setFormData] = useState({
    lastVisitDate: '',
    heardOfFoundation: '',
    promptedToWalk: [],
    transportUsed: '',
    tripType: '',
    walkDuration: '',
    logBookRecorded: '',
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
    travelGroup: '',
    childrenUnder4Count: '',
	  adultCount: '',
	  children5to17Count: ''
  });

  const handleInputChange = (event: any, p0?: string) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // If the user selects "No" in the first question, skip to the last slide
    if (name === 'heardOfFoundation' && value === 'No') {
      // Get total number of slides and navigate to the last one
      const totalSlides = swiperRef.current.slides.length - 1;
      swiperRef.current.slideTo(totalSlides);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log(formData);
  };

  const swiperRef = useRef<any>(null);

  function handleCheckboxChange(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tell us about your Bibbulmun Track experience!</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Swiper
          modules={[Navigation]}
          onBeforeInit={(swiper: any) => {
            swiperRef.current = swiper;
          }}
          navigation
        >
          {/* Welcome Screen */}
          <SwiperSlide>
            <IonCard>
              <IonCardContent>
                <p>Dear trail user,</p>
                <p>
                  This survey aims to obtain your views about your visit within the last four weeks to the
                  Bibbulmun Track. Your feedback will help improve the design and management of the track.
                </p>
                <p>Your answers are confidential. Thank you for sharing your thoughts!</p>
              </IonCardContent>
            </IonCard>
            <IonButtons className="ion-justify-content-center ion-padding">
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Start Survey <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 1 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>1. Have you visited the Bibbulmun Track in the LAST FOUR WEEKS?</IonLabel>
              <IonRadioGroup name="heardOfFoundation" value={formData.heardOfFoundation} onIonChange={handleInputChange}>
                <IonItem>
                  <IonLabel>Yes (Please continue survey)</IonLabel>
                  <IonRadio slot="start" value="Yes" />
                </IonItem>
                <IonItem>
                  <IonLabel>No (Thank you for your time. The survey is complete.)</IonLabel>
                  <IonRadio slot="start" value="No" />
                </IonItem>
              </IonRadioGroup>
            </IonItem>
            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 2 */}
          <SwiperSlide>
            <IonItem lines="none">
              <IonLabel>
                <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  Please tell us about your last visit (within the last four weeks) to the Bibbulmun Track,
                  how you heard about the track, and how you accessed the track (please answer for yourself only).
                </h2>
                <p style={{ marginTop: '8px' }}>
                  2. What was the date of your last visit?
                </p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonInput
                type="date"
                name="lastVisitDate"
                value={formData.lastVisitDate}
                onIonChange={handleInputChange}
              />
            </IonItem>


            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 3 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>3. Have you heard of the Bibbulmun Track Foundation or Friends of the Bibbulmun Track previously?</IonLabel>
              <IonRadioGroup name="heardOfFoundation" value={formData.heardOfFoundation} onIonChange={handleInputChange}>
                <IonItem>
                  <IonLabel>Yes - Heard of them before</IonLabel>
                  <IonRadio slot="start" value="heardBefore" />
                </IonItem>
                <IonItem>
                  <IonLabel>Yes - Current member</IonLabel>
                  <IonRadio slot="start" value="currentMember" />
                </IonItem>
                <IonItem>
                  <IonLabel>Yes - Used to be a member</IonLabel>
                  <IonRadio slot="start" value="formerMember" />
                </IonItem>
                <IonItem>
                  <IonLabel>No</IonLabel>
                  <IonRadio slot="start" value="no" />
                </IonItem>
              </IonRadioGroup>
            </IonItem>
            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 4 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>4. What first prompted you to walk the Bibbulmun Track? (Select all that apply)</IonLabel>
              <div className="checkbox-group">
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
                  'Bibbulmun Track Foundation event'
                ].map((option) => (
                  <IonItem key={option}>
                    <IonCheckbox
                      slot="start"
                      onIonChange={(e) => {
                        const isChecked = e.detail.checked;
                        const updatedSelection = isChecked
                          ? [...formData.promptedToWalk, option]
                          : formData.promptedToWalk.filter((item: string) => item !== option);

                        handleInputChange({
                          target: {
                            name: 'promptedToWalk',
                            value: updatedSelection
                          }
                        });
                      }}
                    />
                    <IonLabel>{option}</IonLabel>
                  </IonItem>
                ))}
              </div>
            </IonItem>
            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 5 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>5. What form of transport did you use to arrive at the Bibbulmun Track for your last trip?</IonLabel>
              <IonRadioGroup name="transportUsed" value={formData.transportUsed} onIonChange={handleInputChange}>
                <IonItem>
                  <IonLabel>Walked</IonLabel>
                  <IonRadio slot="start" value="Walked" />
                </IonItem>
                <IonItem>
                  <IonLabel>Car (My own)</IonLabel>
                  <IonRadio slot="start" value="Car (My own)" />
                </IonItem>
                <IonItem>
                  <IonLabel>Car (Dropped off)</IonLabel>
                  <IonRadio slot="start" value="Car (Dropped off)" />
                </IonItem>
                <IonItem>
                  <IonLabel>Public Transport (Bus/Train)</IonLabel>
                  <IonRadio slot="start" value="Public Transport" />
                </IonItem>
                <IonItem>
                  <IonLabel>Tour Bus/Coach</IonLabel>
                  <IonRadio slot="start" value="Tour Bus/Coach" />
                </IonItem>
                <IonItem>
                  <IonLabel>Taxi</IonLabel>
                  <IonRadio slot="start" value="Taxi" />
                </IonItem>
                <IonItem>
                  <IonLabel>Transport Operator</IonLabel>
                  <IonRadio slot="start" value="Transport Operator" />
                </IonItem>
                <IonItem>
                  <IonLabel>Other</IonLabel>
                  <IonRadio slot="start" value="Other" />
                </IonItem>
                {formData.transportUsed === "Other" && (
                  <IonItem>
                    <IonInput
                      placeholder="Please specify"
                      value={formData.otherTransport ?? ''}
                      onIonChange={(e) => setFormData({ ...formData, otherTransport: e.detail.value as string || '' })}
                    />
                  </IonItem>
                )}
              </IonRadioGroup>
            </IonItem>
            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>


          {/* Question 6 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>6. Please indicate if your last trip was an</IonLabel>
              <IonRadioGroup name="tripType" value={formData.tripType} onIonChange={handleInputChange}>
                <IonItem>
                  <IonLabel>out and back walk</IonLabel>
                  <IonRadio slot="start" value="outAndBack" />
                </IonItem>
                <IonItem>
                  <IonLabel>one way</IonLabel>
                  <IonRadio slot="start" value="oneWay" />
                </IonItem>
              </IonRadioGroup>
            </IonItem>
            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 7 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>7. How long did you walk on the Bibbulmun Track during your last trip?</IonLabel>
              <IonRadioGroup name="tripDuration" value={formData.tripDuration} onIonChange={handleInputChange}>
                <IonItem>
                  <IonLabel>Less than 2 hours</IonLabel>
                  <IonRadio slot="start" value="Less than 2 hours" />
                </IonItem>
                <IonItem>
                  <IonLabel>2 to 4 hours</IonLabel>
                  <IonRadio slot="start" value="2 to 4 hours" />
                </IonItem>
                <IonItem>
                  <IonLabel>4 hours to 1 day</IonLabel>
                  <IonRadio slot="start" value="4 hours to 1 day" />
                </IonItem>
                <IonItem>
                  <IonLabel>Overnight</IonLabel>
                  <IonRadio slot="start" value="Overnight" />
                </IonItem>
              </IonRadioGroup>
              {formData.tripDuration === 'Overnight' && (
                <IonItem>
                  <IonLabel position="floating">Please specify number of nights</IonLabel>
                  <IonInput
                    type="number"
                    value={formData.numberOfNights}
                    onIonChange={e => handleInputChange(e, 'numberOfNights')}
                  />
                </IonItem>
              )}
            </IonItem>
            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 8 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>
                8. During your most recent trip to the Bibbulmun Track, please indicate where you stayed by completing
                the number of nights stayed (e.g. 5) for each type of accommodation where applicable? (If you did not
                stay overnight please indicate below and go to next question)
              </IonLabel>
              <IonList>
                <IonItem>
                  <IonLabel>Did not stay overnight</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Enter 1 if applicable"
                    name="noStay"
                    value={formData.noStay}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Bibbulmun Track camp site - shelter</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Number of nights"
                    name="trackShelter"
                    value={formData.trackShelter}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Bibbulmun Track camp site - tent</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Number of nights"
                    name="trackTent"
                    value={formData.trackTent}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Backpackers/visitor hostel</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Number of nights"
                    name="backpackers"
                    value={formData.backpackers}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Bed and breakfast/guest house</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Number of nights"
                    name="bnb"
                    value={formData.bnb}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Other camp site/caravan park off the trail</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Number of nights"
                    name="otherCampsite"
                    value={formData.otherCampsite}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Family and friends</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Number of nights"
                    name="familyFriends"
                    value={formData.familyFriends}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Self-contained accommodation/chalets/units</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Number of nights"
                    name="selfContained"
                    value={formData.selfContained}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Hotel/motel/motor inn</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Number of nights"
                    name="hotel"
                    value={formData.hotel}
                    onIonChange={handleInputChange}
                  />
                </IonItem>
              </IonList>
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 9 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>9. Did you record your walk in a green log-book at the campsites?</IonLabel>
              <IonRadioGroup name="logbookRecord" value={formData.logbookRecord} onIonChange={handleInputChange}>
                <IonItem>
                  <IonLabel>Yes</IonLabel>
                  <IonRadio slot="start" value="yes" />
                </IonItem>
                <IonItem>
                  <IonLabel>No</IonLabel>
                  <IonRadio slot="start" value="no" />
                </IonItem>
                <IonItem>
                  <IonLabel>Didn't visit a camp site</IonLabel>
                  <IonRadio slot="start" value="notVisited" />
                </IonItem>
              </IonRadioGroup>
            </IonItem>
            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 10 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>10. Including your last trip, how often have you used the Bibbulmun Track in the last 12 months?</IonLabel>
              <IonList>
                <IonItem>
                  <IonLabel>Number of individual TRIPS (if first time = 1):</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Enter number"
                    name="numberOfTrips"
                    value={formData.numberOfTrips}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Total number of HALF DAYS (e.g. &lt;4 hours) spent on the trail over last 12 months:</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Enter number"
                    name="numberOfHalfDays"
                    value={formData.numberOfHalfDays}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Total number of FULL DAYS (e.g. &gt;4 hours) spent on the trail over last 12 months:</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Enter number"
                    name="numberOfFullDays"
                    value={formData.numberOfFullDays}
                    onIonChange={handleInputChange}
                  />
                </IonItem>
              </IonList>
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 11 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>11. For your last trip, overall how satisfied were you with your walk on the Bibbulmun Track?</IonLabel>
            </IonItem>

            <IonList>
              <IonRadioGroup value={formData.satisfaction} onIonChange={(e) => setFormData({ ...formData, satisfaction: e.detail.value })}>
                <IonItem>
                  <IonLabel>Not at all satisfied</IonLabel>
                  <IonRadio slot="start" value="1" />
                </IonItem>
                <IonItem>
                  <IonLabel>2</IonLabel>
                  <IonRadio slot="start" value="2" />
                </IonItem>
                <IonItem>
                  <IonLabel>3</IonLabel>
                  <IonRadio slot="start" value="3" />
                </IonItem>
                <IonItem>
                  <IonLabel>4</IonLabel>
                  <IonRadio slot="start" value="4" />
                </IonItem>
                <IonItem>
                  <IonLabel>Extremely satisfied</IonLabel>
                  <IonRadio slot="start" value="5" />
                </IonItem>
              </IonRadioGroup>
            </IonList>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 12 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>12. How strongly would you recommend a walk on the Bibbulmun Track to friends who share your
                interests?</IonLabel>
            </IonItem>

            <IonList>
              <IonRadioGroup value={formData.satisfaction} onIonChange={(e) => setFormData({ ...formData, satisfaction: e.detail.value })}>
                <IonItem>
                  <IonLabel>Not at all</IonLabel>
                  <IonRadio slot="start" value="1" />
                </IonItem>
                <IonItem>
                  <IonLabel>2</IonLabel>
                  <IonRadio slot="start" value="2" />
                </IonItem>
                <IonItem>
                  <IonLabel>3</IonLabel>
                  <IonRadio slot="start" value="3" />
                </IonItem>
                <IonItem>
                  <IonLabel>4</IonLabel>
                  <IonRadio slot="start" value="4" />
                </IonItem>
                <IonItem>
                  <IonLabel>Very Strongly</IonLabel>
                  <IonRadio slot="start" value="5" />
                </IonItem>
              </IonRadioGroup>
            </IonList>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 13 */}
          <SwiperSlide>
            <IonItem lines="none">
              <IonLabel>
                <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  We would like to know about what you spent on your most recent trip to the Bibbulmun Track.
                  This includes what you spent on your most recent walk or in preparation for this walk, including
                  travelling to and from the track. This helps us calculate a value of the track to its users.
                </h2>
                <p style={{ marginTop: '8px' }}>
                  During your most recent trip to the Bibbulmun Track in the last four weeks, would you mind telling us how much you spent to access and use the track? ($Australian - type in amount only e.g. 50 (no $) to nearest dollar value). (If money was not spent for a particular category please leave blank).
                </p>
              </IonLabel>
              <IonList>
                <IonItem>
                  <IonLabel>Travel/transport (fuel, car hire, taxi etc.) to and from the Bibbulmun Track:</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Enter amount"
                    name="travelCost"
                    value={formData.travelCost}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Accommodation:</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Enter amount"
                    name="accommodationCost"
                    value={formData.accommodationCost}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Food/drink supplies/medicinals:</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Enter amount"
                    name="foodSuppliesCost"
                    value={formData.foodSuppliesCost}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Meals (eating out):</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Enter amount"
                    name="mealsOutCost"
                    value={formData.mealsOutCost}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Activities (sightseeing trips, tours, lessons, etc.):</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Enter amount"
                    name="activitiesCost"
                    value={formData.activitiesCost}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Equipment (purchased or hired for this trip):</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Enter amount"
                    name="equipmentCost"
                    value={formData.equipmentCost}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Maps, guides and other publications (purchased for this trip):</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Enter amount"
                    name="mapsCost"
                    value={formData.mapsCost}
                    onIonChange={handleInputChange}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Other (clothing, merchandise, souvenirs, etc. purchased for this trip):</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Enter amount"
                    name="otherCost"
                    value={formData.otherCost}
                    onIonChange={handleInputChange}
                  />
                </IonItem>
              </IonList>
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 14 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>14. Please indicate if the above figures are:</IonLabel>
              <IonRadioGroup name="expenseTiming" value={formData.expenseTiming} onIonChange={handleInputChange}>
                <IonItem>
                  <IonLabel>per night</IonLabel>
                  <IonRadio slot="start" value="perNight" />
                </IonItem>
                <IonItem>
                  <IonLabel>for the total length of your most recent trip</IonLabel>
                  <IonRadio slot="start" value="totalTrip" />
                </IonItem>
              </IonRadioGroup>
            </IonItem>
            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 15 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>15. Including yourself, how many people do these figures cover?</IonLabel>
              <IonInput
                type="text"
                placeholder="Enter number of people"
                name="numberOfPeople"
                value={formData.numberOfPeople}
                onIonChange={handleInputChange}
              />
            </IonItem>
            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 16 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel>
                16. How much would you spend ($ Australian) on bushwalking gear in an average year? (e.g. backpack, books, clothes, shoes, maps etc.)
              </IonLabel>
              <IonInput
                type="number"
                placeholder="Enter amount in AUD"
                name="bushwalkingExpense"
                value={formData.bushwalkingExpense}
                onIonChange={handleInputChange}
              />
            </IonItem>
            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 17 */}
          <SwiperSlide>
            <IonItem lines="full">
              <IonLabel position="stacked">
                17. What was the start and finish point for your walk on the Bibbulmun Track during your last trip?
              </IonLabel>

              <div className="grid grid-cols-2 gap-4 w-full mt-4">
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

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 18 */}
          <SwiperSlide>
            <IonItem>
              <IonLabel position="stacked">
                18. How many kilometres did you cover in total during your last trip on the Bibbulmun Track? (Please use a whole number)
              </IonLabel>
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
              <div className="mt-4">
                <IonButton
                  fill="clear"
                  onClick={() => window.open('https://www.bibbulmuntrack.org.au/trip-planner/distance-calculator/', '_blank')}
                >
                  Need help? Use the distance calculator
                </IonButton>
              </div>
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 19 */}
          <SwiperSlide>
            <IonItem lines="full">
              <IonLabel position="stacked">
                19. Please indicate on the scale below your level of agreement with each of the following statements.
                Walking on the Bibbulmun Track provides me with the following opportunities or benefits:
              </IonLabel>

              <div className="w-full mt-4 overflow-x-auto">
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
                    ].map((statement, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="p-2">{statement}</td>
                        {['vsd', 'sd', 'd', 'u', 'a', 'sa', 'vsa'].map((value) => (
                          <td key={value} className="text-center">
                            <IonRadio
                              name={`agreement_${index}`}
                              value={value}
                              onChange={(e) => handleInputChange({
                                target: {
                                  name: `agreement_${index}`,
                                  value: (e.target as HTMLIonRadioElement).value
                                }
                              })}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </IonItem>

            <IonButtons className="mt-4">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 20 */}
          <SwiperSlide>
            <IonItem lines="full">
              <IonLabel position="stacked">
                20. Please indicate on the scale below your level of agreement with each of the following statements.
                The Bibbulmun Track provides the following benefits to society:
              </IonLabel>

              <div className="w-full mt-4 overflow-x-auto">
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
                    ].map((statement, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="p-2">{statement}</td>
                        {['vsd', 'sd', 'd', 'u', 'a', 'sa', 'vsa'].map((value) => (
                          <td key={value} className="text-center">
                            <IonRadio
                              name={`society_agreement_${index}`}
                              value={value}
                              onChange={(e) => handleInputChange({
                                target: {
                                  name: `agreement_${index}`,
                                  value: (e.target as HTMLIonRadioElement).value
                                }
                              })}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </IonItem>

            <IonButtons className="mt-4">
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 21 */}
          <SwiperSlide>
            <IonItem lines="full">
              <IonLabel className="text-xl font-medium mb-4">
                Please tell us some information about yourself
              </IonLabel>

              <div className="mt-4">
                <IonLabel>21. Where is your usual place of residence?</IonLabel>

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
              </div>
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 22 */}
          <SwiperSlide>
            <IonItem lines="full">
              <IonLabel className="text-xl font-medium mb-4">
                22. If you are an Australian resident, what state/territory do you live in?
              </IonLabel>

              {/* No need for the separate question label anymore */}
              {/* <div className="mt-4">
            <IonLabel>22. If you are an Australian resident, what state/territory do you live in?</IonLabel> */}

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
              {/* </div> */} {/* Remove the div wrapping the question label if you remove the separate question label */}
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 23 */}
          <SwiperSlide>
            <IonItem lines="full">
              <IonLabel className="text-xl font-medium mb-4">
                23. If you normally reside overseas, what country are you from? (please select from the list below)
              </IonLabel>

              <div className="mt-4">
                <IonRadioGroup
                  value={formData.overseasCountry}
                  name="overseasCountry"
                  onIonChange={(e) => {
                    handleInputChange(e);
                    console.log("formData.overseasCountry changed to:", e.detail.value); // ADDED CONSOLE LOG FOR DEBUGGING
                  }}
                >
                  <div className="grid grid-cols-3 gap-4"> {/* Using grid layout - Ensure Tailwind CSS is configured! */}
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
                  </div>

                  <IonItem lines="none">
                    <IonRadio value="other" >
                      <IonInput
                        placeholder="Other (please specify)"
                        value={formData.otherOverseasCountry}
                        name="otherOverseasCountry"
                        onIonChange={handleInputChange}
                        disabled={formData.overseasCountry !== 'other'} // ENABLED disabled prop - for conditional display
                        className="ml-6"
                      />
                    </IonRadio>
                  </IonItem>
                </IonRadioGroup>
              </div>
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 24 */}
          <SwiperSlide>
            <IonItem lines="full">
              <IonLabel className="text-xl font-medium mb-4">
                24. If from overseas or interstate, when did you decide to walk on the Bibbulmun Track?
              </IonLabel>

              <div className="mt-4">
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
              </div>
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 25 */}
          <SwiperSlide>
            <IonItem lines="full">
              <IonLabel className="text-xl font-medium mb-4">
                25. If you are a Western Australian resident, what is your postcode?
              </IonLabel>

              <div className="mt-4">
                <IonInput
                  placeholder="Your postcode"
                  value={formData.postcode}
                  name="postcode"
                  type="number" // Suggest number input type for postcode
                  onIonChange={handleInputChange}
                ></IonInput>
              </div>
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 26 */}
          <SwiperSlide>
            <IonItem lines="full">
              <IonLabel className="text-xl font-medium mb-4">
                26. Do you intend to walk on the Bibbulmun Track again?
              </IonLabel>

              <div className="mt-4">
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
              </div>
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 27 */}
          <SwiperSlide>
            <IonItem lines="full">
              <IonLabel className="text-xl font-medium mb-4">
                27. Was the Bibbulmun Track the main reason you came to this particular area?
              </IonLabel>

              <div className="mt-4">
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
              </div>
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 28*/}
          <SwiperSlide>
            <IonItem lines="full">
              <IonLabel className="text-xl font-medium mb-4">
                28. Your gender?
              </IonLabel>

              <div className="mt-4">
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
              </div>
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 29 */}
          <SwiperSlide>
            <IonItem lines="full">
              <IonLabel className="text-xl font-medium mb-4">
                29. Your age group
              </IonLabel>

              <div className="mt-4">
                <IonRadioGroup
                  value={formData.ageGroup}
                  name="ageGroup"
                  onIonChange={handleInputChange}
                >
                  <div className="grid grid-cols-2 gap-4"> {/* Use grid layout for two columns */}
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
              </div>
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 30 */}
          <SwiperSlide>
            <IonItem lines="full">
              <IonLabel className="text-xl font-medium mb-4">
                30. Which best describes the travel group you visited the Bibbulmun Track with during your most recent trip?
              </IonLabel>

              <div className="mt-4">
                {/* Manually managing checkbox state */}
                <div className="grid grid-cols-2 gap-4">
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      value="byYourself"
                      checked={formData.travelGroup.includes("byYourself")}
                      onIonChange={() => handleCheckboxChange("byYourself")}
                    />
                    <IonLabel>By yourself</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      value="withSchoolUniversityGroup"
                      checked={formData.travelGroup.includes("withSchoolUniversityGroup")}
                      onIonChange={() => handleCheckboxChange("withSchoolUniversityGroup")}
                    />
                    <IonLabel>With school/university group</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      value="withFriends"
                      checked={formData.travelGroup.includes("withFriends")}
                      onIonChange={() => handleCheckboxChange("withFriends")}
                    />
                    <IonLabel>With friends</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      value="withClubOrganisation"
                      checked={formData.travelGroup.includes("withClubOrganisation")}
                      onIonChange={() => handleCheckboxChange("withClubOrganisation")}
                    />
                    <IonLabel>With a club/organisation</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      value="withFamily"
                      checked={formData.travelGroup.includes("withFamily")}
                      onIonChange={() => handleCheckboxChange("withFamily")}
                    />
                    <IonLabel>With family</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      value="tourGroup"
                      checked={formData.travelGroup.includes("tourGroup")}
                      onIonChange={() => handleCheckboxChange("tourGroup")}
                    />
                    <IonLabel>Tour group</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      value="withSpousePartner"
                      checked={formData.travelGroup.includes("withSpousePartner")}
                      onIonChange={() => handleCheckboxChange("withSpousePartner")}
                    />
                    <IonLabel>With spouse/partner</IonLabel>
                  </IonItem>
                </div>

                {/* Special "Other" option with an input field */}
                <IonItem lines="none">
                  <IonCheckbox
                    slot="start"
                    value="other"
                    checked={formData.travelGroup.includes("other")}
                    onIonChange={() => handleCheckboxChange("other")}
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
                </IonItem>
              </div>
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>

          {/* Question 31 */}
          <SwiperSlide>
            <IonItem lines="full">
              <IonLabel className="text-xl font-medium mb-4">
                31. Including yourself, how many people in your personal (i.e. family) group were adults and how many were children during your last trip to the Bibbulmun Track?
              </IonLabel>

              <div className="mt-4 space-y-4"> {/* Using space-y-4 for vertical spacing */}
                <IonItem lines="none">
                  <IonLabel position="floating">Number of adults</IonLabel>
                  <IonInput
                    value={formData.adultCount}
                    name="adultCount"
                    type="number"
                    onIonChange={handleInputChange}
                  ></IonInput>
                </IonItem>

                <IonItem lines="none">
                  <IonLabel position="floating">Number of children (aged 4 and under)</IonLabel>
                  <IonInput
                    value={formData.childrenUnder4Count}
                    name="childrenUnder4Count"
                    type="number"
                    onIonChange={handleInputChange}
                  ></IonInput>
                </IonItem>

                <IonItem lines="none">
                  <IonLabel position="floating">Number of children (aged 5 to 17)</IonLabel>
                  <IonInput
                    value={formData.children5to17Count}
                    name="children5to17Count"
                    type="number"
                    onIonChange={handleInputChange}
                  ></IonInput>
                </IonItem>
              </div>
            </IonItem>

            <IonButtons>
              <IonButton onClick={() => swiperRef.current?.slidePrev()}>
                <IonIcon icon={arrowBack} /> Previous
              </IonButton>
              <IonButton onClick={() => swiperRef.current?.slideNext()}>
                Next <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </SwiperSlide>


          {/* Final Slide */}
          <SwiperSlide>
            {formData.heardOfFoundation === 'No' ? (
              // For "No" response from Question 1
              <IonItem>
                <IonLabel>
                  Thank you for your interest. The survey is only for those who have visited the Bibbulmun Track in the last four weeks. Have a great day!
                </IonLabel>
              </IonItem>
            ) : (
              // For all other cases
              <>
                <IonItem>
                  <IonLabel>Thank you for completing the survey!</IonLabel>
                </IonItem>
                <div className="ion-padding ion-text-center">
                  <IonButton
                    expand="block"
                    onClick={handleSubmit}
                    className="ion-margin-top"
                  >
                    Submit Survey
                  </IonButton>
                </div>
              </>
            )}
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
