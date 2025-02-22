import { TherapyEmailType } from '../../types/emails';
import { EmailTemplate } from '../types';
import { baseTemplate, createButton } from '../base';

export const afterIndiv3Email: EmailTemplate = {
  subject: 'Suite à votre séance individuelle',
  triggerType: 'afterSession',
  delayDays: 1,
  getHtml: (data) => baseTemplate(`
    <h2 style="color: #E8927C; margin-bottom: 20px;">Bonjour ${data.name},</h2>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Un grand merci pour la richesse de nos échanges lors de cette séance. Pour accompagner l'intégration de ce qui a émergé, je vous propose un temps d'introspection à travers ce formulaire structurant :
    </p>

    ${createButton(data.cycle2Url, 'Accéder au formulaire')}
  `)
};
