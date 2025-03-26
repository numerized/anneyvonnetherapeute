import { EmailTemplate } from '../types'
import { baseTemplate, createButton } from '../base'

export const afterCouple2Email: EmailTemplate = {
  subject:
    'Suite de votre Parcours "Parenthèse Thérapeutique" – Prochaines Étapes',
  triggerType: 'afterSession',
  delayDays: 1,
  getHtml: (data) =>
    baseTemplate(`
    <h2 style="color: #E8927C; margin-bottom: 20px;">Chers ${data.firstName1 || ''} et ${data.firstName2 || ''},</h2>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Nous voici arrivés à la fin de ce premier cycle de la "Parenthèse Thérapeutique". Je tiens à vous féliciter chaleureusement pour votre conscience et votre détermination à revoir vos modèles relationnels et à ajuster votre réalité de couple. Votre engagement a été précieux et a permis d'amorcer un travail de fond.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Dans les prochains jours, vous serez contactés par Julie, notre assistante, afin de convenir d'un entretien en visio. Cette conversation informelle sera l'occasion d'offrir quelques "tips" et éclairages supplémentaires pour continuer à nourrir la relation, même lorsque les défis se présentent.
    </p>

    <p style="color: #666; font-size: 14px; font-style: italic; margin-bottom: 20px;">
      □ Si vous ne souhaitez pas être contactés pour cet entretien, veuillez cocher cette case et nous en tenir informés.
    </p>

    <h3 style="color: #E8927C; margin: 30px 0 15px;">Exploration de l'Intimité : Un Nouvel Élan Érotique</h3>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Afin de poursuivre votre exploration de couple, je vous propose une réflexion sur votre vie érotique et sexuelle. Je vous invite à réaliser le test "TEST DU MOI EN NOUS"
      ${data.testUrl ? createButton(data.testUrl, 'Accéder au test') : ''}.
      Cette évaluation personnelle vous permettra d'identifier vos forces et vos besoins, et d'ouvrir un dialogue constructif sur ce pilier essentiel de votre relation.
    </p>

    <h3 style="color: #E8927C; margin: 30px 0 15px;">Envie de Continuer ? Le Cycle "Erotic Love" vous attend !</h3>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Si vous souhaitez approfondir votre démarche et explorer de nouvelles pistes pour épanouir votre couple, le Cycle 2 de la Parenthèse Thérapeutique est fait pour vous !
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      En attendant, je vous invite à réaliser le test "ÉTAT DES LIEUX ÉROTIQUES ET SEXUELS"
      ${data.testUrl ? createButton(data.testUrl, 'Accéder au test') : ''}.
      Cette évaluation personnelle vous permettra d'identifier vos forces et vos besoins, et d'ouvrir un dialogue constructif sur ce pilier essentiel de votre relation.
    </p>

    ${
      data.promoCode
        ? `
    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      En vous inscrivant dans les 6 prochains mois, bénéficiez d'une réduction exclusive grâce au code promo <strong>${data.promoCode}</strong>.
    </p>
    `
        : ''
    }

    ${data.cycle2Url ? createButton(data.cycle2Url, "S'inscrire au Cycle 2") : ''}

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Nous vous souhaitons le meilleur dans votre cheminement amoureux et serions ravis de continuer à vous accompagner. Découvrez nos capsules, événements et coachings dédiés à nourrir et renforcer votre relation.
    </p>

    ${
      data.audioCapsuleUrl
        ? `
    <h3 style="color: #E8927C; margin: 30px 0 15px;">Ressources Complémentaires</h3>

    <ul style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      <li>TEST DU MOI EN NOUS ${data.testUrl ? createButton(data.testUrl, 'Accéder au test') : ''}</li>
      <li>CAPSULE SUR "LE COUPLE CONSCIENT" ${data.audioCapsuleUrl ? createButton(data.audioCapsuleUrl, 'Écouter la capsule') : ''}</li>
      <li>AUDIO GUIDÉ ${data.audioCapsuleUrl ? createButton(data.audioCapsuleUrl, "Écouter l'audio") : ''}</li>
    </ul>
    `
        : ''
    }
  `),
}
