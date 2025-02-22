import * as sgMail from '@sendgrid/mail';
import { defineSecret } from 'firebase-functions/params';
import { TherapyEmailType, EmailTemplate } from '../types/emails';

const sendgridApiKey = defineSecret('SENDGRID_API_KEY');

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

const emailTemplates: Record<TherapyEmailType, EmailTemplate> = {
  [TherapyEmailType.RESERVATION]: {
    subject: 'Confirmation de votre inscription',
    triggerType: 'immediate',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Je confirme votre inscription à la thérapie de couple.

Le montant de ${data.paymentAmount} a bien été reçu.

Votre première séance est confirmée pour le ${data.firstSessionDate}.

Je me réjouis de vous rencontrer et de commencer ce travail avec vous.`)
  },
  [TherapyEmailType.AFTER_SCHEDULE]: {
    subject: 'Votre agenda de thérapie',
    triggerType: 'immediate',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Votre prochain rendez-vous est confirmé pour le ${data.appointmentDate}.

Je vous rappelle que nous nous rencontrerons en ligne via Whereby.

Je me réjouis de poursuivre ce travail avec vous.`)
  },
  [TherapyEmailType.AFTER_FIRST_COUPLE]: {
    subject: 'Suite à votre première séance de couple',
    triggerType: 'afterSession',
    delayDays: 1,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Je vous remercie pour cette première séance de couple. J'espère que vous avez pu en tirer des premiers enseignements utiles.

Notre prochaine séance individuelle est prévue pour le ${data.sessionDate}.

Je me réjouis de poursuivre ce travail avec vous.`)
  },
  [TherapyEmailType.BEFORE_INDIV_1]: {
    subject: 'Préparation pour votre séance individuelle',
    triggerType: 'beforeSession',
    delayDays: 3,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Notre prochaine séance individuelle approche (${data.sessionDate}).

Je vous invite à réfléchir à ce que vous souhaitez aborder lors de cette séance personnelle.

À très bientôt.`)
  },
  [TherapyEmailType.AFTER_INDIV_1]: {
    subject: 'Suite à votre séance individuelle',
    triggerType: 'afterSession',
    delayDays: 1,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Je vous remercie pour cette séance individuelle. J'espère qu'elle vous a permis d'avancer dans votre réflexion.

Notre prochaine séance est prévue pour le ${data.sessionDate}.

Je me réjouis de poursuivre ce travail avec vous.`)
  },
  [TherapyEmailType.BEFORE_INDIV_2]: {
    subject: 'Préparation pour votre deuxième séance individuelle',
    triggerType: 'beforeSession',
    delayDays: 3,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Notre deuxième séance individuelle approche (${data.sessionDate}).

Je vous invite à réfléchir aux points que nous avons abordés lors de notre dernière rencontre et à ce que vous souhaitez approfondir.

À très bientôt.`)
  },
  [TherapyEmailType.AFTER_INDIV_2]: {
    subject: 'Suite à votre deuxième séance individuelle',
    triggerType: 'afterSession',
    delayDays: 1,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Je vous remercie pour cette deuxième séance individuelle. J'espère qu'elle vous a permis d'avancer dans votre réflexion.

Notre prochaine séance est prévue pour le ${data.sessionDate}.

Je me réjouis de poursuivre ce travail avec vous.`)
  },
  [TherapyEmailType.BEFORE_INDIV_3]: {
    subject: 'Préparation pour votre troisième séance individuelle',
    triggerType: 'beforeSession',
    delayDays: 3,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Notre troisième séance individuelle approche (${data.sessionDate}).

Je vous invite à réfléchir aux points que nous avons abordés lors de nos précédentes rencontres et à ce que vous souhaitez approfondir.

À très bientôt.`)
  },
  [TherapyEmailType.BEFORE_COUPLE_2]: {
    subject: 'Préparation pour votre prochaine séance de couple',
    triggerType: 'beforeSession',
    delayDays: 5,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Notre prochaine séance de couple approche (${data.sessionDate}).

Je vous invite à réfléchir, avec ${data.partnerName}, aux points que vous souhaitez aborder ensemble.

À très bientôt.`)
  },
  [TherapyEmailType.AFTER_COUPLE_2]: {
    subject: 'Suite à votre séance de couple',
    triggerType: 'afterSession',
    delayDays: 1,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Je vous remercie pour cette séance de couple. J'espère qu'elle vous a permis d'avancer ensemble dans votre réflexion.

Notre prochaine séance est prévue pour le ${data.sessionDate}.

Je me réjouis de poursuivre ce travail avec vous.`)
  },
  [TherapyEmailType.AFTER_COUPLE_3]: {
    subject: 'Suite à votre dernière séance de couple',
    triggerType: 'afterSession',
    delayDays: 14,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Je vous remercie pour cette dernière séance de couple. J'espère que l'ensemble de notre travail vous a été bénéfique.

Je reste à votre disposition si vous souhaitez poursuivre ce travail à l'avenir.

Je vous souhaite le meilleur pour la suite.`)
  }
};

export async function sendTherapyEmail(
  emailType: TherapyEmailType,
  recipientEmail: string,
  dynamicData: Record<string, any>
): Promise<void> {
  const template = emailTemplates[emailType];
  if (!template) {
    throw new Error(`Email template not found for type: ${emailType}`);
  }

  const msg = {
    to: recipientEmail,
    from: 'a.ra@bluewin.ch',
    subject: template.subject,
    html: template.getHtml(dynamicData)
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
