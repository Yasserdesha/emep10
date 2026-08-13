import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifySessionToken } from '../admin/login/route';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import initialArticles from '@/data/articles.json';

const DEFAULT_ARTICLE_IMAGE = 'https://dpptnkehkzolqrifbagx.supabase.co/storage/v1/object/public/projects/proj_1786597773542_article_bim_revit_mep_1786596972626.png';

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

function buildSlug(titleAr: string, titleEn?: string, customSlug?: string): string {
  if (customSlug && customSlug.trim()) {
    return customSlug.trim().toLowerCase().replace(/\s+/g, '-');
  }

  let base = '';
  if (titleEn && /[a-zA-Z]/.test(titleEn)) {
    base = titleEn.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  }

  if (!base || base.replace(/-/g, '').length < 2) {
    base = titleAr
      .toLowerCase()
      .trim()
      .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  const clean = base.replace(/(^-|-$)/g, '');
  return clean ? `${clean}-${Date.now().toString().slice(-4)}` : `article-${Date.now().toString().slice(-4)}`;
}

// GET: List all articles (Supabase primary with projects table & JSON fallbacks)
export async function GET() {
  try {
    if (isSupabaseConfigured() && supabase) {
      // 1. Try articles table
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
            author: row.author || 'E-MEP Engineering Team',
            readTimeMin: Number(row.read_time_min) || 5,
            createdAt: row.created_at,
          }));

          return NextResponse.json({ articles: formatted, source: 'supabase-articles' });
        }
      } catch (err) {
        // continue
      }

      // 2. Try projects table with category = 'article'
      try {
        const pRes = await supabase
          .from('projects')
          .select('*')
          .eq('category', 'article')
          .order('id', { ascending: false });

        if (!pRes.error && pRes.data && pRes.data.length > 0) {
          const formatted = pRes.data.map((row: any) => ({
            id: Number(row.id),
            slug: row.cat_en,
            titleEn: row.title_en,
            titleAr: row.title_ar,
            summaryEn: row.desc_en,
            summaryAr: row.desc_en,
            contentEn: row.desc_en,
            contentAr: row.desc_ar,
            image: row.image || DEFAULT_ARTICLE_IMAGE,
            author: 'E-MEP Engineering Team',
            readTimeMin: Number(row.cat_ar) || 5,
            createdAt: row.created_at,
          }));

          return NextResponse.json({ articles: formatted, source: 'supabase-projects' });
        }
      } catch (err) {
        // continue
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
    const finalSummaryAr = (summaryAr || finalTitleAr).trim();
    const finalImage = (image || '').trim() || DEFAULT_ARTICLE_IMAGE;

    const generatedSlug = buildSlug(finalTitleAr, finalTitleEn, slug);

    if (isSupabaseConfigured() && supabase) {
      // 1. Try insert into articles table
      try {
        const { data, error } = await supabase
          .from('articles')
          .insert([{
            slug: generatedSlug,
            title_en: finalTitleEn,
            title_ar: finalTitleAr,
            summary_en: summaryEn || finalSummaryAr,
            summary_ar: finalSummaryAr,
            content_en: contentEn || finalContentAr,
            content_ar: finalContentAr,
            image: finalImage,
            author: author || 'E-MEP Engineering Team',
            read_time_min: Number(readTimeMin) || 5,
          }])
          .select();

        if (!error && data && data.length > 0) {
          return NextResponse.json({ success: true, article: data[0], source: 'supabase-articles' }, { status: 201 });
        }
      } catch (err) {
        // continue
      }

      // 2. Insert into projects table with category = 'article'
      try {
        const pInsert = await supabase
          .from('projects')
          .insert([{
            title_ar: finalTitleAr,
            title_en: finalTitleEn,
            category: 'article',
            cat_en: generatedSlug,
            cat_ar: String(readTimeMin || 5),
            desc_ar: finalContentAr,
            desc_en: finalSummaryAr,
            image: finalImage,
          }])
          .select();

        if (!pInsert.error && pInsert.data && pInsert.data.length > 0) {
          const row = pInsert.data[0];
          const formatted = {
            id: Number(row.id),
            slug: row.cat_en,
            titleEn: row.title_en,
            titleAr: row.title_ar,
            summaryEn: row.desc_en,
            summaryAr: row.desc_en,
            contentEn: row.desc_en,
            contentAr: row.desc_ar,
            image: row.image,
            author: 'E-MEP Engineering Team',
            readTimeMin: Number(row.cat_ar) || 5,
            createdAt: row.created_at,
          };
          return NextResponse.json({ success: true, article: formatted, source: 'supabase-projects' }, { status: 201 });
        }
      } catch (err) {
        console.warn('Supabase projects table insert failed:', err);
      }
    }

    // Local JSON / in-memory fallback
    const localArticles = await getLocalArticles();
    const newArticle = {
      id: Date.now(),
      slug: generatedSlug,
      titleEn: finalTitleEn,
      titleAr: finalTitleAr,
      summaryEn: summaryEn || finalSummaryAr,
      summaryAr: finalSummaryAr,
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

// PUT: Update existing article
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

    if (isSupabaseConfigured() && supabase) {
      // 1. Try updating in articles table
      try {
        const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (titleAr) updateData.title_ar = titleAr;
        if (titleEn || titleAr) updateData.title_en = titleEn || titleAr;
        if (summaryAr) updateData.summary_ar = summaryAr;
        if (summaryEn) updateData.summary_en = summaryEn;
        if (contentAr) updateData.content_ar = contentAr;
        if (contentEn) updateData.content_en = contentEn;
        if (image) updateData.image = image;
        if (author) updateData.author = author;
        if (readTimeMin) updateData.read_time_min = Number(readTimeMin);

        let query = supabase.from('articles').update(updateData);
        query = !isNaN(Number(id)) ? query.eq('id', Number(id)) : query.eq('slug', String(id));
        const { data, error } = await query.select();

        if (!error && data && data.length > 0) {
          return NextResponse.json({ success: true, article: data[0], source: 'supabase-articles' });
        }
      } catch (err) {
        // continue
      }

      // 2. Try updating in projects table (where category = 'article')
      try {
        const pUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (titleAr) pUpdate.title_ar = titleAr;
        if (titleEn || titleAr) pUpdate.title_en = titleEn || titleAr;
        if (contentAr) pUpdate.desc_ar = contentAr;
        if (summaryAr) pUpdate.desc_en = summaryAr;
        if (image) pUpdate.image = image;
        if (readTimeMin) pUpdate.cat_ar = String(readTimeMin);

        let pQuery = supabase.from('projects').update(pUpdate).eq('category', 'article');
        pQuery = !isNaN(Number(id)) ? pQuery.eq('id', Number(id)) : pQuery.eq('cat_en', String(id));
        const pRes = await pQuery.select();

        if (!pRes.error && pRes.data && pRes.data.length > 0) {
          const row = pRes.data[0];
          const formatted = {
            id: Number(row.id),
            slug: row.cat_en,
            titleEn: row.title_en,
            titleAr: row.title_ar,
            summaryEn: row.desc_en,
            summaryAr: row.desc_en,
            contentEn: row.desc_en,
            contentAr: row.desc_ar,
            image: row.image,
            author: 'E-MEP Engineering Team',
            readTimeMin: Number(row.cat_ar) || 5,
            createdAt: row.created_at,
          };
          return NextResponse.json({ success: true, article: formatted, source: 'supabase-projects' });
        }
      } catch (err) {
        // continue
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

    return NextResponse.json({ success: true, message: 'Article updated', source: 'local' });
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
        // continue
      }
      try {
        await supabase.from('projects').delete().eq('id', id).eq('category', 'article');
      } catch (err) {
        // continue
      }
      try {
        await supabase.from('projects').delete().eq('cat_en', id).eq('category', 'article');
      } catch (err) {
        // continue
      }
    }

    const localArticles = await getLocalArticles();
    const filtered = localArticles.filter((a: any) => String(a.id) !== String(id) && String(a.slug) !== String(id));
    await saveLocalArticles(filtered);

    return NextResponse.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting article' }, { status: 500 });
  }
}
