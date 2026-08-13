import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifySessionToken } from '../admin/login/route';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import initialArticles from '@/data/articles.json';

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

async function getLocalArticles() {
  const filePath = path.join(process.cwd(), 'src/data/articles.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return initialArticles;
  }
}

async function saveLocalArticles(articles: any[]) {
  const filePath = path.join(process.cwd(), 'src/data/articles.json');
  await fs.writeFile(filePath, JSON.stringify(articles, null, 2), 'utf8');
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
            image: row.image,
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

    if (!titleAr || !titleEn || !contentAr || !image) {
      return NextResponse.json({ message: 'يرجى ملء كافة العناوين وإرفاق صورة المقال' }, { status: 400 });
    }

    // Fail-safe slug generator that handles non-ASCII characters and guarantees a unique slug
    const cleanBase = (slug || titleEn || titleAr || 'article')
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
            title_en: titleEn,
            title_ar: titleAr,
            summary_en: summaryEn || summaryAr || '',
            summary_ar: summaryAr || '',
            content_en: contentEn || contentAr || '',
            content_ar: contentAr || '',
            image,
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
      titleEn,
      titleAr,
      summaryEn: summaryEn || summaryAr || '',
      summaryAr: summaryAr || '',
      contentEn: contentEn || contentAr || '',
      contentAr: contentAr || '',
      image,
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
