import { EmailTemplate } from '../types';
import { baseTemplate } from '../base';

export const beforeIndiv1Email: EmailTemplate = {
  subject: 'Invitation à explorer vos premiers modèles relationnels',
  triggerType: 'beforeSession',
  delayDays: 3,
  getHtml: (data) => baseTemplate(`
    <h2 style="color: #E8927C; margin-bottom: 20px;">Bonjour ${data.name},</h2>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Lors de notre première séance individuelle, nous allons prendre le temps d'explorer les origines de vos schémas relationnels. Nos premiers modèles d'amour ne naissent pas de nos choix conscients, mais bien de nos premières expériences de vie. À travers notre enfance, nos relations familiales et nos premières interactions affectives, nous avons inconsciemment intégré des façons d'aimer, d'attendre, de donner, parfois même de nous effacer.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Cette séance sera l'occasion d'observer ces empreintes, non pas pour y rester figé, mais pour comprendre ce qui, aujourd'hui, influence encore votre manière d'être en relation. Nous irons regarder certains souvenirs, non pour s'y attarder, mais pour en dégager des pistes de transformation.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Je vous invite d'ici là à simplement vous poser cette question : Quels souvenirs me viennent lorsque je pense à mes premières expériences d'amour et d'attachement ? Il peut s'agir d'un geste, d'une absence, d'une sensation, d'une attente… Rien n'est à forcer, laissez venir ce qui vient.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Je me réjouis de ce moment d'exploration avec vous. À très bientôt,
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Anne-Yvonne
    </p>
  `)
};
