import nodemailer from 'nodemailer';
import express, { Request, Response } from 'express';
export const router = express.Router();
import dotenv from 'dotenv';

dotenv.config();
export const sendMail = async (
  from: string,
  to: string,
  subject: string,
  html: string
) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from,
    to,
    subject,
    html,
  };

  console.log(`Sending mail to - ${to}`);
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

router.post('/deliver', async (req: Request, res: Response) => {
  try {
    const { to, subject, html } = req.body;
    if (!to || !subject || !html) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const from = process.env.MAIL_USERNAME;
    if (!from) {
      throw new Error('MAIL_USERNAME environment variable is not set');
    }
    const info = await sendMail(from, to, subject, html);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

export default router;
