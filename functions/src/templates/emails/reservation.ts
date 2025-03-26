import { EmailTemplate } from '../types'
import { baseTemplate } from '../base'

export const reservationEmail: EmailTemplate = {
  subject: 'Confirmation de votre inscription',
  triggerType: 'immediate',
  getHtml: (data) =>
    baseTemplate(`
    <h2 style="color: #E8927C; margin-bottom: 20px;">Bonjour ${data.name || ''},</h2>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Je confirme votre inscription à la thérapie de couple.
    </p>

    ${
      data.paymentAmount
        ? `
    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Le montant de ${data.paymentAmount} a bien été reçu.
    </p>
    `
        : ''
    }

    ${
      data.firstSessionDate
        ? `
    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Votre première séance est confirmée pour le ${data.firstSessionDate}.
    </p>
    `
        : ''
    }

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
      Je me réjouis de vous rencontrer et de commencer ce travail avec vous.
    </p>
  `),
}
