/**
 * @fileoverview Survey questions for the Bibbulmun Track survey.
 * @author Abdullah
 * @date 2025-04-13
 * @filename questions.ts
 *
 * This file contains the survey structure, question types, and all question content
 * for the TrackMate Bibbulmun Track survey.
 */

/**
 * Represents the different types of questions available in the survey
 */
export type QuestionType = 
  | 'radio' 
  | 'checkbox' 
  | 'text' 
  | 'textarea' 
  | 'date' 
  | 'number'
  | 'numberWithSub'
  | 'select';

/**
 * Represents a basic option for select, radio, and checkbox questions
 */
export interface Option {
  /**
   * The value stored when this option is selected
   */
  value: string;
  
  /**
   * The text displayed to the user for this option
   */
  label: string;
}

/**
 * Extends the basic Option interface with a checked state for checkbox questions
 */
export interface CheckboxOption extends Option {
  /**
   * Whether the checkbox is checked by default
   */
  checked?: boolean;
}

/**
 * Represents a sub-question that appears within a parent question
 */
export interface SubQuestion {
  /**
   * Unique identifier for the sub-question
   */
  id: string;
  
  /**
   * Display text for the sub-question
   */
  label: string;
  
  /**
   * Minimum value for number inputs
   */
  min?: number;
  
  /**
   * Maximum value for number inputs
   */
  max?: number;
  
  /**
   * Condition that determines when this sub-question should be shown
   */
  condition?: {
    value: string;
  };
  
  /**
   * Type of the sub-question
   */
  type?: QuestionType;
  
  /**
   * Whether an answer is required for this sub-question
   */
  required?: boolean;
  
  /**
   * Available options for select, radio, or checkbox sub-questions
   */
  options?: Option[];
}

/**
 * Represents a complete survey question
 */
export interface Question {
  /**
   * Unique identifier for the question
   */
  id: string;
  
  /**
   * Type of question (radio, checkbox, text, etc.)
   */
  type: QuestionType;
  
  /**
   * The main question text
   */
  question: string;
  
  /**
   * Additional descriptive text for the question
   */
  description?: string;
  
  /**
   * Smaller text displayed below the main question
   */
  subtext?: string;
  
  /**
   * Available options for select, radio, or checkbox questions
   */
  options?: Option[] | CheckboxOption[];
  
  /**
   * Whether an answer is required for this question
   */
  required?: boolean;
  
  /**
   * Condition that determines when this question should be shown
   */
  condition?: {
    questionId: string;
    value: string | string[];
  };
  
  /**
   * Placeholder text for text inputs
   */
  placeholder?: string;
  
  /**
   * Minimum value for number inputs
   */
  min?: number;
  
  /**
   * Maximum value for number inputs
   */
  max?: number;
  
  /**
   * Sub-questions that appear within this question
   */
  subQuestions?: SubQuestion[];
}

/**
 * Complete list of survey questions with all options and configuration
 */
