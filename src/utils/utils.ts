export function generateRandomPassword(length) {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}

export function emailAccountCreation(name, email, data) {
  const emailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Greeting Email</title>
</head>
<body>
    <p>Dear ${name},</p>
    <p>Your account is created for TDC-Dashboard.</p>
    <p>Please login and Reset your password</p>
    <p> Email : ${email}</p>
    <p> Password : ${data}</p>
</body>
</html>
`;

  return emailContent;
}

export function emailForProjectOnboarding(name, project, stack) {
  const emailContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Project Notification</title>
</head>
<body>
<p>Hello ${name},</p>

<p>You have been added as Lead to a new project, ${project}. Here are the project details:</p>

<ul>
<li><strong>Project Name:</strong> ${project}</li>
<li><strong>Stack:</strong> ${stack}</li>
</ul>

<p>Thank you and welcome to the project!</p>

<p>Best regards,<br>
TDC</p>
</body>
</html>`;

  return emailContent;
}
