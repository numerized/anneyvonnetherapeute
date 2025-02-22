import { TherapyEmailType } from '../../types/emails';
import { EmailTemplate } from '../types';
import { baseTemplate } from '../base';

export const afterCouple2Email: EmailTemplate = {
  subject: 'Suite de votre Parcours "Parenthèse Thérapeutique" – Prochaines Étapes',
  triggerType: 'afterSession',
  delayDays: 1,
  getHtml: (data) => baseTemplate(`
Chers ${data.firstName1} et ${data.firstName2},

Nous voici arrivés à la fin de ce premier cycle de la "Parenthèse Thérapeutique". Je tiens à vous féliciter chaleureusement pour votre conscience et votre détermination à revoir vos modèles relationnels et à ajuster votre réalité de couple. Votre engagement a été précieux et a permis d'amorcer un travail de fond.

Dans les prochains jours, vous serez contactés par Julie, notre assistante, afin de convenir d'un entretien en visio. Cette conversation informelle sera l'occasion de vous offrir quelques "tips" et éclairages supplémentaires pour continuer à nourrir votre relation, même lorsque les défis se présentent.

□ Si vous ne souhaitez pas être contactés pour cet entretien, veuillez cocher cette case et nous en tenir informés.

Exploration de l'Intimité : Un Nouvel Élan Érotique
Afin de poursuivre votre exploration de couple, je vous propose une réflexion sur votre vie érotique et sexuelle. Je vous invite à réaliser le test "ÉTAT DES LIEUX ÉROTIQUES ET SEXUELS" disponible ici : ${data.testUrl}. Cette évaluation personnelle vous permettra d'identifier vos forces et vos besoins, et d'ouvrir un dialogue constructif sur ce pilier essentiel de votre relation.

Envie de Continuer ? Le Cycle 2 vous Attend !
Si vous souhaitez approfondir votre démarche et explorer de nouvelles pistes pour épanouir votre couple, le Cycle 2 de la "Parenthèse Thérapeutique" est fait pour vous ! ${data.cycle2Url}

En vous inscrivant dans les 6 prochains mois, bénéficiez d'une réduction exclusive grâce au code promo ${data.promoCode}.

Je vous souhaite une belle continuation dans votre cheminement amoureux.

Cordialement,
Anne-Yvonne`)
};
