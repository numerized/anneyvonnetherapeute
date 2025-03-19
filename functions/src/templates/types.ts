export interface EmailTemplateData {
  name?: string;
  paymentAmount?: string;
  firstSessionDate?: string;
  appointmentDates?: string;
  testUrl?: string;
  cycle2Url?: string;
  promoCode?: string;
  partnerName?: string;
  firstName1?: string;
  firstName2?: string;
  sessionDate?: string;
  specificExample?: string;
  clientSituation?: string;
  audioCapsuleUrl?: string;
  [key: string]: any;
}

export interface EmailTemplate {
  subject: string;
  triggerType?: 'immediate' | 'beforeSession' | 'afterSession';
  delayDays?: number;
  getHtml: (data: EmailTemplateData) => string;
}

export type TherapyEventType = 'email' | 'session';

export interface TherapyTimelineEvent {
  type: TherapyEventType;
  title: string;
  description: string;
  date?: string;
  delayDays?: number;
  triggerType?: 'immediate' | 'beforeSession' | 'afterSession';
  sessionType?: 'couple' | 'individual';
  partner?: 'male' | 'female' | 'both' | 'partner1' | 'partner2';
}
