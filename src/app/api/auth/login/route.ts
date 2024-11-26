import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Here you would typically validate against your database
    // This is just a mock implementation
    if (email === 'test@example.com' && password === 'password') {
      const token = sign(
        { email, id: '1', role: 'admin' },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return NextResponse.json({ token });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
