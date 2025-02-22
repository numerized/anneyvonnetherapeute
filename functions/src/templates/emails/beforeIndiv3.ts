import { TherapyEmailType } from '../../types/emails';
import { EmailTemplate } from '../types';
import { baseTemplate } from '../base';

export const beforeIndiv3Email: EmailTemplate = {
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
};
