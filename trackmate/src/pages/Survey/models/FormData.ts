/**
 * @fileoverview Form data model for the Bibbulmun Track survey.
 * @author Abdullah
 * @date 2025-04-13
 * @filename FormData.ts
 *
 * This file defines the FormData interface which represents all possible
 * fields that can be collected in the TrackMate survey.
 */

/**
 * Interface representing all possible form fields in the survey
 * Uses an index signature to allow dynamic access to properties
 */
export interface FormData {
  [key: string]: string | string[] | number | boolean | undefined;
  
  /**
   * Unique identifier for the survey submission
   */
  surveyId?: string;
  
  /**
   * Date and time when the survey was submitted
   */
  submissionDate?: string;
  
  /**
   * Whether the user has visited the Bibbulmun Track in the last four weeks
   */
  visitedLastFourWeeks?: string;
  
  /**
   * Date of the user's last visit to the Bibbulmun Track
   */
  lastVisitDate?: string;
  
  /**
   * Whether the user has heard of the Bibbulmun Track Foundation
   */
  heardOfFoundation?: string;
  
  /**
   * What prompted the user to walk the Bibbulmun Track
   */
  promptedToWalk?: string[];
  
  /**
   * Transportation methods used to reach the Bibbulmun Track
   */
  transportUsed?: string[];
  
  /**
   * Other transportation method if not in the predefined list
   */
  otherTransport?: string;
  
  /**
   * Type of trip (day trip, overnight, etc.)
   */
  tripType?: string;
  
  /**
   * Duration of the trip
   */
  tripDuration?: string;
  
  /**
   * Number of nights if the trip was overnight
   */
  tripDurationOvernight?: string;
  
  /**
   * Details about accommodation during the trip
   */
  numberOfNights?: string[];
  
  /**
   * Whether the user recorded their trip in a logbook
   */
  logbookRecord?: string;
  
  /**
   * How frequently the user uses the track
   */
  trackUsage?: string;
  
  /**
   * Number of trips made to the track
   */
  numberOfTrips?: string;
  
  /**
   * Number of half-day trips
   */
  numberOfHalfDays?: string;
  
  /**
   * Number of full-day trips
   */
  numberOfFullDays?: string;
  
  /**
   * User's satisfaction with the track experience
   */
  satisfaction?: string;
  
  /**
   * Whether the user would recommend the track to others
   */
  recommendation?: string;
  
  /**
   * Expenditure details for the track visit
   */
  trackExpenditure?: string[];
  
  /**
   * When the expenditure occurred
   */
  expenditureTiming?: string;
  
  /**
   * Number of people the expenditure covered
   */
  expenditurePeopleCount?: string;
  
  /**
   * Actual count of people
   */
  peopleCount?: string;
  
  /**
   * Annual expenditure on gear for track walking
   */
  annualGearExpenditure?: string;
  
  /**
   * Actual cost of gear
   */
  gearCost?: string;
  
  /**
   * Starting point of the walk
   */
  startPoint?: string;
  
  /**
   * Finishing point of the walk
   */
  finishPoint?: string;
  
  /**
   * Any custom points along the walk
   */
  customPoints?: string;
  
  /**
   * Total distance walked
   */
  totalKilometers?: string;
  
  /**
   * Actual kilometers walked
   */
  kilometers?: string;
  
  /**
   * Benefits of walking on the track (JSON string)
   */
  walkingBenefits?: string;
  
  /**
   * Benefits the track provides to society (JSON string)
   */
  societalBenefits?: string;
  
  // Individual walking benefits
  accessNature?: string;
  appreciateScenic?: string;
  challengeYourself?: string;
  activeHealthy?: string;
  escapeUrban?: string;
  experienceNew?: string;
  relaxUnwind?: string;
  socialise?: string;
  outdoorRecreation?: string;
  connectNature?: string;
  improveQuality?: string;
  increaseAppreciation?: string;
  healthBenefits?: string;
  
  // Individual societal benefits
  greenCorridors?: string;
  communityWellbeing?: string;
  regionalTourism?: string;
  communityPride?: string;
  employment?: string;
  biodiversity?: string;
  physicalFitness?: string;
  businessInvestment?: string;
  
  /**
   * User's place of residence
   */
  residence?: string;
  
  /**
   * User's state or territory if from Australia
   */
  stateTerritory?: string;
  
  /**
   * User's country if from overseas
   */
  overseasCountry?: string;
  
  /**
   * Other country if not in the predefined list
   */
  overseasCountryOther?: string;
  
  /**
   * How far in advance the user decided to walk the track
   */
  decisionTime?: string;
  
  /**
   * User's postcode if from Western Australia
   */
  waPostcode?: string;
  
  /**
   * Actual postcode value
   */
  postcode?: string;
  
  /**
   * Whether the user plans to walk the track again
   */
  walkAgain?: string;
  
  /**
   * Main reason for walking the track
   */
  mainReason?: string;
  
  /**
   * User's gender
   */
  gender?: string;
  
  /**
   * User's age group
   */
  ageGroup?: string;
  
  /**
   * Who the user traveled with
   */
  travelGroup?: string[];
  
  /**
   * Other travel group if not in the predefined list
   */
  travelGroupOther?: string;
  
  /**
   * Composition of the travel group (JSON string)
   */
  groupComposition?: string;
  
  /**
   * Number of adults in the travel group
   */
  numberOfAdults?: string;
  
  /**
   * Number of children 4 and under in the travel group
   */
  numberOfChildren4AndUnder?: string;
  
  /**
   * Number of children 5-17 in the travel group
   */
  numberOfChildren5to17?: string;
}