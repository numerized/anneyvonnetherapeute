// Helper function to create coaching program email template
export const createCoachingEmailTemplate = (
  email: string,
  finalPrice: number,
  currency: string,
  discountApplied: number,
) => `
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
  wherebyLink: string,
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
              year: 'numeric',
            })}</strong> - 
            <a href="${googleLink}" target="_blank" style="color: #E97451; text-decoration: underline;">
              Ajouter à Google Calendar
            </a>
          </li>
        `,
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

// Helper function to create group coaching email template
export const createGroupCoachingEmailTemplate = (
  email: string,
  finalPrice: number,
  currency: string,
  discountApplied: number,
) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <img src="https://coeur-a-corps.org/images/logo.png" 
           alt="Anne Yvonne Relations" 
           style="width: 120px; height: auto; margin-bottom: 30px;"
      />
      <h2>Confirmation d'inscription - Coaching Relationnel en Groupe</h2>
      <p>Merci pour votre inscription ! Voici les détails de votre programme de coaching :</p>
      
      <h3>Programme</h3>
      <p>"Dépassez vos schémas, vivez l'amour autrement"<br/>
      par Anne Yvonne Racine (coeur-a-corps.org)</p>

      <h3>Ce qui est inclus</h3>
      <ul style="list-style: none; padding-left: 0;">
        <li style="margin-bottom: 10px;">♦ TROIS SÉANCES INTENSIVES EN PETIT GROUPE (5 PERSONNES MAX)</li>
        <li style="margin-bottom: 10px;">♦ EXERCICES PRATIQUES ET OUTILS DE TRANSFORMATION</li>
        <li style="margin-bottom: 10px;">♦ ACCOMPAGNEMENT PERSONNALISÉ DANS UN CADRE INTIME</li>
      </ul>

      <h3>Détails pratiques</h3>
      <ul>
        <li><strong>Dates :</strong> 11, 18 et 25 mars 2025</li>
        <li><strong>Horaire :</strong> 20h-21h30</li>
        <li><strong>Format :</strong> Séances en ligne via Whereby (groupe de 5 personnes maximum)</li>
        <li><strong>Montant réglé :</strong> ${finalPrice} ${currency} ${
          discountApplied > 0 ? `(remise de ${discountApplied}% appliquée)` : ''
        }</li>
      </ul>

      <h3>Prochaines étapes</h3>
      <p>Je vous contacterai personnellement dans les 24 heures via l'adresse ${email} pour :</p>
      <ul>
        <li>Vous donner accès à l'espace de coaching</li>
        <li>Vous envoyer le lien Whereby pour les séances</li>
        <li>Répondre à toutes vos questions</li>
      </ul>

      <h3>Ce que vous allez découvrir</h3>
      <ul>
        <li>Pourquoi vous êtes attiré(e) par certains types de personnes et comment sortir des répétitions inconscientes</li>
        <li>Comment distinguer l'amour réel du fantasme ou du besoin de validation</li>
        <li>Comment aimer sans se perdre, sans s'accrocher ni exiger que l'autre vous comble</li>
        <li>Comment ancrer un amour qui part de soi, sans attente, sans contrôle</li>
      </ul>

      <p>En attendant notre première séance, je vous invite à réfléchir aux schémas relationnels que vous souhaitez transformer et aux nouvelles façons d'aimer que vous désirez explorer.</p>
      
      <p>Pour toute question urgente, n'hésitez pas à me contacter via coeur-a-corps.org</p>
      
      <p>Au plaisir de vous accompagner dans cette transformation !</p>
      <p>Anne Yvonne</p>
  </div>
`

// Helper function to create live reminder email template
export const createLiveReminderEmailTemplate = () => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <img src="https://coeur-a-corps.org/images/logo.png" 
           alt="Anne Yvonne Relations" 
           style="width: 120px; height: auto; margin-bottom: 30px;"
      />
      <h2 style="color: #E97451; margin-bottom: 20px;">Bienvenue !</h2>
      <p style="font-size: 16px; margin-bottom: 20px;">Chère/Cher abonné(e),</p>
      
      <div style="background-color: #FDF5E6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #E97451; margin-top: 0;">🎁 Cadeau de bienvenue</h3>
        <p>Pour vous remercier de votre inscription, bénéficiez de 10% de réduction sur notre offre de lancement avec le code :</p>
        
        <div style="background-color: #E97451; color: white; text-align: center; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <strong style="font-size: 20px;">COEUR180</strong>
        </div>
        
        <a href="https://coeur-a-corps.org/prochainement?coupon=COEUR180" 
           style="color: #E97451; text-decoration: underline;">
          Réservez votre coaching relationnel avec la réduction
        </a>
      </div>

      <div style="background-color: #3B6B5E; color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <h2 style="color: #E97451; margin-top: 0; font-size: 24px;">LE LIVE D'ANNE YVONNE SUR LE DIVAN</h2>
        <p style="color: #fff; margin: 15px 0;">Le live mensuel sur le thème « Oser nos désirs : amour, libido et renaissance du printemps ».</p>
        <p style="color: #fff; font-size: 20px; margin: 20px 0;">Le 18 mars à 20h</p>
        <div style="margin-top: 25px;">
          <a href="https://coeur-a-corps.org/live" 
             style="display: inline-block; background-color: #E97451; color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; margin-right: 10px;">
            Accéder au live
          </a>
          <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Live%20d%27Anne%20Yvonne%20sur%20le%20Divan&details=Le%20live%20mensuel%20sur%20le%20th%C3%A8me%20%C2%AB%20Oser%20nos%20d%C3%A9sirs%20%3A%20amour%2C%20libido%20et%20renaissance%20du%20printemps%20%C2%BB.&dates=20250318T190000Z%2F20250318T200000Z" 
             style="display: inline-block; background-color: #FDF5E6; color: #3B6B5E; padding: 12px 25px; border-radius: 25px; text-decoration: none;">
            📅 Ajouter au calendrier
          </a>
        </div>
      </div>
  </div>
`
