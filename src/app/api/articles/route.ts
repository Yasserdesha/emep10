import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifySessionToken } from '../admin/login/route';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import initialArticles from '@/data/articles.json';

const DEFAULT_ARTICLE_IMAGE = 'https://dpptnkehkzolqrifbagx.supabase.co/storage/v1/object/public/projects/assets/projects/portfolio-2_page-0004.webp';

// Verify admin authorization
function isAuthorized(req: NextRequest): boolean {
  const cookieToken = req.cookies.get('admin_token')?.value;
  if (cookieToken && verifySessionToken(cookieToken)) {
    return true;
  }
  const authHeader = req.headers.get('Authorization');
  const adminPassword = process.env.ADMIN_PASSWORD || 'E@mep301997';
  return Boolean(authHeader && authHeader === `Bearer ${adminPassword}`);
}

let inMemoryArticles: any[] | null = null;

async function getLocalArticles() {
  if (inMemoryArticles) return inMemoryArticles;
  const filePath = path.join(process.cwd(), 'src/data/articles.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    inMemoryArticles = JSON.parse(data);
    return inMemoryArticles!;
  } catch (err) {
    return inMemoryArticles || initialArticles;
  }
}

async function saveLocalArticles(articles: any[]) {
  inMemoryArticles = articles;
  const filePath = path.join(process.cwd(), 'src/data/articles.json');
  try {
    await fs.writeFile(filePath, JSON.stringify(articles, null, 2), 'utf8');
  } catch (err) {
    console.warn('fs.writeFile failed (serverless environment):', err);
  }
}


// GET: List all articles
export async function GET() {
  try {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const formatted = data.map((row: any) => ({
            id: Number(row.id),
            slug: row.slug,
            titleEn: row.title_en,
            titleAr: row.title_ar,
            summaryEn: row.summary_en,
            summaryAr: row.summary_ar,
            contentEn: row.content_en,
            contentAr: row.content_ar,
            image: row.image || DEFAULT_ARTICLE_IMAGE,
            author: row.author,
            readTimeMin: Number(row.read_time_min) || 5,
            createdAt: row.created_at,
          }));

          return NextResponse.json({ articles: formatted, source: 'supabase' });
        }
      } catch (sbErr) {
        console.warn('Supabase articles fetch failed, falling back to local JSON:', sbErr);
      }
    }

    const localArticles = await getLocalArticles();
    return NextResponse.json({ articles: localArticles, source: 'local' });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching articles' }, { status: 500 });
  }
}

// POST: Create new article
export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { slug, titleEn, titleAr, summaryEn, summaryAr, contentEn, contentAr, image, author, readTimeMin } = body;

    const finalTitleAr = (titleAr || titleEn || '').trim();
    const finalTitleEn = (titleEn || titleAr || '').trim();

    if (!finalTitleAr && !finalTitleEn) {
      return NextResponse.json({ message: 'يرجى كتابة عنوان المقال (عربي أو إنجليزي)' }, { status: 400 });
    }

    const finalContentAr = (contentAr || summaryAr || finalTitleAr).trim();
    const finalImage = (image || '').trim() || DEFAULT_ARTICLE_IMAGE;

    // Fail-safe slug generator that handles non-ASCII characters and guarantees a unique slug
    const cleanBase = (slug || finalTitleEn || finalTitleAr || 'article')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const generatedSlug = cleanBase ? `${cleanBase}-${Date.now().toString().slice(-4)}` : `article-${Date.now()}`;

    // Try Supabase first
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .insert([{
            slug: generatedSlug,
            title_en: finalTitleEn,
            title_ar: finalTitleAr,
            summary_en: summaryEn || summaryAr || finalTitleEn,
            summary_ar: summaryAr || finalTitleAr,
            content_en: contentEn || finalContentAr,
            content_ar: finalContentAr,
            image: finalImage,
            author: author || 'E-MEP Engineering Team',
            read_time_min: Number(readTimeMin) || 5,
          }])
          .select();

        if (!error && data) {
          return NextResponse.json({ success: true, article: data[0], source: 'supabase' }, { status: 201 });
        } else if (error) {
          console.error('Supabase article insert error:', error);
        }
      } catch (sbErr) {
        console.warn('Supabase article insert failed, saving to local JSON:', sbErr);
      }
    }

    // Local JSON fallback
    const localArticles = await getLocalArticles();
    const newArticle = {
      id: Date.now(),
      slug: generatedSlug,
      titleEn: finalTitleEn,
      titleAr: finalTitleAr,
      summaryEn: summaryEn || summaryAr || finalTitleEn,
      summaryAr: summaryAr || finalTitleAr,
      contentEn: contentEn || finalContentAr,
      contentAr: finalContentAr,
      image: finalImage,
      author: author || 'E-MEP Engineering Team',
      readTimeMin: Number(readTimeMin) || 5,
      createdAt: new Date().toISOString(),
    };

    localArticles.unshift(newArticle);
    await saveLocalArticles(localArticles);

    return NextResponse.json({ success: true, article: newArticle, source: 'local' }, { status: 201 });
  } catch (error) {
    console.error('Create article server error:', error);
    return NextResponse.json({ message: 'حدث خطأ في حفظ المقال، يرجى إعادة المحاولة' }, { status: 500 });
  }
}

