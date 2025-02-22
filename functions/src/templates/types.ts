import { TherapyEmailType } from '../types/emails';

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
