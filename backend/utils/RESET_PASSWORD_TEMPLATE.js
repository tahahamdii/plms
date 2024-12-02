export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisez Votre Mot de Passe</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #8B0000, #600000); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Réinitialisation du Mot de Passe</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Bonjour,</p>
    <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail.</p>
    <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #8B0000; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Réinitialiser le Mot de Passe</a>
    </div>
    <p>Ce lien expirera dans 5 minutes pour des raisons de sécurité.</p>
    <p>Cordialement,<br>Inceptum Je</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Ceci est un message automatique, merci de ne pas répondre à cet e-mail.</p>
  </div>
</body>
</html>
`;
