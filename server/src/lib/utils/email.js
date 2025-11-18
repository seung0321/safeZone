import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",   
    port: 587,               
    secure: false,        
    auth: {
      user: process.env.MAIL_USER, 
      pass: process.env.MAIL_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};