// PUT: Update existing article by ID or Slug
export async function PUT(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const body = await req.json();
    const { titleEn, titleAr, summaryEn, summaryAr, contentEn, contentAr, image, author, readTimeMin } = body;
    const id = searchParams.get('id') || body.id || body.slug;

    if (!id) {
      return NextResponse.json({ message: 'Article ID or slug is required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (titleAr) updateData.title_ar = titleAr;
    if (titleEn || titleAr) updateData.title_en = titleEn || titleAr;
    if (summaryAr) updateData.summary_ar = summaryAr;
    if (summaryEn) updateData.summary_en = summaryEn;
    if (contentAr) updateData.content_ar = contentAr;
    if (contentEn) updateData.content_en = contentEn;
    if (image) updateData.image = image;
    if (author) updateData.author = author;
    if (readTimeMin) updateData.read_time_min = Number(readTimeMin);

    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('articles').update(updateData);
        if (!isNaN(Number(id))) {
          query = query.eq('id', Number(id));
        } else {
          query = query.eq('slug', String(id));
        }
        const { data, error } = await query.select();

        if (!error && data && data.length > 0) {
          return NextResponse.json({ success: true, article: data[0], source: 'supabase' });
        } else if (error) {
          console.warn('Supabase article update notice:', error.message);
        }
      } catch (sbErr) {
        console.warn('Supabase article update failed, attempting local fallback:', sbErr);
      }
    }

    // Local JSON / In-Memory fallback
    const localArticles = await getLocalArticles();
    const idx = localArticles.findIndex(
      (a: any) => String(a.id) === String(id) || String(a.slug) === String(id)
    );

    if (idx !== -1) {
      localArticles[idx] = {
        ...localArticles[idx],
        ...(titleAr && { titleAr }),
        titleEn: titleEn || titleAr || localArticles[idx].titleEn,
        ...(summaryAr && { summaryAr }),
        ...(summaryEn && { summaryEn }),
        ...(contentAr && { contentAr }),
        ...(contentEn && { contentEn }),
        ...(image && { image }),
        ...(readTimeMin && { readTimeMin: Number(readTimeMin) }),
      };
      await saveLocalArticles(localArticles);
      return NextResponse.json({ success: true, article: localArticles[idx], source: 'local' });
    }

    return NextResponse.json({ success: true, message: 'Article processed', source: 'local' });
  } catch (error: any) {
    console.error('Article update handler error:', error);
    return NextResponse.json({ message: error?.message || 'Error updating article' }, { status: 500 });
  }
}


// DELETE: Remove article by id
export async function DELETE(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Article ID is required' }, { status: 400 });
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('articles').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase article delete failed:', err);
      }
    }

    const localArticles = await getLocalArticles();
    const filtered = localArticles.filter((a: any) => String(a.id) !== String(id));
    await saveLocalArticles(filtered);

    return NextResponse.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting article' }, { status: 500 });
  }
}

