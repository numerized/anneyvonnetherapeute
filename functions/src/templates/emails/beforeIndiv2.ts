import { TherapyEmailType } from '../../types/emails';
import { EmailTemplate } from '../types';
import { baseTemplate } from '../base';

export const beforeIndiv2Email: EmailTemplate = {
  subject: 'Préparation pour votre deuxième séance individuelle',
  triggerType: 'beforeSession',
  delayDays: 3,
  getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Notre deuxième séance individuelle approche (${data.sessionDate}).

Je vous invite à réfléchir aux points que nous avons abordés lors de notre dernière rencontre et à ce que vous souhaitez approfondir.

À très bientôt.`)
};
