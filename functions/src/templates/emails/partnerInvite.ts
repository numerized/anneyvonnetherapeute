export const partnerInviteEmail = (inviterName: string, inviteLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation à rejoindre votre partenaire</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #fff;
      padding: 20px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #E6A186;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #d88f73;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Invitation à rejoindre votre partenaire sur Anne-Yvonne Thérapeute</h2>
    <p>Bonjour,</p>
    <p>${inviterName} vous invite à le/la rejoindre sur la plateforme de thérapie de couple d'Anne-Yvonne.</p>
    <p>En rejoignant la plateforme, vous pourrez :</p>
    <ul>
      <li>Accéder à votre espace couple personnalisé</li>
      <li>Suivre votre progression ensemble</li>
      <li>Préparer vos séances de thérapie</li>
      <li>Accéder à des ressources exclusives pour votre couple</li>
    </ul>
    <p>Pour commencer votre parcours ensemble, cliquez sur le bouton ci-dessous :</p>
    <a href="${inviteLink}" class="button">Rejoindre mon partenaire</a>
    <p>Ce lien est personnel et ne doit pas être partagé.</p>
    <p>À bientôt sur la plateforme !</p>
    <p>Anne-Yvonne Thérapeute</p>
  </div>
</body>
</html>
`;
