import { NextResponse } from 'next/server';
import { format, parseISO, differenceInDays } from 'date-fns';
import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read birthdays from a JSON file for server-side operations
const getBirthdays = () => {
  try {
    const filePath = join(process.cwd(), 'data', 'birthdays.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading birthdays:', error);
    return [];
  }
};

// Validate environment variables
const requiredEnvVars = {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  CRON_API_KEY: process.env.CRON_API_KEY
};

// Create a transporter using SMTP
const createTransporter = () => {
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

async function sendBirthdayEmail(birthday: any, daysUntil: number) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    throw new Error('Admin email not configured');
  }

  const transporter = createTransporter();

  const emailContent = `
    <h2>Birthday Reminder</h2>
    <p>Hello! This is a reminder about an upcoming birthday:</p>
    <p><strong>${birthday.name}</strong> has a birthday in ${daysUntil} days (${format(parseISO(birthday.date), 'dd.MM.yyyy')}).</p>
    <p>Please don't forget to prepare something nice!</p>
    <hr>
    <p><small>This is an automated message from your Birthday Reminder app.</small></p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || adminEmail,
      to: adminEmail,
      subject: `Birthday Reminder: ${birthday.name} (${daysUntil} days)`,
      html: emailContent,
    });
  } catch (error: any) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export async function GET(request: Request) {
  try {
    // Validate API key
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('key');
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'API key is required'
      }, { status: 401 });
    }

    if (apiKey !== process.env.CRON_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Invalid API key'
      }, { status: 401 });
    }

    // Get birthdays from JSON file
    const birthdays = getBirthdays();
    const today = new Date();
    const currentYear = today.getFullYear();
    const notificationsSent = [];
    const errors = [];

    for (const birthday of birthdays) {
      if (!birthday.active) continue;

      const birthdayDate = parseISO(birthday.date);
      const nextBirthday = new Date(currentYear, birthdayDate.getMonth(), birthdayDate.getDate());
      
      // If birthday has passed this year, look at next year's birthday
      if (nextBirthday < today) {
        nextBirthday.setFullYear(currentYear + 1);
      }

      const daysUntil = differenceInDays(nextBirthday, today);

      // Check if we should send a reminder and haven't sent one this year
      if (daysUntil <= birthday.reminderDays && 
          daysUntil >= 0 && 
          birthday.lastEmailYear !== currentYear) {
        
        try {
          await sendBirthdayEmail(birthday, daysUntil);
          
          notificationsSent.push({
            name: birthday.name,
            daysUntil,
            success: true
          });
        } catch (error: any) {
          console.error(`Failed to send email for ${birthday.name}:`, error);
          errors.push({
            name: birthday.name,
            error: error.message
          });
          notificationsSent.push({
            name: birthday.name,
            daysUntil,
            success: false,
            error: error.message
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      notificationsSent,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Checkup error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}
