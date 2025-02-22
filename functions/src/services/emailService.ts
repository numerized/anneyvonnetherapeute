import * as sgMail from '@sendgrid/mail';
import { defineSecret } from 'firebase-functions/params';
import { TherapyEmailType, EmailTemplate } from '../types/emails';

const sendgridApiKey = defineSecret('SENDGRID_API_KEY');

const emailTemplates: Record<TherapyEmailType, EmailTemplate> = {
  [TherapyEmailType.RESERVATION]: {
    templateId: 'd-xxxxx-reservation',
    subject: 'Bienvenue à votre thérapie de couple',
    triggerType: 'immediate'
  },
  [TherapyEmailType.AFTER_SCHEDULE]: {
    templateId: 'd-xxxxx-schedule',
    subject: 'Votre agenda de thérapie',
    triggerType: 'immediate'
  },
  [TherapyEmailType.AFTER_FIRST_COUPLE]: {
    templateId: 'd-xxxxx-after-first',
    subject: 'Suite à votre première séance de couple',
    triggerType: 'afterSession',
    delayDays: 1
  },
  [TherapyEmailType.BEFORE_INDIV_1]: {
    templateId: 'd-xxxxx-before-indiv1',
    subject: 'Préparation pour votre séance individuelle',
    triggerType: 'beforeSession',
    delayDays: 3
  },
  [TherapyEmailType.AFTER_INDIV_1]: {
    templateId: 'd-xxxxx-after-indiv1',
    subject: 'Suite à votre séance individuelle',
    triggerType: 'afterSession',
    delayDays: 1
  },
  [TherapyEmailType.BEFORE_INDIV_2]: {
    templateId: 'd-xxxxx-before-indiv2',
    subject: 'Préparation pour votre deuxième séance individuelle',
    triggerType: 'beforeSession',
    delayDays: 3
  },
  [TherapyEmailType.AFTER_INDIV_2]: {
    templateId: 'd-xxxxx-after-indiv2',
    subject: 'Suite à votre deuxième séance individuelle',
    triggerType: 'afterSession',
    delayDays: 1
  },
  [TherapyEmailType.BEFORE_INDIV_3]: {
    templateId: 'd-xxxxx-before-indiv3',
    subject: 'Préparation pour votre troisième séance individuelle',
    triggerType: 'beforeSession',
    delayDays: 3
  },
  [TherapyEmailType.BEFORE_COUPLE_2]: {
    templateId: 'd-xxxxx-before-couple2',
    subject: 'Préparation pour votre prochaine séance de couple',
    triggerType: 'beforeSession',
    delayDays: 5
  },
  [TherapyEmailType.AFTER_COUPLE_2]: {
    templateId: 'd-xxxxx-after-couple2',
    subject: 'Suite à votre séance de couple',
    triggerType: 'afterSession',
    delayDays: 1
  },
  [TherapyEmailType.AFTER_COUPLE_3]: {
    templateId: 'd-xxxxx-after-couple3',
    subject: 'Suivi de votre thérapie',
    triggerType: 'afterSession',
    delayDays: 14 // 2 weeks
  }
};

export const sendTherapyEmail = async (
  emailType: TherapyEmailType,
  recipientEmail: string,
  dynamicData: Record<string, any>
): Promise<void> => {
  const template = emailTemplates[emailType];
  
  if (!template) {
    throw new Error(`Email template not found for type: ${emailType}`);
  }

  // Initialize SendGrid with API key
  sgMail.setApiKey(sendgridApiKey.value());

  const msg = {
    to: recipientEmail,
    from: 'a.ra@bluewin.ch',
    templateId: template.templateId,
    dynamic_template_data: {
      ...dynamicData,
      subject: template.subject
    }
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(`Failed to send email type ${emailType}:`, error);
    throw error;
  }
};
