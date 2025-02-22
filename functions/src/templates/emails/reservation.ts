import { TherapyEmailType } from '../../types/emails';
import { EmailTemplate } from '../types';
import { baseTemplate } from '../base';

export const reservationEmail: EmailTemplate = {
  subject: 'Confirmation de votre inscription',
  triggerType: 'immediate',
  getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Je confirme votre inscription à la thérapie de couple.

Le montant de ${data.paymentAmount} a bien été reçu.

Votre première séance est confirmée pour le ${data.firstSessionDate}.

Je me réjouis de vous rencontrer et de commencer ce travail avec vous.`)
};
