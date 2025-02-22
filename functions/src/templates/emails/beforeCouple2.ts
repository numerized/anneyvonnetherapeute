import { TherapyEmailType } from '../../types/emails';
import { EmailTemplate } from '../types';
import { baseTemplate } from '../base';

export const beforeCouple2Email: EmailTemplate = {
  subject: 'Préparation pour votre prochaine séance de couple',
  triggerType: 'beforeSession',
  delayDays: 5,
  getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Notre prochaine séance de couple approche (${data.sessionDate}).

Je vous invite à réfléchir, avec ${data.partnerName}, aux points que vous souhaitez aborder ensemble.

À très bientôt.`)
};
