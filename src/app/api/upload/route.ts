import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifySessionToken } from '../admin/login/route';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Helper to verify admin authorization via HttpOnly session cookie or Bearer header
function isAuthorized(req: NextRequest): boolean {
  const cookieToken = req.cookies.get('admin_token')?.value;
  if (cookieToken && verifySessionToken(cookieToken)) {
    return true;
  }
  const authHeader = req.headers.get('Authorization');
  const adminPassword = process.env.ADMIN_PASSWORD || 'E@mep301997';
  return Boolean(
    authHeader && 
    adminPassword && 
    authHeader === `Bearer ${adminPassword}`
  );
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    // Validate file presence
    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Strict file size limit (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ message: 'File size exceeds the 5MB limit' }, { status: 400 });
    }

    // Strict allowed image MIME types
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json({ message: 'Only standard image formats (JPEG, PNG, WebP, AVIF, SVG) are permitted' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const sanitizeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const filename = `proj_${Date.now()}_${sanitizeFilename}`;

    // 1. Try Supabase Storage upload first if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from('projects')
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('projects')
            .getPublicUrl(filename);

          if (publicUrlData?.publicUrl) {
            return NextResponse.json({
              message: 'File uploaded successfully to Supabase Storage',
              url: publicUrlData.publicUrl,
              filename,
              size: file.size,
              type: file.type,
            }, { status: 201 });
          }
        } else {
          console.warn('Supabase storage upload error:', uploadError);
        }
      } catch (sbErr) {
        console.warn('Supabase storage upload exception:', sbErr);
      }
    }

    // 2. Try local disk write (local development)
    try {
      const uploadsDir = path.join(process.cwd(), 'public/uploads/projects');
      await fs.mkdir(uploadsDir, { recursive: true });

      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, buffer);

      const publicUrl = `/uploads/projects/${filename}`;

      return NextResponse.json({
        message: 'File uploaded successfully (Local storage)',
        url: publicUrl,
        filename,
        size: file.size,
        type: file.type,
      }, { status: 201 });
    } catch (fsErr) {
      // 3. Fallback for read-only / serverless environment (Vercel)
      console.warn('Local filesystem write failed (serverless environment). Using Base64 data URL fallback:', fsErr);
      
      const mimeType = file.type || 'image/png';
      const base64Data = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64Data}`;

      return NextResponse.json({
        message: 'File uploaded successfully (Base64 data URL)',
        url: dataUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
      }, { status: 201 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('File upload failed:', error);
    return NextResponse.json(
      { message: 'Upload failed', error: errorMessage },
      { status: 500 }
    );
  }
}
