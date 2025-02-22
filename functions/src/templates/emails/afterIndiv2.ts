import { TherapyEmailType } from '../../types/emails';
import { EmailTemplate } from '../types';
import { baseTemplate } from '../base';

export const afterIndiv2Email: EmailTemplate = {
  subject: 'Suite à votre séance individuelle',
  triggerType: 'afterSession',
  delayDays: 1,
  getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Un grand merci pour la richesse de nos échanges lors de cette séance. Pour accompagner l'intégration de ce qui a émergé, je vous propose un temps d'introspection à travers ce formulaire structurant : ${data.cycle2Url}`)
};
