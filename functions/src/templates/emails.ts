import { TherapyEmailType } from '../types/emails';
import { EmailTemplate } from './types';

export const emailTemplates: Record<TherapyEmailType, EmailTemplate> = {
  [TherapyEmailType.RESERVATION]: {
    subject: 'Confirmation de votre inscription à la thérapie de couple',
    triggerType: 'immediate',
    getHtml: (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
      <p>Bonjour ${data.name},</p>
      
      <p>Je confirme votre inscription à la thérapie de couple.</p>

      <p>Le montant de ${data.paymentAmount} a bien été reçu.</p>

      <p>Votre première séance est confirmée pour le ${data.firstSessionDate}.</p>

      <p>Je me réjouis de vous rencontrer et de commencer ce travail avec vous.</p>

      <p style="margin-top: 20px;">
        Bien à vous,
      </p>
      <p style="margin-top: 10px;">
        Anne-Yvonne
      </p>
    </div>
  `,
  },
  // Add other email templates here...
};
