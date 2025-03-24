// models/FormData.ts

export interface FormData {
  [key: string]: string | string[] | boolean | undefined;
  reportId?: string;
  submissionDate?: string;
  lastVisitDate?: string;
  visitedLastFourWeeks?: string;
  heardOfFoundation?: string;
  promptedToWalk?: string[];
  transportUsed?: string;
  transportUsedOther?: string;
  tripType?: string;
  walkDuration?: string;
  walkDurationNights?: string;
  numberOfNights?: string;
  noStay?: string;
  trackShelter?: string;
  trackTent?: string;
  backpackers?: string;
  hotel?: string;
  bnb?: string;
  familyFriends?: string;
  otherCampsite?: string;
  satisfaction?: string;
  gender?: string;
  ageGroup?: string;
  residence?: string;
  postcode?: string;
  stateTerritory?: string;
  overseasCountry?: string;
  travelGroup?: string;
  adultCount?: string;
  childrenUnder4Count?: string;
  children5to17Count?: string;
  timestamp?: string;
  submitted?: boolean;
}