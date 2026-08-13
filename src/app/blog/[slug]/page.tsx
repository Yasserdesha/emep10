import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import SafeImage from '@/components/SafeImage';
import articlesData from '@/data/articles.json';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import ArticleClient from './ArticleClient';


interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR 60s

async function getArticleBySlug(rawSlug: string) {
  const slug = decodeURIComponent(rawSlug).trim();

  if (isSupabaseConfigured() && supabase) {
    // 1. Try articles table
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .in('slug', [slug, rawSlug])
        .limit(1);

      if (!error && data && data.length > 0) {
        const row = data[0];
        return {
          id: Number(row.id),
          slug: row.slug,
          titleEn: row.title_en,
          titleAr: row.title_ar,
          summaryEn: row.summary_en,
          summaryAr: row.summary_ar,
          contentEn: row.content_en,
          contentAr: row.content_ar,
          image: row.image,
          author: row.author || 'E-MEP Engineering Team',
          readTimeMin: Number(row.read_time_min) || 5,
          createdAt: row.created_at,
        };
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
        .in('cat_en', [slug, rawSlug])
        .limit(1);

      if (!pRes.error && pRes.data && pRes.data.length > 0) {
        const row = pRes.data[0];
        return {
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
      }
    } catch (err) {
      // continue
    }
  }

  // 3. Fallback to articlesData JSON
  return (
    articlesData.find(
      (a) =>
        a.slug === slug ||
        a.slug === rawSlug ||
        decodeURIComponent(a.slug) === slug
    ) || null
  );
}

async function getAllArticles() {
  if (isSupabaseConfigured() && supabase) {
    // 1. Try articles table
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((a: any) => ({
          id: Number(a.id),
          slug: a.slug,
          titleEn: a.title_en,
          titleAr: a.title_ar,
          summaryEn: a.summary_en,
          summaryAr: a.summary_ar,
          image: a.image,
          author: a.author || 'E-MEP Engineering Team',
          readTimeMin: Number(a.read_time_min) || 5,
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
          image: a.image,
          author: 'E-MEP Engineering Team',
          readTimeMin: Number(a.cat_ar) || 5,
        }));
      }
    } catch (err) {
      // continue
    }
  }
  return articlesData;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'المقال غير موجود | E-MEP' };

  return {
    title: `${article.titleAr} | مدونة E-MEP الهندسية`,
    description: article.summaryAr,
    openGraph: {
      title: article.titleAr,
      description: article.summaryAr,
      images: [{ url: article.image }],
    },
  };
}

export default async function ArticleReaderPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((a) => a.slug !== slug).slice(0, 2);

  return <ArticleClient article={article} relatedArticles={relatedArticles} />;
}