export const surveyQuestions: Question[] = [
  {
    id: 'visitedLastFourWeeks',
    type: 'radio',
    question: 'Have you visited the Bibbulmun Track in the LAST FOUR WEEKS?',
    options: [
      { value: 'yes', label: 'Yes (Please continue survey)' },
      { value: 'no', label: 'No (Thank you for your time. The survey is complete.)' }
    ],
    required: true
  },
  {
    id: 'lastVisitDate',
    type: 'date',
    question: 'What was the date of your last visit to the Bibbulmun Track? (If unsure of exact date, enter day as 01 of the month you visited)',
    placeholder: 'Select date',
    required: true
  },
  {
    id: 'heardOfFoundation',
    type: 'radio',
    question: 'Have you heard of the Bibbulmun Track Foundation or Friends of the Bibbulmun Track previously?',
    options: [
      { value: 'heardBefore', label: 'Yes - Heard of them before' },
      { value: 'currentMember', label: 'Yes - Current member' },
      { value: 'formerMember', label: 'Yes - Used to be a member' },
      { value: 'no', label: 'No' }
    ],
    required: true
  },
  {
    id: 'promptedToWalk',
    type: 'checkbox',
    question: 'What first prompted you to walk the Bibbulmun Track?',
    options: [
      { value: 'foundationWebsite', label: 'Bibbulmun Track Foundation website' },
      { value: 'parks', label: 'Department of Parks and Wildlife website' },
      { value: 'wordOfMouth', label: 'Word of mouth/friends' },
      { value: 'tourOperator', label: 'Tour operator' },
      { value: 'visitorCentre', label: 'Visitor Centre (local tourism office)' },
      { value: 'localKnowledge', label: 'Local knowledge' },
      { value: 'foundationEvent', label: 'Bibbulmun Track Foundation event' },
      { value: 'brochure', label: 'Brochure' },
      { value: 'trailsWAWebsite', label: 'Top Trail/Trails WA website' },
      { value: 'otherWebsite', label: 'Other website' },
      { value: 'touristMagazine', label: 'Tourist magazine/map' },
      { value: 'schoolTrip', label: 'School Trip' },
      { value: 'other', label: 'Other' }
    ],
    required: true
  },
  {
    id: 'transportUsed',
    type: 'radio',
    question: 'What was your main mode of transport to reach the Bibbulmun Track during your last visit?',
    options: [
      { value: 'walked', label: 'Walked' },
      { value: 'ownCar', label: 'Car (my own)' },
      { value: 'carDroppedOff', label: 'Car (dropped off)' },
      { value: 'publicTransport', label: 'Public transport (bus/train)' },
      { value: 'tourBus', label: 'Tour bus/coach' },
      { value: 'taxi', label: 'Taxi' },
      { value: 'transportOperator', label: 'Transport operator' },
      { value: 'other', label: 'Other' }
    ],
    required: true,
    subQuestions: [
      {
        id: 'otherTransport',
        label: 'Please specify:',
        type: 'text',
        condition: {
          value: 'other'
        },
        required: true
      }
    ]
  },
  {
    id: 'tripType',
    type: 'radio',
    question: 'Please indicate if your last trip was:',
    options: [
      { value: 'outAndBack', label: 'Out and back walk' },
      { value: 'oneWay', label: 'One way' }
    ],
    required: true
  },
  {
    id: 'tripDuration',
    type: 'radio',
    question: 'How long did you walk on the Bibbulmun Track during your last trip?',
    options: [
      { value: 'lessThan2', label: 'Less than 2 hours' },
      { value: '2to4', label: '2 to 4 hours' },
      { value: '4to24', label: '4 hours to 1 day' },
      { value: 'overnight', label: 'Overnight' }
    ],
    required: true,
    subQuestions: [
      {
        id: 'tripDurationOvernight',
        label: 'Number of nights:',
        condition: {
          value: 'overnight'
        },
        min: 1,
        required: true
      }
    ]
  },
  {
    id: 'numberOfNights',
    type: 'numberWithSub',
    question: 'During your most recent trip to the Bibbulmun Track, please indicate where you stayed by completing the number of nights stayed (e.g. 5) for each type of accommodation where applicable?',
    subtext: '(If you did not stay overnight please indicate below and go to next question)',
    required: true,
    subQuestions: [
      {
        id: 'noStayNights',
        type: 'number',
        label: 'Did not stay overnight (please indicate by typing \'1\')',
        min: 1,
        max: 1,
        required: false
      },
      {
        id: 'trackShelterNights',
        type: 'number',
        label: 'Bibbulmun Track camp site - shelter',
        min: 1,
        required: false
      },
      {
        id: 'trackTentNights',
        type: 'number',
        label: 'Bibbulmun Track camp site - tent',
        min: 1,
        required: false
      },
      {
        id: 'hostelNights',
        type: 'number',
        label: 'Backpackers/visitor hostel',
        min: 1,
        required: false
      },
      {
        id: 'bnbNights',
        type: 'number',
        label: 'Bed and breakfast/guest house',
        min: 1,
        required: false
      },
      {
        id: 'caravanNights',
        type: 'number',
        label: 'Other camp site/caravan park off the trail',
        min: 1,
        required: false
      },
      {
        id: 'friendsNights',
        type: 'number',
        label: 'Family and friends',
        min: 1,
        required: false
      },
      {
        id: 'chaletNights',
        type: 'number',
        label: 'Self-contained accommodation/chalets/units',
        min: 1,
        required: false
      },
      {
        id: 'hotelNights',
        type: 'number',
        label: 'Hotel/motel/motor inn',
        min: 1,
        required: false
      }
    ]
  },
  {
    id: 'logbookRecord',
    type: 'radio',
    question: 'Did you record your walk in a green log-book at the campsites?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'noVisit', label: "Didn't visit a camp site" }
    ],
    required: true
  },
  {
    id: 'trackUsage',
    type: 'numberWithSub',
    question: 'Including your last trip, how often have you used the Bibbulmun Track in the last 12 months?',
    required: true,
    subQuestions: [
      {
        id: 'numberOfTrips',
        label: 'Number of individual TRIPS (if first time = 1)',
        min: 1,
        required: true
      },
      {
        id: 'numberOfHalfDays',
        label: 'Total number of HALF DAYS (e.g. <4 hours) spent on the trail over last 12 months',
        min: 0,
        required: true
      },
      {
        id: 'numberOfFullDays',
        label: 'Total number of FULL DAYS (e.g. >4 hours) spent on the trail over last 12 months',
        min: 0,
        required: true
      }
    ]
  },
  
  {
    id: 'satisfaction',
    type: 'radio',
    question: 'For your last trip, overall how satisfied were you with your walk on the Bibbulmun Track?',
    options: [
      { value: '1', label: 'Not at all satisfied' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: 'Extremely satisfied' }
    ],
    required: true
  },
  {
    id: 'recommendation',
    type: 'radio',
    question: 'How strongly would you recommend a walk on the Bibbulmun Track to friends who share your interests?',
    options: [
      { value: 'Not at all', label: 'Not at all' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: 'very strongly', label: 'Very strongly' }
    ],
    required: true
  },
  {
    id: 'trackExpenditure',
    type: 'numberWithSub',
    question: 'During your most recent trip to the Bibbulmun Track in the last four weeks, would you mind telling us how much you spent to access and use the track? ($Australian - type in amount only e.g. 50 (no $) to nearest dollar value). (If money was not spent for a particular category please leave blank).',
    required: false,
    subQuestions: [
      {
        id: 'travelTransportCost',
        label: 'Travel/transport (fuel, car hire, taxi etc.) to and from the Bibbulmun Track',
        type: 'number',
        min: 0,
        required: false
      },
      {
        id: 'accommodationCost',
        label: 'Accommodation',
        type: 'number',
        min: 0,
        required: false
      },
      {
        id: 'foodSuppliesCost',
        label: 'Food/drink supplies/medicinals',
        type: 'number',
        min: 0,
        required: false
      },
      {
        id: 'mealsOutCost',
        label: 'Meals (eating out)',
        type: 'number',
        min: 0,
        required: false
      },
      {
        id: 'activitiesCost',
        label: 'Activities (sightseeing trips, tours, lessons, etc.)',
        type: 'number',
        min: 0,
        required: false
      },
      {
        id: 'equipmentCost',
        label: 'Equipment (purchased or hired for this trip)',
        type: 'number',
        min: 0,
        required: false
      },
      {
        id: 'mapsCost',
        label: 'Maps, guides and other publications (purchased for this trip)',
        type: 'number',
        min: 0,
        required: false
      },
      {
        id: 'otherCost',
        label: 'Other (clothing, merchandise, souvenirs, etc. purchased for this trip)',
        type: 'number',
        min: 0,
        required: false
      }
    ]
  },
  {
    id: 'expenditureTiming',
    type: 'radio',
    question: 'Please indicate if the previous figures are',
    options: [
      { value: 'perNight', label: 'per night, or' },
      { value: 'totalTrip', label: 'for the total length of your most recent trip' }
    ],
    required: true
  },
  {
    id: 'expenditurePeopleCount',
    type: 'numberWithSub',
    question: 'Including yourself, how many people do these figures cover?',
    required: true,
    subQuestions: [
      {
        id: 'peopleCount',
        label: 'Number of people',
        min: 1,
        required: true
      }
    ]
  },
  {
    id: 'annualGearExpenditure',
    type: 'numberWithSub',
    question: 'How much would you spend ($ Australian) on bushwalking gear in an average year? (e.g. backpack, books, clothes, shoes, maps etc.)',
    required: true,
    subQuestions: [
      {
        id: 'gearCost',
        label: 'Annual gear expenditure ($)',
        min: 0,
        required: true
      }
    ]
  },
  {
    id: 'walkPoints',
    type: 'select',
    question: 'What was the start and finish point for your walk on the Bibbulmun Track during your last trip?',
    description: 'Select your start and finish point from the access point lists in the drop down boxes below (If you require assistance to determine your start and finish point, please click on the link and select \'Access Points\' in the legend:',
    subtext: '<a href="https://www.bibbulmuntrack.org.au/trip-planner/track-sections/" target="_blank">Bibbulmun Track section by section map</a> (this link will open in a new window)',
    options: [
      { value: 'kalamunda', label: 'Kalamunda (Northern Terminus)' },
      { value: 'mundaring', label: 'Mundaring' },
      { value: 'dwellingup', label: 'Dwellingup' },
      { value: 'collie', label: 'Collie' },
      { value: 'balingup', label: 'Balingup' },
      { value: 'donnellyRiver', label: 'Donnelly River Village' },
      { value: 'pemberton', label: 'Pemberton' },
      { value: 'northcliffe', label: 'Northcliffe' },
      { value: 'walpole', label: 'Walpole' },
      { value: 'peacefulBay', label: 'Peaceful Bay' },
      { value: 'denmark', label: 'Denmark' },
      { value: 'albany', label: 'Albany (Southern Terminus)' },
      // Major access points from each section
      { value: 'mundaringWeir', label: 'Mundaring Weir' },
      { value: 'northBannister', label: 'North Bannister' },
      { value: 'glenMervyn', label: 'Glen Mervyn Dam' },
      { value: 'southampton', label: 'Southampton Bridge' },
      { value: 'oneBridge', label: 'One Tree Bridge' },
      { value: 'beedelup', label: 'Beedelup Falls' },
      { value: 'mandalay', label: 'Mandalay Beach' },
      { value: 'coalmine', label: 'Coalmine Beach' },
      { value: 'parryBeach', label: 'Parry Beach' },
      { value: 'torbay', label: 'Torbay Inlet' },
      { value: 'mutton', label: 'Mutton Bird' }
    ],
    required: true,
    subQuestions: [
      {
        id: 'startPoint',
        label: 'Start point',
        type: 'select',
        required: true
      },
      {
        id: 'finishPoint',
        label: 'Finish/turn around point',
        type: 'select',
        required: true
      },
      {
        id: 'customPoints',
        label: 'If different to the above (please specify start and finish point)',
        type: 'text',
        required: false
      }
    ]
  },
  {
    id: 'totalKilometers',
    type: 'number',
    question: 'How many kilometres did you cover in total during your last trip on the Bibbulmun Track? (Please use a whole number)',
    description: 'If you are unsure, you can use the Bibbulmun Track distance calculator to help you.',
    subtext: 'You can find the distance calculator at <a href="https://www.bibbulmuntrack.org.au/trip-planner-and-track-info/track-sections-and-campsites/" target="_blank">Bibbulmun Track Foundation website</a>.',
    required: true,
    min: 0
  },
  {
    id: 'walkingBenefits',
    type: 'select',
    question: 'Please indicate your level of agreement with each of the following statements.\nWalking on the Bibbulmun Track provides me with the following opportunities or benefits:',
    required: true,
    subQuestions: [
      {
        id: 'accessNature',
        label: 'Access natural experiences',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'appreciateScenic',
        label: 'Appreciate scenic beauty',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'challengeYourself',
        label: 'Challenge yourself',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'activeHealthy',
        label: 'Engage in an active/healthy activity',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'escapeUrban',
        label: 'Escape the urban environment',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'experienceNew',
        label: 'Experience something new and different',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'relaxUnwind',
        label: 'Relax and unwind',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'socialise',
        label: 'Socialise with friends and family',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'outdoorRecreation',
        label: 'Participate in outdoor recreation activities',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'connectNature',
        label: 'Connect with nature',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'improveQuality',
        label: 'Improve quality of life',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'increaseAppreciation',
        label: 'Increase appreciation of the natural environment',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'healthBenefits',
        label: 'Achieve physical and mental health benefits',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      }
    ]
  },
  {
    id: 'societalBenefits',
    type: 'select',
    question: 'Please indicate on the scale below your level of agreement with each of the following statements.\nThe Bibbulmun Track provides the following benefits to society:',
    required: true,
    subQuestions: [
      {
        id: 'greenCorridors',
        label: 'Provision of green corridors/spaces',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'communityWellbeing',
        label: 'Increased community wellbeing',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'regionalTourism',
        label: 'Increased tourism in regional centres',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'communityPride',
        label: 'Increased community pride',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'employment',
        label: 'Generation of employment',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'biodiversity',
        label: 'Protection of biological diversity',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'physicalFitness',
        label: 'Encouraging physical fitness and healthy lifestyles',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      },
      {
        id: 'businessInvestment',
        label: 'Increased business investment',
        type: 'select',
        required: true,
        options: [
          { value: 'veryStronglyDisagree', label: 'Very strongly disagree' },
          { value: 'stronglyDisagree', label: 'Strongly disagree' },
          { value: 'disagree', label: 'Disagree' },
          { value: 'undecided', label: 'Undecided' },
          { value: 'agree', label: 'Agree' },
          { value: 'stronglyAgree', label: 'Strongly agree' },
          { value: 'veryStronglyAgree', label: 'Very strongly agree' }
        ]
      }
    ]
  },
  {
    id: 'residence',
    type: 'radio',
    question: 'Where is your usual place of residence?',
    options: [
      { value: 'australia', label: 'Australia' },
      { value: 'overseas', label: 'Overseas' }
    ],
    required: true
  },
  {
    id: 'stateTerritory',
    type: 'radio',
    question: 'If you are an Australian resident, what state/territory do you live in?',
    options: [
      { value: 'act', label: 'Australian Capital Territory' },
      { value: 'nsw', label: 'New South Wales' },
      { value: 'nt', label: 'Northern Territory' },
      { value: 'qld', label: 'Queensland' },
      { value: 'sa', label: 'South Australia' },
      { value: 'tas', label: 'Tasmania' },
      { value: 'vic', label: 'Victoria' },
      { value: 'wa', label: 'Western Australia' }
    ],
    required: true,
    condition: {
      questionId: 'residence',
      value: 'australia'
    }
  },
  {
    id: 'overseasCountry',
    type: 'radio',
    question: 'If you normally reside overseas, what country are you from? (please select from the list below)',
    options: [
      { value: 'austria', label: 'Austria' },
      { value: 'belgium', label: 'Belgium' },
      { value: 'canada', label: 'Canada' },
      { value: 'china', label: 'China' },
      { value: 'denmark', label: 'Denmark' },
      { value: 'france', label: 'France' },
      { value: 'germany', label: 'Germany' },
      { value: 'hongKong', label: 'Hong Kong' },
      { value: 'india', label: 'India' },
      { value: 'indonesia', label: 'Indonesia' },
      { value: 'italy', label: 'Italy' },
      { value: 'japan', label: 'Japan' },
      { value: 'korea', label: 'Korea' },
      { value: 'malaysia', label: 'Malaysia' },
      { value: 'netherlands', label: 'Netherlands' },
      { value: 'newZealand', label: 'New Zealand' },
      { value: 'norway', label: 'Norway' },
      { value: 'singapore', label: 'Singapore' },
      { value: 'southAfrica', label: 'South Africa' },
      { value: 'southAmerica', label: 'South America' },
      { value: 'sweden', label: 'Sweden' },
      { value: 'switzerland', label: 'Switzerland' },
      { value: 'taiwan', label: 'Taiwan' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'usa', label: 'United States of America' },
      { value: 'other', label: 'Other' }
    ],
    required: true,
    condition: {
      questionId: 'residence',
      value: 'overseas'
    },
    subQuestions: [
      {
        id: 'overseasCountryOther',
        label: 'Please specify your country:',
        type: 'text',
        condition: {
          value: 'other'
        },
        required: true
      }
    ]
  },
  {
    id: 'decisionTime',
    type: 'radio',
    question: 'If from overseas or interstate, when did you decide to walk on the Bibbulmun Track?',
    options: [
      { value: 'beforeArriving', label: 'Before arriving in Western Australia' },
      { value: 'afterArriving', label: 'After arriving in Western Australia' }
    ],
    required: true
  },
  {
    id: 'waPostcode',
    type: 'numberWithSub',
    question: 'If you are a Western Australian resident, what is your postcode?',
    required: true,
    condition: {
      questionId: 'stateTerritory',
      value: 'wa'
    },
    subQuestions: [
      {
        id: 'postcode',
        label: 'Postcode',
        min: 6000,
        max: 6999,
        required: true
      }
    ]
  },
  {
    id: 'walkAgain',
    type: 'radio',
    question: 'Do you intend to walk on the Bibbulmun Track again?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
    required: true
  },
  {
    id: 'mainReason',
    type: 'radio',
    question: 'Was the Bibbulmun Track the main reason you came to this particular area?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
    required: true
  },
  {
    id: 'gender',
    type: 'radio',
    question: 'Your gender?',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ],
    required: true
  },
  {
    id: 'ageGroup',
    type: 'radio',
    question: 'Your age group',
    options: [
      { value: '18-24', label: '18-24' },
      { value: '25-34', label: '25-34' },
      { value: '35-44', label: '35-44' },
      { value: '45-54', label: '45-54' },
      { value: '55-64', label: '55-64' },
      { value: '65-69', label: '65-69' },
      { value: '70-75', label: '70-75' },
      { value: '75+', label: '75 or older' }
    ],
    required: true
  },
  {
    id: 'travelGroup',
    type: 'checkbox',
    question: 'Which best describes the travel group you visited the Bibbulmun Track with during your most recent trip?',
    options: [
      { value: 'byYourself', label: 'By yourself' },
      { value: 'withFriends', label: 'With friends' },
      { value: 'withFamily', label: 'With family' },
      { value: 'withSpousePartner', label: 'With spouse/partner' },
      { value: 'withSchoolUniversity', label: 'With school/university group' },
      { value: 'withClubOrganisation', label: 'With a club/organisation' },
      { value: 'tourGroup', label: 'Tour group' },
      { value: 'other', label: 'Other (please specify)' }
    ],
    required: true,
    subQuestions: [
      {
        id: 'travelGroupOther',
        label: 'Please specify:',
        type: 'text',
        condition: {
          value: 'other'
        },
        required: true
      }
    ]
  },
  {
    id: 'groupComposition',
    type: 'numberWithSub',
    question: 'Including yourself, how many people in your personal (i.e. family) group were adults and how many were children during your last trip to the Bibbulmun Track?',
    required: true,
    subQuestions: [
      {
        id: 'numberOfAdults',
        label: 'Number of adults',
        min: 1,
        required: true
      },
      {
        id: 'numberOfChildren4AndUnder',
        label: 'Number of children (aged 4 and under)',
        min: 0,
        required: true
      },
      {
        id: 'numberOfChildren5to17',
        label: 'Number of children (aged 5 to 17)',
        min: 0,
        required: true
      }
    ]
  }
];