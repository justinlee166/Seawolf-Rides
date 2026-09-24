export interface PrototypeCommuterResult {
  id: string;
  driverName: string;
  driverRole: 'Driver';
  originArea: string;
  destination: string;
  pickupEstimate: string;
  arrivalEstimate: string;
  addedDetourMinutes: number;
  seatsAvailable: number;
  recurringDays: string[];
  routeStops: string[];
}

export interface ScheduledRide {
  id: string;
  day: string;
  dateLabel: string;
  driverName: string;
  riderName: string;
  pickupTime: string;
  expectedArrival: string;
  origin: string;
  destination: string;
  routeStops: string[];
  chatId: string;
}

export interface ChatPreview {
  id: string;
  participantName: string;
  commuteLabel: string;
  lastMessage: string;
  timestamp: string;
}

export interface PrototypeChatMessage {
  id: string;
  sender: 'me' | 'driver';
  text: string;
  timestamp: string;
}

export interface PrototypeConversation {
  preview: ChatPreview;
  messages: PrototypeChatMessage[];
}
