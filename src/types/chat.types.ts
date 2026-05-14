
export type MessageRole = 'user' | 'nerro' | 'system';
export type MessageStatus = 'sending' | 'streaming' | 'complete' | 'error';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  isStreaming?: boolean;
  imageUrl?: string;
}

export interface UserBirthData {
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth?: string; // HH:MM
  placeOfBirth: string;
  knowsExactTime: boolean;
}

export interface AstrologyContext {
  fullName: string;
  age: number;
  placeOfBirth: string;
  moonSign: string;
  moonSignEnglish: string;
  nakshatra: string;
  nakshatraPada: number;
  nakshatraLord: string;
  moonLord: string;
  sunSign: string;
  element: string;
  quality: string;
  guna: string;
  approximateAge: number;
  lifePhase: string;
  contextSummary: string;
}

export interface ChatSession {
  sessionId: string;
  birthData: UserBirthData;
  astrologyContext: AstrologyContext;
  messages: ChatMessage[];
  createdAt: Date;
  lastActiveAt: Date;
}
