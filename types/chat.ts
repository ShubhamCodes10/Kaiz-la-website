export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  stage: string;
  lead: any;
}

export interface LeadData {
  productInterest?: string;
  orderVolume?: string;
  preferredRegion?: string;
  sourcingTimeline?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  scheduledCall?: boolean;
}
