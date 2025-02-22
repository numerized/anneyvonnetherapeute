import { TherapyEmailType } from '../../types/emails';
import { EmailTemplate } from '../types';
import { baseTemplate } from '../base';

export const beforeCouple1Email: EmailTemplate = {
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
};
