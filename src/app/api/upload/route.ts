import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

import { verifySessionToken } from '../admin/login/route';

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

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type (must be image)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ message: 'Uploaded file must be an image' }, { status: 400 });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public/uploads/projects');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate safe unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const sanitizeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `proj_${Date.now()}_${sanitizeFilename}`;
    const filePath = path.join(uploadsDir, filename);

    // Save to disk
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/projects/${filename}`;

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type,
    }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('File upload failed:', error);
    return NextResponse.json(
      { message: 'Upload failed', error: errorMessage },
      { status: 500 }
    );
  }
}
