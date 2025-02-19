export type ChatStep = 'REGION' | 'PERIOD' | 'RESULT';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  step: ChatStep;
}

export interface ChatState {
  messages: ChatMessage[];
  currentStep: ChatStep;
  selectedRegion?: string;
  selectedPeriod?: {
    start: Date;
    end: Date;
  } | string;
} 