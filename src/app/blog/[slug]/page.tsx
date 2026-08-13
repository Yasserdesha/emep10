import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import articlesData from '@/data/articles.json';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR 60s

async function getArticleBySlug(slug: string) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return {
          id: Number(data.id),
          slug: data.slug,
          titleEn: data.title_en,
          titleAr: data.title_ar,
          summaryEn: data.summary_en,
          summaryAr: data.summary_ar,
          contentEn: data.content_en,
          contentAr: data.content_ar,
          image: data.image,
          author: data.author,
          readTimeMin: data.read_time_min,
          createdAt: data.created_at,
        };
      }
    } catch (err) {
      console.warn('Supabase article fetch failed, searching local fallback:', err);
    }
  }

  return articlesData.find((a) => a.slug === slug) || null;
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

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        {/* Navigation Breadcrumb */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition mb-4"
        >
          <i className="fa-solid fa-arrow-right"></i>
          <span>العودة لمدونة E-MEP الهندسية</span>
        </Link>

        {/* Title Header */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
            {article.titleAr}
          </h1>
          <div className="flex items-center gap-4 text-xs text-gray-400 border-b border-white/10 pb-4">
            <span className="flex items-center gap-1.5 text-gray-300">
              <i className="fa-solid fa-user-gear text-[#FF1E27]"></i>
              {article.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-clock"></i>
              {article.readTimeMin} دقائق قراءة
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <Image
            src={article.image}
            alt={article.titleAr}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 md:p-10 space-y-6 shadow-xl leading-relaxed text-gray-200 text-sm md:text-base">
          <p className="font-semibold text-lg text-white border-r-4 border-[#FF1E27] pr-4 py-1 bg-white/5 rounded-l-lg">
            {article.summaryAr}
          </p>

          <div className="space-y-4 text-gray-300">
            <p>{article.contentAr}</p>
            
            <hr className="border-white/10 my-6" />

            <h3 className="text-base font-bold text-white mb-2">English Summary:</h3>
            <p className="text-xs text-gray-400 ltr text-left">{article.contentEn}</p>
          </div>
        </div>

        {/* CTA Footer Card */}
        <div className="bg-gradient-to-r from-[#131317] to-[#1A1A24] border border-[#FF1E27]/30 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <h3 className="text-xl font-bold text-white">هل لديك مشروع تجاري أو كهروميكانيكي تحضر لتنفيذه؟</h3>
          <p className="text-xs text-gray-400 max-w-xl mx-auto">
            فريق E-MEP الهندسي على أتم الاستعداد لتقديم المخططات التنفيذية، دراسات الأحمال، وحسابات الحماية المدنية وBIM مجاناً.
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
