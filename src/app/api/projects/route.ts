import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifySessionToken } from '../admin/login/route';

interface ProjectItem {
  id: number;
  image: string;
  titleEn: string;
  titleAr: string;
  category: string;
  catEn: string;
  catAr: string;
  descEn: string;
  descAr: string;
}

const getJsonPath = () => path.join(process.cwd(), 'src/data/projects.json');

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

// GET handler: reads and returns the projects data
export async function GET() {
  try {
    const jsonPath = getJsonPath();
    const fileContent = await fs.readFile(jsonPath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to read projects database:', error);
    return NextResponse.json(
      { message: 'Failed to read projects database', error: msg },
      { status: 500 }
    );
  }
}

// POST handler: appends a new project
export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { titleEn, titleAr, category, catEn, catAr, descEn, descAr, image } = body;

    // Validate inputs
    if (!titleEn || !titleAr || !category || !catEn || !catAr || !descEn || !descAr) {
      return NextResponse.json({ message: 'All text fields are required' }, { status: 400 });
    }

    const jsonPath = getJsonPath();
    const fileContent = await fs.readFile(jsonPath, 'utf8');
    const data = JSON.parse(fileContent);

    // Generate new ID
    const newId = data.projects.length > 0 
      ? Math.max(...data.projects.map((p: ProjectItem) => p.id)) + 1 
      : 1;

    // Build new project object
    const newProject: ProjectItem = {
      id: newId,
      image: image || '/assets/projects/portfolio-2_page-0004.jpg',
      titleEn: titleEn.trim(),
      titleAr: titleAr.trim(),
      category: category.trim(),
      catEn: catEn.trim(),
      catAr: catAr.trim(),
      descEn: descEn.trim(),
      descAr: descAr.trim(),
    };

    // Append and save
    data.projects.push(newProject);
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({ message: 'Project added successfully', project: newProject }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to append project:', error);
    return NextResponse.json(
      { message: 'Failed to save project', error: msg },
      { status: 500 }
    );
  }
}

// PUT handler: updates an existing project by ID
export async function PUT(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, titleEn, titleAr, category, catEn, catAr, descEn, descAr, image } = body;

    if (!id) {
      return NextResponse.json({ message: 'Project ID is required for editing' }, { status: 400 });
    }

    const jsonPath = getJsonPath();
    const fileContent = await fs.readFile(jsonPath, 'utf8');
    const data = JSON.parse(fileContent);

    const index = data.projects.findIndex((p: ProjectItem) => p.id === Number(id));
    if (index === -1) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    // Update existing project
    data.projects[index] = {
      ...data.projects[index],
      titleEn: titleEn ? titleEn.trim() : data.projects[index].titleEn,
      titleAr: titleAr ? titleAr.trim() : data.projects[index].titleAr,
      category: category ? category.trim() : data.projects[index].category,
      catEn: catEn ? catEn.trim() : data.projects[index].catEn,
      catAr: catAr ? catAr.trim() : data.projects[index].catAr,
      descEn: descEn ? descEn.trim() : data.projects[index].descEn,
      descAr: descAr ? descAr.trim() : data.projects[index].descAr,
      image: image ? image.trim() : data.projects[index].image,
    };

    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({ 
      message: 'Project updated successfully', 
      project: data.projects[index] 
    }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to update project:', error);
    return NextResponse.json(
      { message: 'Failed to update project', error: msg },
      { status: 500 }
    );
  }
}

// DELETE handler: removes a project by ID
export async function DELETE(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let idToDelete = searchParams.get('id');

    if (!idToDelete) {
      const body = await req.json().catch(() => ({}));
      idToDelete = body.id;
    }

    if (!idToDelete) {
      return NextResponse.json({ message: 'Project ID is required for deletion' }, { status: 400 });
    }

    const jsonPath = getJsonPath();
    const fileContent = await fs.readFile(jsonPath, 'utf8');
    const data = JSON.parse(fileContent);

    const targetId = Number(idToDelete);
    const initialLength = data.projects.length;
    data.projects = data.projects.filter((p: ProjectItem) => p.id !== targetId);

    if (data.projects.length === initialLength) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to delete project:', error);
    return NextResponse.json(
      { message: 'Failed to delete project', error: msg },
      { status: 500 }
    );
  }
}
