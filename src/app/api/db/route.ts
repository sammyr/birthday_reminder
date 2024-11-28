import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

// Initialize database with default data if it doesn't exist
const defaultData = {
  stores: [],
  settings: {
    reminderDays: 7,
    emailNotifications: false,
    emailTemplate: 'Reminder: {name} has a birthday in {days} days!\n\nHi,\n\nThis is a reminder that {name} will turn {age} in {days} days.\n\nBest regards,\n{sender}',
    emailAddress: ''
  }
};

async function ensureDbExists() {
  try {
    await readFile(DB_FILE, 'utf-8');
  } catch (error) {
    // If file doesn't exist, create it with default data
    await writeFile(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

export async function GET() {
  try {
    await ensureDbExists();
    const data = await readFile(DB_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading database:', error);
    return NextResponse.json(
      { error: 'Failed to read database' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    await writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing to database:', error);
    return NextResponse.json(
      { error: 'Failed to write to database' },
      { status: 500 }
    );
  }
}
