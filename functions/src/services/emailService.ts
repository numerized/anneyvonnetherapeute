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
  },
  [TherapyEmailType.BEFORE_INDIV_1]: {
    subject: 'Préparation à notre séance individuelle',
    triggerType: 'beforeSession',
    delayDays: 3,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

En prévision de notre séance, je vous invite à réfléchir à vos schémas relationnels, notamment ceux liés à la dépendance et au rejet. Ces mécanismes influencent profondément nos relations et sont souvent le reflet d'une construction intérieure bien plus vaste.

Je vous propose également de réaliser le Test « Dépendance Relationnelle », qui met en lumière les zones de dépendance ou de rejet dans votre rapport aux autres.

Ce test vous aidera à identifier les freins inconscients qui influencent vos attentes et vos comportements dans le couple.

Vous pouvez accéder au test ici : ${data.testUrl}

Prenez le temps d'observer comment ces dynamiques se manifestent dans votre quotidien et notez ce qui vous semble marquant. Cela nous aidera à approfondir votre exploration personnelle lors de notre échange.

N'hésitez pas à noter vos premières réflexions et ressentis avant notre rencontre.

Je reste disponible pour toute question avant notre rencontre.

Au plaisir d'échanger avec vous,`)
  },
  [TherapyEmailType.AFTER_INDIV_1]: {
    subject: 'Suite à votre séance individuelle',
    triggerType: 'afterSession',
    delayDays: 1,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Un grand merci pour la richesse de nos échanges lors de cette séance. Pour accompagner l'intégration de ce qui a émergé, je vous propose un temps d'introspection à travers ce formulaire structurant.`)
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
    subject: 'Préparation Séance 3 - Célébration de votre Odyssée Intérieure',
    triggerType: 'beforeSession',
    delayDays: 3,
    getHtml: (data) => baseTemplate(`
Bonjour ${data.name},

Bilan et Approfondissement de votre Parcours Introspectif

À l'approche de notre troisième séance, je tiens à souligner la qualité remarquable de votre engagement dans ce processus d'introspection. 
Votre approche méthodique et votre capacité d'auto-analyse ont permis des avancées significatives, transformant chaque étape en opportunité concrète de croissance personnelle.

Les progrès que vous avez réalisés dans la redéfinition de votre relation à vous-même sont tangibles. On observe notamment une évolution dans votre capacité à prioriser vos besoins et à affirmer vos choix, comme en témoigne ${data.specificExample}. Cette confiance renouvelée se manifeste comme un fil conducteur, influençant positivement vos interactions personnelles et professionnelles.

L'estime de soi que vous avez cultivée à travers ce travail constitue désormais une base solide pour aborder les défis futurs. Elle se reflète dans ${data.clientSituation}, illustrant comment cette transformation intérieure impacte concrètement votre quotidien.

✨ Invitation à danser avec votre « Désir de Soi »
En amont de notre 3ème séance, je vous propose un dialogue avec ces questions-clés, nourries des textes partagés :

« Que pourrais-je trouver de plus merveilleux […] que le désir de moi-même ? » (extrait joint)

Je vous invite à écouter la capsule audio disponible ici : ${data.audioCapsuleUrl}`)
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
  },
  
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
