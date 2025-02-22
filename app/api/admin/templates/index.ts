import { TherapyEmailType } from '@/functions/src/types/emails';

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  ${content}
  
  Cordialement,
  Anne Yvonne
  Thérapeute de couple
  
  Se désinscrire: \${unsubscribeUrl}
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
  [TherapyEmailType.AFTER_SCHEDULE]: {
    subject: 'Votre agenda de thérapie',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Votre prochain rendez-vous est confirmé pour le ${data.appointmentDate}.

Je vous rappelle que nous nous rencontrerons en ligne via Whereby.

Je me réjouis de poursuivre ce travail avec vous.`)
  },
  [TherapyEmailType.AFTER_FIRST_COUPLE]: {
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
    subject: 'Suite à votre séance de couple',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Je vous remercie pour cette séance de couple. J'espère qu'elle vous a permis d'avancer ensemble dans votre réflexion.

Notre prochaine séance est prévue pour le ${data.sessionDate}.

Je me réjouis de poursuivre ce travail avec vous.`)
  },
  [TherapyEmailType.AFTER_COUPLE_3]: {
    subject: 'Suite à votre dernière séance de couple',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Je vous remercie pour cette dernière séance de couple. J'espère que l'ensemble de notre travail vous a été bénéfique.

Je reste à votre disposition si vous souhaitez poursuivre ce travail à l'avenir.

Je vous souhaite le meilleur pour la suite.`)
  }
};

export default emailTemplates;
