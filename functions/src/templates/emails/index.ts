import { TherapyEmailType } from '../../types/emails'
import { EmailTemplate } from '../types'
import { reservationEmail } from './reservation'
import { beforeCouple1Email } from './beforeCouple1'
import { afterCouple1Email } from './afterCouple1'
import { beforeIndiv1Email } from './beforeIndiv1'
import { afterIndiv1Email } from './afterIndiv1'
import { beforeIndiv2Email } from './beforeIndiv2'
import { afterIndiv2Email } from './afterIndiv2'
import { beforeIndiv3Email } from './beforeIndiv3'
import { afterIndiv3Email } from './afterIndiv3'
import { beforeCouple2Email } from './beforeCouple2'
import { afterCouple2Email } from './afterCouple2'

export const emailTemplates: Record<TherapyEmailType, EmailTemplate> = {
  [TherapyEmailType.RESERVATION]: reservationEmail,
  [TherapyEmailType.BEFORE_COUPLE_1]: beforeCouple1Email,
  [TherapyEmailType.AFTER_COUPLE_1]: afterCouple1Email,
  [TherapyEmailType.BEFORE_INDIV_1]: beforeIndiv1Email,
  [TherapyEmailType.AFTER_INDIV_1]: afterIndiv1Email,
  [TherapyEmailType.BEFORE_INDIV_2]: beforeIndiv2Email,
  [TherapyEmailType.AFTER_INDIV_2]: afterIndiv2Email,
  [TherapyEmailType.BEFORE_INDIV_3]: beforeIndiv3Email,
  [TherapyEmailType.AFTER_INDIV_3]: afterIndiv3Email,
  [TherapyEmailType.BEFORE_COUPLE_2]: beforeCouple2Email,
  [TherapyEmailType.AFTER_COUPLE_2]: afterCouple2Email,
}

export default emailTemplates
