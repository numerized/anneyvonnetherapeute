import { TherapyEmailType } from '../../types/emails';
import { EmailTemplate } from '../types';
import { baseTemplate, createButton } from '../base';

export const afterCouple1Email: EmailTemplate = {
  subject: 'Suite de notre première séance – instructions et préparation',
  triggerType: 'afterSession',
  delayDays: 1,
  getHtml: (data) => baseTemplate(`
    <h2 style="color: #E8927C; margin-bottom: 20px;">Madame, Monsieur,</h2>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Merci pour votre sincérité et votre engagement lors de notre séance d'hier.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Comme convenu, vous trouverez ci-dessous les dates fixées dans le cadre de la Parenthèse Thérapeutique :
      ${data.appointmentDates || ''}
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      D'ici là, prenez simplement note de ce qui émerge en vous, sans jugement, qu'il s'agisse de ressentis positifs ou négatifs.
    </p>

    <h3 style="color: #E8927C; margin: 20px 0 15px;">1. L'Observation Consciente</h3>
    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      L'autre est un révélateur : ce qu'il vous fait ressentir parle avant tout de vous. Cette approche permet d'accueillir vos émotions comme des pistes de compréhension plutôt que des motifs de conflit.
    </p>

    <h3 style="color: #E8927C; margin: 20px 0 15px;">2. Préparation de votre séance individuelle</h3>
    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Merci de remplir le formulaire ci-joint quelques jours avant votre séance individuelle. Il vous aidera à préciser vos attentes et à approfondir notre échange.
    </p>

    <h3 style="color: #E8927C; margin: 20px 0 15px;">3. Le Test de l'Amoureux</h3>
    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Ce test éclaire votre rapport à l'amour et à la relation. Répondez en toute sincérité, en observant ce qui résonne en vous.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Je vous invite également à vous inscrire aux Capsules disponibles sur www.coeur-a-corps.org pour approfondir cette réflexion.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Si vous souhaitez approfondir votre démarche et explorer de nouvelles pistes pour épanouir votre couple, le Cycle 2 de la "Parenthèse Thérapeutique" est fait pour vous !
    </p>

    ${data.cycle2Url ? createButton(data.cycle2Url, 'En savoir plus') : ''}

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Je reste disponible pour toute question.
    </p>
  `)
};
