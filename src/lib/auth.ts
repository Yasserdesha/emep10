import { NextRequest } from 'next/server';
import crypto from 'crypto';

// Session tokens are valid for 7 days, matching the admin_token cookie maxAge.
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.admin_jwt_secret;
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET environment variable is not set');
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

    // Validate the embedded timestamp and enforce token expiry
    const payloadParts = payload.split(':');
    if (payloadParts.length !== 3 || payloadParts[0] !== 'admin') return false;
    const timestamp = Number(payloadParts[1]);
    if (!Number.isFinite(timestamp)) return false;
    const now = Date.now();
    if (timestamp > now || now - timestamp > SESSION_MAX_AGE_MS) return false;

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
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (authHeader && authHeader.startsWith('Bearer ') && adminPassword) {
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
