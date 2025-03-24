// questions.ts - Survey questions for the Bibbulmun Track survey

export type QuestionType = 
  | 'radio' 
  | 'checkbox' 
  | 'text' 
  | 'textarea' 
  | 'date' 
  | 'number'
  | 'select';

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
    required: true,
    condition: {
      questionId: 'visitedLastFourWeeks',
      value: 'yes'
    }
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
    required: true,
    condition: {
      questionId: 'visitedLastFourWeeks',
      value: 'yes'
    }
  },
  {
    id: 'promptedToWalk',
    type: 'checkbox',
    question: 'What first prompted you to walk the Bibbulmun Track?',
    options: [
      { value: 'foundation', label: 'Bibbulmun Track Foundation website' },
      { value: 'parks', label: 'Department of Parks and Wildlife website' },
      { value: 'wordOfMouth', label: 'Word of mouth/friends' },
      { value: 'tourOperator', label: 'Tour operator' },
      { value: 'visitorCentre', label: 'Visitor Centre (local tourism office)' },
      { value: 'localKnowledge', label: 'Local knowledge' },
      { value: 'foundationEvent', label: 'Bibbulmun Track Foundation event' },
      { value: 'brochure', label: 'Brochure' },
      { value: 'trailsWA', label: 'Top Trail/Trails WA website' },
      { value: 'otherWebsite', label: 'Other website' },
      { value: 'magazine', label: 'Tourist magazine/map' },
      { value: 'school', label: 'School Trip' },
      { value: 'other', label: 'Other' }
    ],
    required: true,
    condition: {
      questionId: 'visitedLastFourWeeks',
      value: 'yes'
    }
  },
  {
    id: 'transportUsed',
    type: 'radio',
    question: 'What was your main mode of transport to reach the Bibbulmun Track during your last visit?',
    options: [
      { value: 'walked', label: 'Walked' },
      { value: 'ownCar', label: 'Car (my own)' },
      { value: 'droppedOff', label: 'Car (dropped off)' },
      { value: 'publicTransport', label: 'Public transport (bus/train)' },
      { value: 'tourBus', label: 'Tour bus/coach' },
      { value: 'taxi', label: 'Taxi' },
      { value: 'transportOperator', label: 'Transport operator' },
      { value: 'other', label: 'Other (Please specify)' }
    ],
    required: true,
    condition: {
      questionId: 'visitedLastFourWeeks',
      value: 'yes'
    }
  },
  {
    id: 'tripType',
    type: 'radio',
    question: 'Please indicate if your last trip was:',
    options: [
      { value: 'outAndBack', label: 'Out and back walk' },
      { value: 'oneWay', label: 'One way' }
    ],
    required: true,
    condition: {
      questionId: 'visitedLastFourWeeks',
      value: 'yes'
    }
  },
  {
    id: 'walkDuration',
    type: 'radio',
    question: 'How long did you walk on the Bibbulmun Track during your last trip?',
    options: [
      { value: 'lessThan2', label: 'Less than 2 hours' },
      { value: '2to4', label: '2 to 4 hours' },
      { value: '4to24', label: '4 hours to 1 day' },
      { value: 'overnight', label: 'Overnight (please specify number of nights)' }
    ],
    required: true,
    condition: {
      questionId: 'visitedLastFourWeeks',
      value: 'yes'
    }
  },
  {
    id: 'accommodation',
    type: 'checkbox',
    question: 'During your most recent trip to the Bibbulmun Track, please indicate where you stayed by completing the number of nights stayed (e.g. 5) for each type of accommodation where applicable?',
    subtext: '(If you did not stay overnight please indicate below and go to next question)',
    options: [
      { value: 'didNotStay', label: 'Did not stay overnight (please indicate by typing \'1\')' },
      { value: 'shelter', label: 'Bibbulmun Track camp site - shelter (number of nights)' },
      { value: 'tent', label: 'Bibbulmun Track camp site - tent (number of nights)' },
      { value: 'hostel', label: 'Backpackers/visitor hostel (number of nights)' },
      { value: 'bnb', label: 'Bed and breakfast/guest house (number of nights)' },
      { value: 'caravan', label: 'Other camp site/caravan park off the trail (number of nights)' },
      { value: 'friends', label: 'Family and friends (number of nights)' },
      { value: 'chalet', label: 'Self-contained accommodation/chalets/units (number of nights)' },
      { value: 'hotel', label: 'Hotel/motel/motor inn (number of nights)' }
    ]
  },
  {
    id: 'logbook',
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
    type: 'number',
    question: 'Including your last trip, how often have you used the Bibbulmun Track in the last 12 months?',
    required: true,
    condition: {
      questionId: 'visitedLastFourWeeks',
      value: 'yes'
    },
    subQuestions: [
      {
        id: 'numberOfTrips',
        label: 'Number of individual TRIPS (if first time = 1)',
        min: 1
      },
      {
        id: 'halfDays',
        label: 'Total number of HALF DAYS (e.g. <4 hours) spent on the trail over last 12 months',
        min: 0
      },
      {
        id: 'fullDays',
        label: 'Total number of FULL DAYS (e.g. >4 hours) spent on the trail over last 12 months',
        min: 0
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
    required: true,
    condition: {
      questionId: 'visitedLastFourWeeks',
      value: 'yes'
    }
  }
];