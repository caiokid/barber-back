import { BrevoClient, BrevoEnvironment } from '@getbrevo/brevo';

const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
  environment: BrevoEnvironment.Production
});

const sendEmail = async ({ to, subject, html }) => {
  await client.transactionalEmails.sendTransacEmail({
    sender: { email: 'caioviniciusfranca@gmail.com', name: 'King Size Barbearia' },
    to: [{ email: to }],
    subject,
    htmlContent: html
  });
};

export default sendEmail;
