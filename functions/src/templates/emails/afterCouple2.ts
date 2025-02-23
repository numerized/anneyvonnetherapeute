import { EmailTemplate } from '../types';
import { baseTemplate } from '../base';

export const afterCouple2Email: EmailTemplate = {
  subject: 'Suite de votre Parcours "Parenthèse Thérapeutique" – Prochaines Étapes',
  triggerType: 'afterSession',
  delayDays: 1,
  getHtml: (data) => {
    const { name, testUrl, cycle2Url, promoCode } = data;
    
    return baseTemplate(`
      <p>Chers ${name},</p>
      
      <p>Nous voici arrivés à la fin de ce premier cycle de la "Parenthèse Thérapeutique". Je tiens à vous féliciter chaleureusement pour votre conscience et votre détermination à revoir vos modèles relationnels et à ajuster votre réalité de couple. Votre engagement a été précieux et a permis d'amorcer un travail de fond.</p>

      <p>Dans les prochains jours, vous serez contactés par Julie, notre assistante, afin de convenir d'un entretien en visio. Cette conversation informelle sera l'occasion d'offrir quelques "tips" et éclairages supplémentaires pour continuer à nourrir la relation, même lorsque les défis se présentent.</p>

      <p>□ Si vous ne souhaitez pas être contactés pour cet entretien, veuillez cocher cette case et nous en tenir informés.</p>

      <h3>Exploration de l'Intimité : Un Nouvel Élan Érotique</h3>
      <p>Afin de poursuivre votre exploration de couple, je vous propose une réflexion sur votre vie érotique et sexuelle. Je vous invite à réaliser le test "TEST DU MOI EN NOUS" <a href="${testUrl}">en cliquant ici</a>. Cette évaluation personnelle vous permettra d'identifier vos forces et vos besoins, et d'ouvrir un dialogue constructif sur ce pilier essentiel de votre relation.</p>

      <h3>Envie de Continuer ? Le Cycle "Erotic Love" vous attend !</h3>
      <p>Si vous souhaitez approfondir votre démarche et explorer de nouvelles pistes pour épanouir votre couple, le Cycle 2 de la est fait pour vous !</p>
      <p>En attendant, je vous invite à réaliser le test "ÉTAT DES LIEUX ÉROTIQUES ET SEXUELS" <a href="${cycle2Url}">en cliquant ici</a>.</p>
      <p>Cette évaluation personnelle vous permettra d'identifier vos forces et vos besoins, et d'ouvrir un dialogue constructif sur ce pilier essentiel de votre relation.</p>

      <p>En vous inscrivant dans les 6 prochains mois, bénéficiez d'une réduction exclusive grâce au code promo <strong>${promoCode}</strong>.</p>
    `);
  },
};
