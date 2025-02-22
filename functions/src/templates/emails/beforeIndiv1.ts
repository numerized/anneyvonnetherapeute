import { TherapyEmailType } from '../../types/emails';
import { EmailTemplate } from '../types';
import { baseTemplate } from '../base';

export const beforeIndiv1Email: EmailTemplate = {
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
};
