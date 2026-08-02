import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory rate limiting map for brute-force protection
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes lock

function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET is not configured in environment variables');
  }
  return secret;
}

export function generateSessionToken(): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(16).toString('hex');
  const payload = `admin:${timestamp}:${random}`;
  const signature = crypto.createHmac('sha256', getJwtSecret()).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  try {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payload, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', getJwtSecret()).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const now = Date.now();

    // Check rate limit status
    const attempt = loginAttempts.get(ip);
    if (attempt && attempt.lockUntil > now) {
      const remainingMins = Math.ceil((attempt.lockUntil - now) / 60000);
      return NextResponse.json(
        { message: `حساب الإدارة محظر مؤقتاً لحمايته من المحاولات العشوائية. يرجى الانتظار ${remainingMins} دقيقة.` },
        { status: 429 }
      );
    }

    const { password } = await req.json();

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ message: 'رمز الدخول مطلوب' }, { status: 400 });
    }

    const expectedPassword = process.env.ADMIN_PASSWORD || 'E@mep301997';

    const passwordBuffer = Buffer.from(password.trim());
    const expectedBuffer = Buffer.from(expectedPassword);

    const isMatch = passwordBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(passwordBuffer, expectedBuffer);

    if (!isMatch) {
      // Record failed attempt
      const currentCount = (attempt && attempt.lockUntil <= now ? 0 : attempt?.count || 0) + 1;
      let lockUntil = 0;
      if (currentCount >= MAX_ATTEMPTS) {
        lockUntil = now + LOCK_TIME_MS;
      }
      loginAttempts.set(ip, { count: currentCount, lockUntil });

      const remaining = MAX_ATTEMPTS - currentCount;
      const warning = remaining > 0 
        ? `رمز الدخول غير صحيح. متبقي ${remaining} محاولات قبل الحظر المؤقت.`
        : `تم حظر المحاولات من هذا الجهاز لمدة 15 دقيقة لحماية الموقع.`;

      return NextResponse.json({ message: warning }, { status: 401 });
    }

    // Clear failed attempts on successful login
    loginAttempts.delete(ip);

    // Generate secure server signed token
    const token = generateSessionToken();

    // Create HTTP-Only, Secure, SameSite=Strict cookie response
    const response = NextResponse.json({ 
      message: 'تم تسجيل الدخول بنجاح', 
      authenticated: true 
    }, { status: 200 });

    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ message: 'خطأ في عملية التحقق من الهوية' }, { status: 500 });
  }
}

