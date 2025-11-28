import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, text) => {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL, 
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error('SendGrid email error:', err);
    throw err; 
  }
};
