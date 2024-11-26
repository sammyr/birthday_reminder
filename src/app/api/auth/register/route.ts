import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    // Here you would typically:
    // 1. Validate the input
    // 2. Check if user already exists
    // 3. Hash the password
    // 4. Store in database
    // This is just a mock implementation
    const token = sign(
      { email, id: Date.now().toString(), name, role: 'user' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
