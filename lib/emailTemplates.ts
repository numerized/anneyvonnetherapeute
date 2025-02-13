// Helper function to create coaching program email template
export const createCoachingEmailTemplate = (email: string, finalPrice: number, currency: string, discountApplied: number) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <img src="https://coeur-a-corps.org/images/logo.png" 
           alt="Anne Yvonne Relations" 
           style="width: 120px; height: auto; margin-bottom: 30px;"
      />
      <h2>Confirmation d'inscription - Coaching Relationnel 7/7</h2>
      <p>Merci pour votre inscription ! Voici les détails de votre programme de coaching :</p>
      
      <h3>Programme</h3>
      <p>"Coaching Relationnel 7/7 : Optimisez vos relations en 1 mois"<br/>
      par Anne Yvonne Racine (coeur-a-corps.org)</p>

      <h3>Ce qui est inclus</h3>
      <ul style="list-style: none; padding-left: 0;">
        <li style="margin-bottom: 10px;">♦ COACHING INDIVIDUEL 24/24 SUR 1 MOIS</li>
        <li style="margin-bottom: 10px;">♦ ÉCHANGES QUOTIDIENS VIA TELEGRAM</li>
        <li style="margin-bottom: 10px;">♦ TROIS SEANCES DE THÉRAPIE À LA CARTE VIA WHEREBY</li>
      </ul>

      <h3>Détails pratiques</h3>
      <ul>
        <li><strong>Durée :</strong> 1 mois d'accompagnement intensif</li>
        <li><strong>Format :</strong> Coaching individuel via Telegram et séances Whereby</li>
        <li><strong>Montant réglé :</strong> ${finalPrice} ${currency} ${
          discountApplied > 0 ? `(remise de ${discountApplied}% appliquée)` : ''
        }</li>
      </ul>

      <h3>Prochaines étapes</h3>
      <p>Je vous contacterai personnellement dans les 24 heures via l'adresse ${email} pour :</p>
      <ul>
        <li>Vous donner accès au groupe Telegram privé</li>
        <li>Planifier notre première séance de thérapie</li>
        <li>Répondre à toutes vos questions</li>
      </ul>

      <h3>Ce que vous allez développer</h3>
      <ul>
        <li>Une lucidité accrue sur vos comportements et leurs impacts</li>
        <li>Une capacité renforcée à ajuster vos réponses émotionnelles et stratégiques</li>
        <li>La création de relations en phase avec vos valeurs, vos objectifs et votre vision</li>
      </ul>

      <p>En attendant notre premier contact, je vous invite à réfléchir aux aspects de vos relations que vous souhaitez particulièrement explorer et transformer.</p>
      
      <p>Pour toute question urgente, n'hésitez pas à me contacter via coeur-a-corps.org</p>
      
      <p>Au plaisir de commencer cette transformation ensemble !</p>
      <p>Anne Yvonne</p>
  </div>
`

// Helper function to create webinar email template
export const createWebinarEmailTemplate = (
  finalPrice: number,
  currency: string,
  discountApplied: number,
  calendarLinks: Array<{ date: string; googleLink: string }>,
  wherebyLink: string
) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <img src="https://coeur-a-corps.org/images/logo.png" 
           alt="Anne Yvonne Relations" 
           style="width: 120px; height: auto; margin-bottom: 30px;"
      />
      <h2>Confirmation d'inscription - Formation "Mieux vivre l'autre"</h2>
      <p>Merci pour votre inscription ! Voici les détails de votre formation :</p>
      
      <h3>Formation</h3>
      <p>"Mieux vivre l'autre : une formation pour élever la conscience relationnelle dans la diversité"<br/>
      par Anne Yvonne Racine (coeur-a-corps.org)</p>

      <h3>Détails pratiques</h3>
      <ul>
        <li><strong>Dates :</strong> 2 + 9 + 23 février 2025 (3 soirées incluses)</li>
        <li><strong>Horaire :</strong> 19h-21h30</li>
        <li><strong>Format :</strong> Formation en ligne via Whereby (sans inscription ni installation requise)</li>
        <li><strong>Montant réglé :</strong> ${finalPrice} ${currency} ${
          discountApplied > 0 ? `(remise de ${discountApplied}% appliquée)` : ''
        }</li>
      </ul>

      <h3>Ajouter les dates à votre calendrier</h3>
      <ul style="list-style: none; padding-left: 0;">
        ${calendarLinks
          .map(
            ({ date, googleLink }) => `
          <li style="margin-bottom: 10px;">
            <strong>${new Date(date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</strong> - 
            <a href="${googleLink}" target="_blank" style="color: #E97451; text-decoration: underline;">
              Ajouter à Google Calendar
            </a>
          </li>
        `
          )
          .join('')}
      </ul>

      <h3>Votre lien d'accès</h3>
      <p>Voici votre lien pour rejoindre la formation :</p>
      <p><a href="${wherebyLink}" style="color: #E97451; text-decoration: underline;">${wherebyLink}</a></p>
      
      <h3>À propos de la formation</h3>
      <p>Cette formation en trois soirées vous guidera pour :</p>
      <ul>
        <li>Approfondir votre conscience de soi et valoriser votre essence unique</li>
        <li>Explorer les dimensions supérieures de la communication</li>
        <li>Tisser des liens d'âme à âme</li>
      </ul>

      <p>Pour toute question, n'hésitez pas à me contacter via coeur-a-corps.org</p>
      
      <p>Au plaisir de vous retrouver pour cette belle aventure !</p>
      <p>Anne Yvonne</p>
  </div>
`
