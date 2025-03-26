import { EmailTemplate } from '../types'
import { baseTemplate } from '../base'

export const beforeCouple1Email: EmailTemplate = {
  subject:
    'Bienvenue chez Cœur à Corps – Un voyage inspirant pour votre couple',
  triggerType: 'immediate',
  getHtml: (data) =>
    baseTemplate(`
    <h2 style="color: #E8927C; margin-bottom: 20px;">Bonjour ${data.name},</h2>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Nous sommes ravis de vous accueillir chez Cœur à Corps ! Votre choix d'explorer cette démarche est à la fois intelligent et porteur d'une belle dynamique pour votre relation. Vous avez fait un pas vers plus de conscience, de connexion et d'épanouissement, et nous sommes honorés de vous accompagner dans ce processus.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Dates à retenir : Vous trouverez en pièce jointe les dates des rencontres fixées pour votre parcours.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Un accès privilégié : Pendant deux ans, l'espace ouvert des capsules vous est offert. Profitez de cet espace pour nourrir votre relation avec des partages inspirants et des ressources exclusives.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Des événements pour enrichir votre expérience : Autour du love et de l'éros, nous organisons régulièrement des rencontres, ateliers et explorations. Vous serez informé(e) en avant-première des nouvelles opportunités à saisir !
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Nous avons hâte de vous retrouver et d'évoluer ensemble dans cette aventure !
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      À très bientôt,
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      L'équipe de Cœur à Corps
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      <a href="https://www.coeur-a-corps.org" style="color: #E8927C; text-decoration: none;">www.coeur-a-corps.org</a>
    </p>
  `),
}
