import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

// Helper function to read settings
function readSettings() {
  try {
    const data = readFileSync(settingsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return default settings
    return {
      reminderDays: 7,
      emailNotifications: false,
      emailTemplate: 'Erinnerung: {name} hat in {days} Geburtstag!\n\nHallo,\n\nich möchte Sie daran erinnern, dass {name} in {days} {age} Jahre alt wird.\n\nViele Grüße\n{sender}',
      emailAddress: ''
    };
  }
}

// Helper function to write settings
function writeSettings(settings: any) {
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

export async function GET() {
  const settings = readSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  try {
    const settings = await request.json();
    writeSettings(settings);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
