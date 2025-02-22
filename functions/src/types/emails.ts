export enum TherapyEmailType {
  RESERVATION = 'mail_0',           // Dès réservation et paiement
  BEFORE_COUPLE_1 = 'mail_1',       // Après agenda fixé
  AFTER_COUPLE_1 = 'mail_2',        // 1 jour après première séance de couple
  BEFORE_INDIV_1 = 'mail_3',        // 3 jours avant séance individuelle
  AFTER_INDIV_1 = 'mail_4',         // 1 jour après séance individuelle
  BEFORE_INDIV_2 = 'mail_5',        // 3 jours avant 2em séance individuelle
  AFTER_INDIV_2 = 'mail_as2',       // Apres Indiv 2
  BEFORE_INDIV_3 = 'mail_6',        // 3 jours avant séance individuelle
  BEFORE_COUPLE_2 = 'mail_7',       // 5 jours avant séance de couple
  AFTER_COUPLE_2 = 'mail_8',        // 1 jour après séance de couple
}

export interface EmailTemplate {
  subject: string;
  triggerType: 'immediate' | 'beforeSession' | 'afterSession';
  delayDays?: number;
  getHtml: (data: Record<string, any>) => string;
}

export interface ScheduledEmail {
  emailType: TherapyEmailType;
  recipientEmail: string;
  scheduledFor: Date;
  status: 'pending' | 'sent' | 'error';
  coupleId: string;
  dynamicData?: Record<string, any>;
  error?: string;
  sentAt?: Date;
}
