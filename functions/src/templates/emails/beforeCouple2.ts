import { EmailTemplate } from '../types'
import { baseTemplate } from '../base'

export const beforeCouple2Email: EmailTemplate = {
  subject: 'Préparation pour votre prochaine séance de couple',
  triggerType: 'beforeSession',
  delayDays: 5,
  getHtml: (data) =>
    baseTemplate(`
    MISSING !!!!!
  `),
}
