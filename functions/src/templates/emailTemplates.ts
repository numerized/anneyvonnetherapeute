import { TherapyEmailType, EmailTemplate } from '../types/emails';

export const baseTemplate = (content: string) => `
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

export const emailTemplates: Record<TherapyEmailType, EmailTemplate> = {
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
  [TherapyEmailType.BEFORE_COUPLE_1]: {
    subject: 'Bienvenue chez Cœur à Corps – Un voyage inspirant pour votre couple',
    triggerType: 'immediate',
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Nous sommes ravis de vous accueillir chez Cœur à Corps ! Votre choix d'explorer cette démarche est à la fois intelligent et porteur d'une belle dynamique pour votre relation. Vous avez fait un pas vers plus de conscience, de connexion et d'épanouissement, et nous sommes honorés de vous accompagner dans ce processus.

Dates à retenir : Vous trouverez ci-dessous les dates des rencontres fixées pour votre parcours :
${data.appointmentDates}

Un accès privilégié : Pendant deux ans, l'espace ouvert des capsules vous est offert. Profitez de cet espace pour nourrir votre relation avec des partages inspirants et des ressources exclusives.

Des événements pour enrichir votre expérience : Autour du love et de l'éros, nous organisons régulièrement des rencontres, ateliers et explorations. Vous serez informé(e) en avant-première des nouvelles opportunités à saisir !

Nous avons hâte de vous retrouver et d'évoluer ensemble dans cette aventure !

À très bientôt,`)
  },
  [TherapyEmailType.AFTER_COUPLE_1]: {
    subject: 'Suite de notre première séance – instructions et préparation',
    triggerType: 'afterSession',
    delayDays: 1,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Je vous remercie pour cette première séance ensemble. C'est un plaisir de vous accompagner dans ce processus.

Pour continuer sur cette belle lancée, je vous invite à remplir le test de personnalité suivant : ${data.testUrl}

Ce test nous permettra d'avoir une base solide pour nos prochaines séances individuelles.

À bientôt,`)
  },
  [TherapyEmailType.BEFORE_INDIV_1]: {
    subject: 'Préparation à notre séance individuelle',
    triggerType: 'beforeSession',
    delayDays: 3,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Notre prochaine séance individuelle approche. Je vous invite à réfléchir aux schémas relationnels qui se répètent dans votre vie, particulièrement dans vos relations amoureuses.

Pensez à :
- Vos attentes dans une relation
- Vos peurs et vos blocages
- Vos modes de communication
- Vos besoins émotionnels

À bientôt,`)
  },
  [TherapyEmailType.AFTER_INDIV_1]: {
    subject: 'Suite à votre séance individuelle',
    triggerType: 'afterSession',
    delayDays: 1,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Suite à notre séance, je vous invite à remplir ce formulaire d'introspection : ${data.cycle2Url}

À bientôt,`)
  },
  [TherapyEmailType.BEFORE_INDIV_2]: {
    subject: 'Préparation pour votre deuxième séance individuelle',
    triggerType: 'beforeSession',
    delayDays: 3,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

En préparation de notre prochaine séance, je vous invite à réfléchir sur les points que nous avons abordés lors de notre dernière rencontre.

À bientôt,`)
  },
  [TherapyEmailType.AFTER_INDIV_2]: {
    subject: 'Suite à votre deuxième séance individuelle',
    triggerType: 'afterSession',
    delayDays: 1,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Suite à notre séance, je vous invite à remplir ce formulaire d'introspection : ${data.cycle2Url}

À bientôt,`)
  },
  [TherapyEmailType.BEFORE_INDIV_3]: {
    subject: 'Préparation Séance 3 - Célébration de votre Odyssée Intérieure',
    triggerType: 'beforeSession',
    delayDays: 3,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Notre prochaine séance approche. Je vous invite à prendre un moment pour réfléchir à votre parcours jusqu'ici :

- Quelles découvertes avez-vous faites sur vous-même ?
- Quels changements avez-vous observés dans votre façon d'être en relation ?
- Quels sont vos espoirs pour la suite ?

Je me réjouis d'explorer ces questions avec vous.

À bientôt,`)
  },
  [TherapyEmailType.BEFORE_COUPLE_2]: {
    subject: 'Préparation pour votre prochaine séance de couple',
    triggerType: 'beforeSession',
    delayDays: 5,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Notre prochaine séance de couple approche. Je vous invite à réfléchir aux évolutions que vous avez observées dans votre relation depuis le début de notre travail ensemble.

À bientôt,`)
  },
  [TherapyEmailType.AFTER_COUPLE_2]: {
    subject: 'Suite de votre Parcours "Parenthèse Thérapeutique" – Prochaines Étapes',
    triggerType: 'afterSession',
    delayDays: 1,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Nous arrivons au terme de ce cycle thérapeutique, et je tenais à vous remercier pour votre engagement dans ce processus.

Pour continuer à nourrir votre relation, je vous offre un code promo de -20% sur le prochain cycle : ${data.promoCode}

N'hésitez pas à me contacter si vous souhaitez poursuivre ce travail ensemble.

Je vous souhaite le meilleur pour la suite de votre chemin.

Bien à vous,`)
  }
};

export default emailTemplates;
