import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const BIRTHDAYS_FILE = join(process.cwd(), 'data', 'birthdays.json');

// Helper functions to read and write birthdays
const readBirthdays = () => {
  try {
    const content = readFileSync(BIRTHDAYS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading birthdays:', error);
    return [];
  }
};

const writeBirthdays = (birthdays: any[]) => {
  try {
    writeFileSync(BIRTHDAYS_FILE, JSON.stringify(birthdays, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing birthdays:', error);
    return false;
  }
};

// GET /api/birthdays
export async function GET() {
  try {
    const birthdays = readBirthdays();
    return NextResponse.json(birthdays);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/birthdays
export async function POST(request: Request) {
  try {
    const birthday = await request.json();
    const birthdays = readBirthdays();
    
    // Add new birthday
    birthdays.push(birthday);
    
    // Write back to file
    if (!writeBirthdays(birthdays)) {
      throw new Error('Failed to write birthdays to file');
    }
    
    return NextResponse.json(birthday);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/birthdays
export async function PUT(request: Request) {
  try {
    const updatedBirthday = await request.json();
    const birthdays = readBirthdays();
    
    // Update existing birthday
    const index = birthdays.findIndex((b: any) => b.id === updatedBirthday.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Birthday not found' }, { status: 404 });
    }
    
    birthdays[index] = updatedBirthday;
    
    // Write back to file
    if (!writeBirthdays(birthdays)) {
      throw new Error('Failed to write birthdays to file');
    }
    
    return NextResponse.json(updatedBirthday);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/birthdays?id=...
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const birthdays = readBirthdays();
    
    // Remove birthday
    const filteredBirthdays = birthdays.filter((b: any) => b.id !== id);
    
    if (filteredBirthdays.length === birthdays.length) {
      return NextResponse.json({ error: 'Birthday not found' }, { status: 404 });
    }
    
    // Write back to file
    if (!writeBirthdays(filteredBirthdays)) {
      throw new Error('Failed to write birthdays to file');
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
