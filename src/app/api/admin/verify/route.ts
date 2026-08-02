import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '../login/route';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const authHeader = req.headers.get('Authorization');
    const adminPassword = process.env.ADMIN_PASSWORD;

    const isValidHeader = Boolean(
      authHeader && 
      adminPassword && 
      authHeader === `Bearer ${adminPassword}`
    );
    const isValidCookie = Boolean(token && verifySessionToken(token));

    if (!isValidCookie && !isValidHeader) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

