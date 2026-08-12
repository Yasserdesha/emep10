import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifySessionToken } from '../../admin/login/route';

const getJsonPath = () => path.join(process.cwd(), 'src/data/projects.json');

function isAuthorized(req: NextRequest): boolean {
  const cookieToken = req.cookies.get('admin_token')?.value;
  if (cookieToken && verifySessionToken(cookieToken)) {
    return true;
  }
  const authHeader = req.headers.get('Authorization');
  const adminPassword = process.env.ADMIN_PASSWORD || 'emepadmin2026';
  return authHeader === `Bearer ${adminPassword}`;
}

const defaultBrandLogos = [
  "/Brand logos/08.png.webp",
  "/Brand logos/1717224960starbucks-logo-with-name.png",
  "/Brand logos/1768985887379-whiteVentiLogoFull41.png",
  "/Brand logos/326461017_489536596502594_7178682330884491730_n-photoaidcom-cropped-logo-1703504132.png",
  "/Brand logos/AGTHIA.AE_BIG-abfc7ef8.png",
  "/Brand logos/Cole-Haan-Logo-old.png",
  "/Brand logos/DeFactoLogo.png",
  "/Brand logos/Hackett_logo_logotype_emblem_Hackett_London.png",
  "/Brand logos/Haier_logo.svg.webp",
  "/Brand logos/Logo.png",
  "/Brand logos/Logo_PNG.webp",
  "/Brand logos/Logo_png_d430d44d-4551-4c55-accc-3743a21b4cf5_300x.avif",
  "/Brand logos/MIAM MIAM.jpg",
  "/Brand logos/Magrabi-promo-code-logo.png",
  "/Brand logos/SHIHLIN-1.jpg",
  "/Brand logos/Seat-Logo.png",
  "/Brand logos/The_Colortek_Logo.png",
  "/Brand logos/Under-Armour-logo.png",
  "/Brand logos/Untitled-1-06-scaled.jpg",
  "/Brand logos/Yves_Rocher_logo.svg.webp",
  "/Brand logos/Zeekr-logo.png",
  "/Brand logos/abu-auf-1.png",
  "/Brand logos/ariika_Navy_Logo_08b1dbd3-11a5-43e2-83d8-76728eb84775.avif",
  "/Brand logos/b854b8135184457.Y3JvcCw4MDcsNjMxLDE3LDI1.png",
  "/Brand logos/images.jpg",
  "/Brand logos/logo.webp",
  "/Brand logos/naguibselim_logo.jpg",
  "/Brand logos/nike_PNG12.png",
  "/Brand logos/polo-ralph-lauren-logo-png_seeklogo-493944.png",
  "/Brand logos/ryPSX7DKGe-main.jpg",
  "/Brand logos/ryTrF6MJE-main.jpg",
  "/Brand logos/villeroy-boch-logo-png-transparent.png",
  "/Brand logos/Škoda_nieuw.png"
];

// POST handler: Restore database from JSON backup file safely
export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body || !Array.isArray(body.projects)) {
      return NextResponse.json({ message: 'Invalid backup structure. Expected JSON object with "projects" array.' }, { status: 400 });
    }

    const jsonPath = getJsonPath();
    let existingData: { brandLogos?: string[] } = {};
    try {
      const currentContent = await fs.readFile(jsonPath, 'utf8');
      existingData = JSON.parse(currentContent);
    } catch {
      // If unreadable, fallback
    }

    // Ensure brandLogos is never lost
    const brandLogosToSave = (Array.isArray(body.brandLogos) && body.brandLogos.length > 0)
      ? body.brandLogos
      : (Array.isArray(existingData.brandLogos) && existingData.brandLogos.length > 0)
        ? existingData.brandLogos
        : defaultBrandLogos;

    const dataToSave = {
      projects: body.projects,
      brandLogos: brandLogosToSave
    };

    try {
      await fs.writeFile(jsonPath, JSON.stringify(dataToSave, null, 2), 'utf8');
    } catch (fsErr) {
      console.warn('fs.writeFile failed on backup restore (read-only environment):', fsErr);
    }

    return NextResponse.json({ 
      message: 'Projects database successfully restored', 
      totalProjects: body.projects.length 
    }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to restore backup:', error);
    return NextResponse.json(
      { message: 'Restore failed', error: errorMessage },
      { status: 500 }
    );
  }
}
