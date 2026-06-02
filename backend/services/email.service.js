const sendContactEmail = async ({ agentEmail, agentName, propertyTitle, visitorName, visitorEmail, visitorPhone, message }) => {
  const subject = `[LogiCam] Nouveau message pour "${propertyTitle}"`;
  const body = `
Nouveau message de contact via LogiCam

Logement : ${propertyTitle}
Agent : ${agentName} (${agentEmail})

Visiteur : ${visitorName}
Email : ${visitorEmail}
Téléphone : ${visitorPhone || 'Non renseigné'}

Message :
${message}
`;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: agentEmail,
      replyTo: visitorEmail,
      subject,
      text: body,
    });
    return { sent: true, mode: 'smtp' };
  }

  console.log('--- EMAIL CONTACT (mode dev) ---');
  console.log(`To: ${agentEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(body);
  console.log('--------------------------------');

  return { sent: true, mode: 'console' };
};

module.exports = { sendContactEmail };
