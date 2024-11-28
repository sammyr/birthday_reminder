import nodemailer from 'nodemailer';
import { Birthday } from '@/types/Birthday';
import { getSettings, updateBirthday } from './db';

interface EmailData {
  to: string;
  subject: string;
  text: string;
}

export async function sendBirthdayEmail(birthday: Birthday): Promise<boolean> {
  const settings = await getSettings();
  
  if (!settings.emailNotifications || !settings.emailAddress) {
    return false;
  }

  // Create test account if no SMTP settings are provided
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || testAccount.user,
      pass: process.env.SMTP_PASS || testAccount.pass,
    },
  });

  const birthDate = new Date(birthday.date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const daysUntil = Math.ceil((birthDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const emailText = settings.emailTemplate
    .replace('{name}', birthday.name)
    .replace('{age}', age.toString())
    .replace('{days}', daysUntil.toString())
    .replace('{sender}', settings.emailAddress);

  const emailData: EmailData = {
    to: settings.emailAddress,
    subject: `Birthday Reminder: ${birthday.name}`,
    text: emailText,
  };

  try {
    const info = await transporter.sendMail({
      from: `"Birthday Reminder" <${settings.emailAddress}>`,
      ...emailData,
    });

    console.log("Message sent: %s", info.messageId);
    
    // Update the birthday's lastNotified date
    await updateBirthday(birthday.id, {
      ...birthday,
      lastNotified: new Date().toISOString(),
    });

    // For ethereal email (test account), log the URL where the message can be viewed
    if (!process.env.SMTP_HOST) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
