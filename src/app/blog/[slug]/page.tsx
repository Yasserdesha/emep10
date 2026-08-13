import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import SafeImage from '@/components/SafeImage';
import articlesData from '@/data/articles.json';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';


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

  const shareText = encodeURIComponent(`${article.titleAr} - مدونة E-MEP الهندسية`);
  const articleUrl = encodeURIComponent(`https://emep.vercel.app/blog/${article.slug}`);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#FF1E27] transition"
          >
            <i className="fa-solid fa-arrow-right"></i>
            <span>العودة لمدونة E-MEP الهندسية</span>
          </Link>

          <span className="text-xs text-gray-500 font-mono">ID: #{article.id}</span>
        </div>

        {/* Title & Metadata Header */}
        <div className="space-y-4 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF1E27]/15 border border-[#FF1E27]/30 rounded-full text-[#FF1E27] text-xs font-bold">
            <i className="fa-solid fa-fire"></i>
            <span>مقال هندسي متخصص</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
            {article.titleAr}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400 pt-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <i className="fa-solid fa-user-gear text-[#FF1E27]"></i>
                {article.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-clock"></i>
                {article.readTimeMin} دقائق قراءة
              </span>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-500 font-semibold">مشاركة المقال:</span>
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}%20${articleUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition"
                title="مشاركة عبر واتساب"
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition"
                title="مشاركة عبر لينكد إن"
              >
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-500 flex items-center justify-center hover:bg-blue-600/20 transition"
                title="مشاركة عبر فيسبوك"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/5">
          <SafeImage
            src={article.image}
            alt={article.titleAr}
            className="w-full h-full object-cover"
          />
        </div>


        {/* Article Body Content */}
        <div className="bg-[#131317] border border-white/10 rounded-3xl p-6 md:p-12 space-y-8 shadow-2xl leading-relaxed text-gray-200 text-sm md:text-base">
          {/* Highlight Summary Box */}
          <div className="p-5 bg-gradient-to-r from-[#FF1E27]/10 to-transparent border-r-4 border-[#FF1E27] rounded-l-2xl text-white font-medium leading-relaxed">
            <p>{article.summaryAr}</p>
          </div>

          <div className="space-y-6 text-gray-300">
            {/* Render content as paragraphs split by newlines */}
            <div className="space-y-4 leading-loose text-justify">
              {article.contentAr.split('\n').map((para: string, idx: number) =>
                para.trim() ? (
                  <p key={idx} className="leading-loose">
                    {para}
                  </p>
                ) : (
                  <div key={idx} className="h-2" />
                )
              )}
            </div>

            <hr className="border-white/10 my-8" />

            {article.contentEn && article.contentEn !== article.contentAr && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-globe text-[#FF1E27]"></i>
                  <span>English Summary</span>
                </h3>
                <div className="text-xs text-gray-400 ltr text-left leading-relaxed space-y-2">
                  {article.contentEn.split('\n').map((para: string, idx: number) =>
                    para.trim() ? <p key={idx}>{para}</p> : <div key={idx} className="h-1" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-white/10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-bookmark text-[#FF1E27]"></i>
              <span>مقالات ذات صلة قد تهمك</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <div key={rel.id} className="bg-[#131317] border border-white/10 rounded-2xl p-4 flex gap-4 items-center hover:border-white/20 transition">
                  <div className="relative w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                    <Image src={rel.image} alt={rel.titleAr} fill className="object-cover" />
                  </div>
                  <div className="space-y-1.5 overflow-hidden">
                    <h3 className="text-xs font-bold text-white hover:text-[#FF1E27] transition truncate">
                      <Link href={`/blog/${rel.slug}`}>{rel.titleAr}</Link>
                    </h3>
                    <p className="text-[11px] text-gray-400 line-clamp-2">{rel.summaryAr}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Consultation CTA Footer */}
        <div className="bg-gradient-to-r from-[#131317] via-[#1A1A24] to-[#131317] border border-[#FF1E27]/30 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <h3 className="text-xl font-bold text-white">هل لديك مشروع تجاري أو كهروميكانيكي تحضر لتنفيذه؟</h3>
          <p className="text-xs text-gray-400 max-w-xl mx-auto">
            فريق E-MEP الهندسي على أتم الاستعداد لتقديم المخططات التنفيذية، دراسات الأحمال، وحسابات الحماية المدنية وBIM.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF1E27] hover:bg-[#D31019] text-white font-bold text-xs rounded-xl shadow-lg transition"
          >
            <i className="fa-solid fa-paper-plane"></i>
            <span>تواصل مع الفريق الهندسي الآن</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
