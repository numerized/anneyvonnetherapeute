import { TherapyEmailType } from '../../types/emails';
import { EmailTemplate } from '../types';
import { baseTemplate } from '../base';

export const afterCouple1Email: EmailTemplate = {
  subject: 'Suite de notre première séance – instructions et préparation',
  triggerType: 'afterSession',
  delayDays: 1,
  getHtml: (data) => baseTemplate(`
Madame, Monsieur,

Merci pour votre sincérité et votre engagement lors de notre séance d'hier.

Comme convenu, vous trouverez ci-dessous les dates fixées dans le cadre de la Parenthèse Thérapeutique :
${data.appointmentDates}

D'ici là, prenez simplement note de ce qui émerge en vous, sans jugement, qu'il s'agisse de ressentis positifs ou négatifs.

1. L'Observation Consciente
L'autre est un révélateur : ce qu'il vous fait ressentir parle avant tout de vous. Cette approche permet d'accueillir vos émotions comme des pistes de compréhension plutôt que des motifs de conflit.

2. Préparation de votre séance individuelle
Merci de remplir le formulaire ci-joint quelques jours avant votre séance individuelle. Il vous aidera à préciser vos attentes et à approfondir notre échange.

3. Le Test de l'Amoureux
Ce test éclaire votre rapport à l'amour et à la relation. Répondez en toute sincérité, en observant ce qui résonne en vous.

Je vous invite également à vous inscrire aux Capsules disponibles sur www.coeur-a-corps.org pour approfondir cette réflexion.

Je reste disponible pour toute question.`)
};
