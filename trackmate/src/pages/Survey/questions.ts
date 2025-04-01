// questions.ts - Survey questions for the Bibbulmun Track survey

export type QuestionType = 
  | 'radio' 
  | 'checkbox' 
  | 'text' 
  | 'textarea' 
  | 'date' 
  | 'number'
  | 'numberWithSub'
  | 'select'
  | 'matrix';

export interface Option {
  value: string;
  label: string;
}

export interface CheckboxOption extends Option {
  checked?: boolean;
}

export interface SubQuestion {
  id: string;
  label: string;
  min?: number;
  max?: number;
  condition?: {
    value: string;
  };
  type?: QuestionType;
  required?: boolean;
  options?: Option[];
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  description?: string;
  subtext?: string;
  options?: Option[] | CheckboxOption[];
  required?: boolean;
  condition?: {
    questionId: string;
    value: string | string[];
  };
  placeholder?: string;
  min?: number;
  max?: number;
  subQuestions?: SubQuestion[];
}

export const welcomeText = `
# Quick Survey

Dear trail user,

The Bibbulmun Track is a trail managed by the Department of Parks and Wildlife in partnership with the Bibbulmun Track Foundation. This survey aims to obtain your views about your visit within the last four weeks to the Bibbulmun Track.

Your feedback will enable us to gain a better understanding of Bibbulmun Track users and the economics of the Track – what do people spend getting out on the Track. There are also questions in the survey that will offer insights into other values of the Track, including health and social benefits.

The results of the survey will assist us to continually improve the design and management of the Track and support funding negotiations.

<strong>PLEASE ONLY CONTINUE THIS SURVEY IF YOU HAVE VISITED THE BIBBULMUN TRACK IN THE LAST FOUR WEEKS.</strong>

The survey is representative of only the person completing the form, so please answer for yourself only. Your answers are confidential and will be analysed independently.

Your feedback is important to us. Thank you for sharing your thoughts and ideas.
`;

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
    type: 'checkbox',
    question: 'During your most recent trip to the Bibbulmun Track, please indicate where you stayed by completing the number of nights stayed (e.g. 5) for each type of accommodation where applicable?',
    subtext: '(If you did not stay overnight please indicate below and go to next question)',
    options: [
      { value: 'noStay', label: 'Did not stay overnight (please indicate by typing \'1\')' },
      { value: 'trackShelter', label: 'Bibbulmun Track camp site - shelter' },
      { value: 'trackTent', label: 'Bibbulmun Track camp site - tent' },
      { value: 'hostel', label: 'Backpackers/visitor hostel' },
      { value: 'bnb', label: 'Bed and breakfast/guest house' },
      { value: 'caravan', label: 'Other camp site/caravan park off the trail' },
      { value: 'friends', label: 'Family and friends' },
      { value: 'chalet', label: 'Self-contained accommodation/chalets/units' },
      { value: 'hotel', label: 'Hotel/motel/motor inn' }
    ],
    subQuestions: [
      {
        id: 'noStayNights',
        type: 'number',
        label: 'Please specify:',
        condition: {
          value: 'noStay'
        },
        min: 1,
        max: 1,
        required: true
      },
      {
        id: 'trackShelterNights',
        type: 'number',
        label: 'Please specify:',
        condition: {
          value: 'trackShelter'
        },
        min: 1,
        required: true
      },
      {
        id: 'trackTentNights',
        type: 'number',
        label: 'Please specify:',
        condition: {
          value: 'trackTent'
        },
        min: 1,
        required: true
      },
      {
        id: 'hostelNights',
        type: 'number',
        label: 'Please specify:',
        condition: {
          value: 'hostel'
        },
        min: 1,
        required: true
      },
      {
        id: 'bnbNights',
        type: 'number',
        label: 'Please specify:',
        condition: {
          value: 'bnb'
        },
        min: 1,
        required: true
      },
      {
        id: 'caravanNights',
        type: 'number',
        label: 'Please specify:',
        condition: {
          value: 'caravan'
        },
        min: 1,
        required: true
      },
      {
        id: 'friendsNights',
        type: 'number',
        label: 'Please specify:',
        condition: {
          value: 'friends'
        },
        min: 1,
        required: true
      },
      {
        id: 'chaletNights',
        type: 'number',
        label: 'Please specify:',
        condition: {
          value: 'chalet'
        },
        min: 1,
        required: true
      },
      {
        id: 'hotelNights',
        type: 'number',
        label: 'Please specify:',
        condition: {
          value: 'hotel'
        },
        min: 1,
        required: true
      }
    ],
    required: true
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
    type: 'checkbox',
    question: 'During your most recent trip to the Bibbulmun Track in the last four weeks, would you mind telling us how much you spent to access and use the track? ($Australian - type in amount only e.g. 50 (no $) to nearest dollar value). (If money was not spent for a particular category please leave blank).',
    options: [
      { value: 'travelTransport', label: 'Travel/transport (fuel, car hire, taxi etc.) to and from the Bibbulmun Track' },
      { value: 'accommodation', label: 'Accommodation' },
      { value: 'foodSupplies', label: 'Food/drink supplies/medicinals' },
      { value: 'mealsOut', label: 'Meals (eating out)' },
      { value: 'activities', label: 'Activities (sightseeing trips, tours, lessons, etc.)' },
      { value: 'equipment', label: 'Equipment (purchased or hired for this trip)' },
      { value: 'maps', label: 'Maps, guides and other publications (purchased for this trip)' },
      { value: 'other', label: 'Other (clothing, merchandise, souvenirs, etc. purchased for this trip)' }
    ],
    subQuestions: [
      {
        id: 'travelTransportCost',
        type: 'number',
        label: 'Please specify amount:',
        condition: {
          value: 'travelTransport'
        },
        min: 0,
        required: true
      },
      {
        id: 'accommodationCost',
        type: 'number',
        label: 'Please specify amount:',
        condition: {
          value: 'accommodation'
        },
        min: 0,
        required: true
      },
      {
        id: 'foodSuppliesCost',
        type: 'number',
        label: 'Please specify amount:',
        condition: {
          value: 'foodSupplies'
        },
        min: 0,
        required: true
      },
      {
        id: 'mealsOutCost',
        type: 'number',
        label: 'Please specify amount:',
        condition: {
          value: 'mealsOut'
        },
        min: 0,
        required: true
      },
      {
        id: 'activitiesCost',
        type: 'number',
        label: 'Please specify amount:',
        condition: {
          value: 'activities'
        },
        min: 0,
        required: true
      },
      {
        id: 'equipmentCost',
        type: 'number',
        label: 'Please specify amount:',
        condition: {
          value: 'equipment'
        },
        min: 0,
        required: true
      },
      {
        id: 'mapsCost',
        type: 'number',
        label: 'Please specify amount:',
        condition: {
          value: 'maps'
        },
        min: 0,
        required: true
      },
      {
        id: 'otherCost',
        type: 'number',
        label: 'Please specify amount:',
        condition: {
          value: 'other'
        },
        min: 0,
        required: true
      }
    ],
    required: false
  },
  {
    id: 'expenditureTiming',
    type: 'radio',
    question: 'Please indicate if the above figures are',
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
    type: 'numberWithSub',
    question: 'How many kilometres did you cover in total during your last trip on the Bibbulmun Track? (Please use a whole number)',
    description: 'If you require assistance in calculating the distance, please click on the link:',
    subtext: '<a href="https://www.bibbulmuntrack.org.au/trip-planner/distance-calculator/" target="_blank">Bibbulmun Track distance calculator</a> (this link will open in a new window)',
    required: true,
    subQuestions: [
      {
        id: 'kilometers',
        label: 'Total kilometers',
        min: 0,
        required: true
      }
    ]
  },
  {
    id: 'walkingBenefits',
    type: 'matrix',
    question: 'Please indicate on the scale below your level of agreement with each of the following statements.\nWalking on the Bibbulmun Track provides me with the following opportunities or benefits:',
    required: true,
    subQuestions: [
      {
        id: 'accessNature',
        label: 'Access natural experiences',
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
    type: 'matrix',
    question: 'Please indicate on the scale below your level of agreement with each of the following statements.\nThe Bibbulmun Track provides the following benefits to society:',
    required: true,
    subQuestions: [
      {
        id: 'greenCorridors',
        label: 'Provision of green corridors/spaces',
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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
    required: true
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