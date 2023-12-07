export const emailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password</title>
</head>
<body>
    <p>Dear User,</p>
    <p>We received a request to reset your password. If you did not make this request, you can safely ignore this email.</p>
    <p>To reset your password, click on the following link:</p>
    <p><a href="{RESET_LINK}" target="_blank">Reset Password</a></p>
    <p>If the above link does not work, you can copy and paste the following URL into your browser:</p>
    <p>{RESET_LINK}</p>
    <p>This link will expire in 1 hour for security reasons. If you did not request a password reset, please ignore this email.</p>
    <p>Thank you,</p>
    <p>Your Website Team</p>
</body>
</html>
`;



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
// utils/emailTemplate.js

export function generateEmailContent(name, email, data) {
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
    const emailContent = `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Notification</title>
</head>
<body>
  <p>Hello ${name},</p>

  <p>You have been added to a new project, ${project}. Here are the project details:</p>

  <ul>
    <li><strong>Project Name:</strong> ${project}</li>
    <li><strong>Stack:</strong> ${stack}</li>
  </ul>

  <p>Thank you and welcome to the project!</p>

  <p>Best regards,<br>
  TDC</p>
</body>
</html>

    `;

    return emailContent;
}





