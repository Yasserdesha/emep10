import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import { verifyAdminAuth } from '@/lib/auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

// In-memory cache fallback for serverless environments when local filesystem is read-only
let inMemoryData: { projects: ProjectItem[] } | null = null;

async function readLocalData(): Promise<{ projects: ProjectItem[] }> {
  if (inMemoryData) return inMemoryData;
  try {
    const jsonPath = getJsonPath();
    const fileContent = await fs.readFile(jsonPath, 'utf8');
    inMemoryData = JSON.parse(fileContent);
    return inMemoryData!;
  } catch (error) {
    console.error('Failed to read local projects database:', error);
    return inMemoryData || { projects: [] };
  }
}

async function saveLocalData(data: { projects: ProjectItem[] }) {
  inMemoryData = data;
  try {
    const jsonPath = getJsonPath();
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (fsErr) {
    console.warn('fs.writeFile failed (read-only / Vercel serverless environment):', fsErr);
  }
}

// Helper to verify admin authorization via HttpOnly session cookie or Bearer header
function isAuthorized(req: NextRequest): boolean {
  return verifyAdminAuth(req);
}

// Helper mapper from Supabase snake_case to app camelCase with reliable image fallback
function mapSupabaseToProjectItem(row: any): ProjectItem {
  const id = Number(row.id);
  const safeImage = (row.image && !row.image.includes('supabase.co'))
    ? row.image
    : `/assets/projects/portfolio-2_page-00${String(Math.min(37, Math.max(4, id + 3))).padStart(2, '0')}.jpg`;

  return {
    id,
    image: safeImage,
    titleEn: row.title_en || '',
    titleAr: row.title_ar || '',
    category: row.category || 'retail',
    catEn: row.cat_en || '',
    catAr: row.cat_ar || '',
    descEn: row.desc_en || '',
    descAr: row.desc_ar || '',
  };
}

// GET handler: reads and returns the projects data (with Supabase primary & JSON fallback)
export async function GET() {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .neq('category', 'article')
        .range(0, 1000)
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        const projects = data.map(mapSupabaseToProjectItem);
        return NextResponse.json({ projects }, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        });
      }
    }

    const data = await readLocalData();
    const cleanProjects = (data.projects || []).filter((p: any) => p.category !== 'article');
    return NextResponse.json({ projects: cleanProjects }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
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

    if (!titleEn || !titleAr || !category || !catEn || !catAr || !descEn || !descAr) {
      return NextResponse.json({ message: 'All text fields are required' }, { status: 400 });
    }

    let createdProject: ProjectItem | null = null;

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          image: image || '/assets/projects/portfolio-2_page-0004.jpg',
          title_en: titleEn.trim(),
          title_ar: titleAr.trim(),
          category: category.trim(),
          cat_en: catEn.trim(),
          cat_ar: catAr.trim(),
          desc_en: descEn.trim(),
          desc_ar: descAr.trim(),
        }])
        .select()
        .single();

      if (!error && data) {
        createdProject = mapSupabaseToProjectItem(data);
      } else if (error) {
        console.error('Supabase insert error:', error);
      }
    }

    // Always update local data / memory fallback
    const localData = await readLocalData();
    const newId = createdProject
      ? createdProject.id
      : (localData.projects.length > 0 ? Math.max(...localData.projects.map((p: ProjectItem) => p.id)) + 1 : 1);

    const newProject: ProjectItem = createdProject || {
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

    localData.projects.push(newProject);
    await saveLocalData(localData);

    // Invalidate Next.js cache for immediate update
    revalidatePath('/');
    revalidatePath('/api/projects');

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

    // Read id from URL query params first (how frontend sends it), then fall back to body
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    const { titleEn, titleAr, category, catEn, catAr, descEn, descAr, image } = body;

    const id = searchParams.get('id') || body.id;

    if (!id) {
      return NextResponse.json({ message: 'Project ID is required for editing' }, { status: 400 });
    }

    const targetId = Number(id);

    if (isSupabaseConfigured() && supabase) {
      const updates: any = {};
      if (titleEn) updates.title_en = titleEn.trim();
      if (titleAr) updates.title_ar = titleAr.trim();
      if (category) updates.category = category.trim();
      if (catEn) updates.cat_en = catEn.trim();
      if (catAr) updates.cat_ar = catAr.trim();
      if (descEn) updates.desc_en = descEn.trim();
      if (descAr) updates.desc_ar = descAr.trim();
      if (image) updates.image = image.trim();
      updates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', targetId);

      if (error) {
        console.error('Supabase update error:', error);
      }
    }

    // Always update local memory/file fallback
    const localData = await readLocalData();
    const index = localData.projects.findIndex((p: ProjectItem) => p.id === targetId);
    if (index !== -1) {
      localData.projects[index] = {
        ...localData.projects[index],
        titleEn: titleEn ? titleEn.trim() : localData.projects[index].titleEn,
        titleAr: titleAr ? titleAr.trim() : localData.projects[index].titleAr,
        category: category ? category.trim() : localData.projects[index].category,
        catEn: catEn ? catEn.trim() : localData.projects[index].catEn,
        catAr: catAr ? catAr.trim() : localData.projects[index].catAr,
        descEn: descEn ? descEn.trim() : localData.projects[index].descEn,
        descAr: descAr ? descAr.trim() : localData.projects[index].descAr,
        image: image ? image.trim() : localData.projects[index].image,
      };
      await saveLocalData(localData);
    }

    // Invalidate Next.js cache for immediate update
    revalidatePath('/');
    revalidatePath('/api/projects');

    return NextResponse.json({ 
      message: 'Project updated successfully' 
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

    const targetId = Number(idToDelete);

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', targetId);

      if (error) {
        console.error('Supabase delete error:', error);
      }
    }

    // Update local memory/file fallback
    const localData = await readLocalData();
    localData.projects = localData.projects.filter((p: ProjectItem) => p.id !== targetId);
    await saveLocalData(localData);

    // Invalidate Next.js cache for immediate update
    revalidatePath('/');
    revalidatePath('/api/projects');

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
