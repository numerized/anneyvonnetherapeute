import { EmailTemplate } from '../types'
import { baseTemplate, createButton } from '../base'

export const beforeIndiv2Email: EmailTemplate = {
  subject: 'Préparation à notre séance individuelle',
  triggerType: 'beforeSession',
  delayDays: 3,
  getHtml: (data) =>
    baseTemplate(`
    <h2 style="color: #E8927C; margin-bottom: 20px;">Bonjour ${data.name},</h2>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      En prévision de notre séance, je vous invite à réfléchir à vos schémas relationnels, notamment ceux liés à la dépendance et au rejet. Ces mécanismes influencent profondément nos relations et sont souvent le reflet d'une construction intérieure bien plus vaste.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Je vous propose également de réaliser le Test « Dépendance Relationnelle », qui met en lumière les zones de dépendance ou de rejet dans votre rapport aux autres.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Ce test vous aidera à identifier les freins inconscients qui influencent vos attentes et vos comportements dans le couple.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Vous pouvez accéder au test ici : ${data.testUrl ? createButton(data.testUrl, 'Accéder au test') : ''}
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Prenez le temps d'observer comment ces dynamiques se manifestent dans votre quotidien et notez ce qui vous semble marquant. Cela nous aidera à approfondir votre exploration personnelle lors de notre échange.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      N'hésitez pas à noter vos premières réflexions et ressentis avant notre rencontre.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Je reste disponible pour toute question avant notre rencontre.
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Au plaisir d'échanger avec vous,
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Anne-Yvonne
    </p>
  `),
}
