import { NextRequest } from 'next/server';
import crypto from 'crypto';

export function getJwtSecret(): string {
  return process.env.ADMIN_JWT_SECRET || process.env.admin_jwt_secret || 'EMEP_SUPER_SECRET_JWT_KEY_2026_PRODUCTION_SECURE';
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
    const sigA = crypto.createHash('sha256').update(signature).digest();
    const sigB = crypto.createHash('sha256').update(expectedSignature).digest();
    return crypto.timingSafeEqual(sigA, sigB);
  } catch {
    return false;
  }
}

export function verifyAdminAuth(req: NextRequest): boolean {
  try {
    // 1. Verify HttpOnly Session Cookie
    const cookieToken = req.cookies.get('admin_token')?.value;
    if (cookieToken && verifySessionToken(cookieToken)) {
      return true;
    }

    // 2. Verify Bearer Header with Constant-Time SHA256 Comparison
    const authHeader = req.headers.get('Authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'E@mep301997';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      const hashA = crypto.createHash('sha256').update(token).digest();
      const hashB = crypto.createHash('sha256').update(adminPassword).digest();
      if (crypto.timingSafeEqual(hashA, hashB)) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sanitizeText(str: string, maxLength: number = 2000): string {
  if (!str || typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}
