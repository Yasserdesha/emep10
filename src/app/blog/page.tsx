import type { Metadata } from 'next';
import articlesData from '@/data/articles.json';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'مدونة الهندسة الكهروميكانيكية وBIM | مقالات E-MEP المتخصصة',
  description: 'مقالات وأدلة هندسية شاملة حول الكود المصري للحماية المدنية، واشتراطات حريق المطاعم والمحلات، ونمذجة معلومات البناء BIM Revit.',
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    alternateLocale: 'en_US',
    url: '/blog',
    siteName: 'E-MEP Electromechanical Works',
    title: 'مدونة الهندسة الكهروميكانيكية وBIM | E-MEP',
    description: 'مقالات وأدلة هندسية شاملة حول الكود المصري للحماية المدنية ونمذجة الـ BIM.',
    images: [
      {
        url: '/logo/logo.png',
        width: 800,
        height: 800,
        alt: 'E-MEP Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مدونة الهندسة الكهروميكانيكية وBIM | E-MEP',
    description: 'مقالات هندسية متخصصة من شركة E-MEP.',
    images: ['/logo/logo.png'],
  },
};

export const revalidate = 60; // ISR 60s

async function getArticles() {
  if (isSupabaseConfigured() && supabase) {
    // 1. Try articles table
    try {
      const { data: dbArticles, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && dbArticles && dbArticles.length > 0) {
        return dbArticles.map((a: any) => ({
          id: Number(a.id),
          slug: a.slug,
          titleEn: a.title_en,
          titleAr: a.title_ar,
          summaryEn: a.summary_en,
          summaryAr: a.summary_ar,
          contentEn: a.content_en,
          contentAr: a.content_ar,
          image: a.image,
          author: a.author || 'E-MEP Engineering Team',
          readTimeMin: Number(a.read_time_min) || 5,
          createdAt: a.created_at,
        }));
      }
    } catch (err) {
      // continue
    }

    // 2. Try projects table (category = 'article')
    try {
      const pRes = await supabase
        .from('projects')
        .select('*')
        .eq('category', 'article')
        .order('id', { ascending: false });

      if (!pRes.error && pRes.data && pRes.data.length > 0) {
        return pRes.data.map((a: any) => ({
          id: Number(a.id),
          slug: a.cat_en,
          titleEn: a.title_en,
          titleAr: a.title_ar,
          summaryEn: a.desc_en,
          summaryAr: a.desc_en,
          contentEn: a.desc_en,
          contentAr: a.desc_ar,
          image: a.image,
          author: 'E-MEP Engineering Team',
          readTimeMin: Number(a.cat_ar) || 5,
          createdAt: a.created_at,
        }));
      }
    } catch (err) {
      // continue
    }
  }
  return articlesData;
}

export default async function BlogIndexPage() {
  const articles = await getArticles();
  return <BlogClient articles={articles} />;
}
