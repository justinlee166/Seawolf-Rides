import {
  PrototypeCommuterResult,
  PrototypeConversation,
  ScheduledRide,
} from './types';

// Frontend-only M2 fixtures. None of these values are calculated or persisted.
export const rideSearchFixture = {
  startingArea: 'Flushing, Queens',
  destination: 'Stony Brook University',
  day: 'Monday',
  arrivalTarget: '9:00 AM',
  scheduleFlexibility: '±15 minutes',
} as const;

export const commuterResultFixtures: PrototypeCommuterResult[] = [
  {
    id: 'alex-monday',
    driverName: 'Alex',
    driverRole: 'Driver',
    originArea: 'Bayside, Queens',
    destination: 'Stony Brook University',
    pickupEstimate: '7:40 AM',
    arrivalEstimate: '8:50 AM',
    addedDetourMinutes: 6,
    seatsAvailable: 2,
    recurringDays: ['Monday', 'Wednesday', 'Friday'],
    routeStops: ['Bayside, Queens', 'Pickup near rider', 'Stony Brook University'],
  },
  {
    id: 'sarah-monday',
    driverName: 'Sarah',
    driverRole: 'Driver',
    originArea: 'Flushing, Queens',
    destination: 'Stony Brook University',
    pickupEstimate: '7:35 AM',
    arrivalEstimate: '8:45 AM',
    addedDetourMinutes: 8,
    seatsAvailable: 1,
    recurringDays: ['Monday', 'Wednesday'],
    routeStops: ['Flushing, Queens', 'Pickup near rider', 'Stony Brook University'],
  },
];

export const scheduledRideFixtures: ScheduledRide[] = [
  {
    id: 'alex-upcoming',
    day: 'Monday',
    dateLabel: 'Monday, September 28',
    driverName: 'Alex',
    riderName: 'You',
    pickupTime: '7:40 AM',
    expectedArrival: '~8:50 AM',
    origin: 'Flushing, Queens',
    destination: 'Stony Brook University',
    routeStops: ['Driver origin', 'Rider pickup', 'Stony Brook University'],
    chatId: 'alex-chat',
  },
];

export const conversationFixtures: PrototypeConversation[] = [
  {
    preview: {
      id: 'alex-chat',
      participantName: 'Alex',
      commuteLabel: 'Monday commute',
      lastMessage: 'See you around 7:40!',
      timestamp: '9:18 AM',
    },
    messages: [
      {
        id: 'alex-1',
        sender: 'driver',
        text: 'Hi! I can meet near Main Street for Monday’s commute.',
        timestamp: '9:12 AM',
      },
      {
        id: 'alex-2',
        sender: 'me',
        text: 'That works for me. I’ll be ready a few minutes early.',
        timestamp: '9:16 AM',
      },
      {
        id: 'alex-3',
        sender: 'driver',
        text: 'Great — see you around 7:40!',
        timestamp: '9:18 AM',
      },
    ],
  },
  {
    preview: {
      id: 'sarah-chat',
      participantName: 'Sarah',
      commuteLabel: 'Wednesday commute',
      lastMessage: 'That pickup spot works for me.',
      timestamp: 'Yesterday',
    },
    messages: [
      {
        id: 'sarah-1',
        sender: 'me',
        text: 'Would the library entrance work as an approximate pickup area?',
        timestamp: '4:32 PM',
      },
      {
        id: 'sarah-2',
        sender: 'driver',
        text: 'That pickup spot works for me.',
        timestamp: '4:38 PM',
      },
    ],
  },
];
