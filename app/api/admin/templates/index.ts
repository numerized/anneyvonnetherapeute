import { TherapyEmailType } from '@/functions/src/types/emails';

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  ${content}
  
  --
  Anne Yvonne
  Relations
  www.coeur-a-corps.org
</body>
</html>
`;

const emailTemplates: Record<TherapyEmailType, { subject: string; getHtml: (data: any) => string }> = {
  [TherapyEmailType.RESERVATION]: {
    subject: 'Bienvenue à votre thérapie de couple',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Je vous remercie pour votre réservation et votre confiance. Votre première séance de couple est confirmée pour le ${data.firstSessionDate}.

Le montant de ${data.paymentAmount} a bien été reçu.

Je me réjouis de vous rencontrer et de commencer ce travail avec vous.`)
  },
  [TherapyEmailType.BEFORE_COUPLE_1]: {
    subject: 'Votre agenda de thérapie',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Votre prochain rendez-vous est confirmé pour le ${data.appointmentDate}.

Je vous rappelle que nous nous rencontrerons en ligne via Whereby.

Je me réjouis de poursuivre ce travail avec vous.`)
  },
  [TherapyEmailType.AFTER_COUPLE_1]: {
    subject: 'Suite à votre première séance de couple',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Je vous remercie pour cette première séance de couple. J'espère que vous avez pu en tirer des premiers enseignements utiles.

Notre prochaine séance individuelle est prévue pour le ${data.sessionDate}.

Je me réjouis de poursuivre ce travail avec vous.`)
  },
  [TherapyEmailType.BEFORE_INDIV_1]: {
    subject: 'Préparation pour votre séance individuelle',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Notre prochaine séance individuelle approche (${data.sessionDate}).

Je vous invite à réfléchir à ce que vous souhaitez aborder lors de cette séance personnelle.

À très bientôt.`)
  },
  [TherapyEmailType.AFTER_INDIV_1]: {
    subject: 'Suite à votre séance individuelle',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Je vous remercie pour cette séance individuelle. J'espère qu'elle vous a permis d'avancer dans votre réflexion.

Notre prochaine séance est prévue pour le ${data.sessionDate}.

Je me réjouis de poursuivre ce travail avec vous.`)
  },
  [TherapyEmailType.BEFORE_INDIV_2]: {
    subject: 'Préparation pour votre deuxième séance individuelle',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Notre deuxième séance individuelle approche (${data.sessionDate}).

Je vous invite à réfléchir aux points que nous avons abordés lors de notre dernière rencontre et à ce que vous souhaitez approfondir.

À très bientôt.`)
  },
  [TherapyEmailType.AFTER_INDIV_2]: {
    subject: 'Suite à votre deuxième séance individuelle',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Je vous remercie pour cette deuxième séance individuelle. J'espère qu'elle vous a permis d'avancer dans votre réflexion.

Notre prochaine séance est prévue pour le ${data.sessionDate}.

Je me réjouis de poursuivre ce travail avec vous.`)
  },
  [TherapyEmailType.BEFORE_INDIV_3]: {
    subject: 'Préparation pour votre troisième séance individuelle',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Notre troisième séance individuelle approche (${data.sessionDate}).

Je vous invite à réfléchir aux points que nous avons abordés lors de nos précédentes rencontres et à ce que vous souhaitez approfondir.

À très bientôt.`)
  },
  [TherapyEmailType.BEFORE_COUPLE_2]: {
    subject: 'Préparation pour votre prochaine séance de couple',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Notre prochaine séance de couple approche (${data.sessionDate}).

Je vous invite à réfléchir, avec ${data.partnerName}, aux points que vous souhaitez aborder ensemble.

À très bientôt.`)
  },
  [TherapyEmailType.AFTER_COUPLE_2]: {
    subject: 'Suite de votre Parcours "Parenthèse Thérapeutique" – Prochaines Étapes',
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
  },
};

export default emailTemplates;
