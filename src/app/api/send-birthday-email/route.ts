import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Birthday } from '@/types/Birthday';
import { updateBirthday } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { birthday, settings } = await request.json();
    
    if (!settings.emailNotifications || !settings.emailAddress) {
      return NextResponse.json(
        { error: 'Email notifications are disabled' },
        { status: 400 }
      );
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
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const emailText = settings.emailTemplate
      .replace('{name}', birthday.name)
      .replace('{age}', age.toString())
      .replace('{days}', daysUntil.toString())
      .replace('{sender}', settings.emailAddress);

    const info = await transporter.sendMail({
      from: `"Birthday Reminder" <${settings.emailAddress}>`,
      to: settings.emailAddress,
      subject: `Birthday Reminder: ${birthday.name}`,
      text: emailText,
    });

    // Update the birthday's lastNotified date
    await updateBirthday(birthday.id, {
      ...birthday,
      lastNotified: new Date().toISOString(),
    });

    // For ethereal email (test account), log the URL where the message can be viewed
    const previewUrl = process.env.SMTP_HOST 
      ? undefined 
      : nodemailer.getTestMessageUrl(info);

    return NextResponse.json({ 
      success: true,
      messageId: info.messageId,
      previewUrl
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
