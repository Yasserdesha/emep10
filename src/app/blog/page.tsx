import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import articlesData from '@/data/articles.json';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'مدونة الهندسة الكهروميكانيكية وBIM | مقالات E-MEP المتخصصة',
  description: 'مقالات وأدلة هندسية شاملة حول الكود المصري للحماية المدنية، واشتراطات حريق المطاعم والمحلات، ونمذجة معلومات البناء BIM Revit.',
};

export const revalidate = 60; // ISR 60s

async function getArticles() {
  if (isSupabaseConfigured() && supabase) {
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
          author: a.author,
          readTimeMin: a.read_time_min,
          createdAt: a.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase articles fetch error, using local fallback:', err);
    }
  }
  return articlesData;
}

export default async function BlogIndexPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        {/* Header Hero Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF1E27]/15 border border-[#FF1E27]/30 rounded-full text-[#FF1E27] text-xs font-semibold">
            <i className="fa-solid fa-book-bookmark"></i>
            <span>مدونة E-MEP الكهروميكانيكية</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            مقالات ودراسات هندسية متخصصة في الكهروميكانيك وBIM
          </h1>
          <p className="text-sm md:text-base text-gray-400">
            اكتشف أحدث المعايير الفنية والكود المصري للحريق واشتراطات الحماية المدنية والتنفيذ الذكي عبر نمذجة معلومات البناء.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((art) => (
            <article key={art.id} className="bg-[#131317] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-white/20 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden bg-white/5">
                  <Image
                    src={art.image}
                    alt={art.titleAr}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-user-gear text-[#FF1E27]"></i>
                      {art.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-clock"></i>
                      {art.readTimeMin} دقائق قراءة
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white hover:text-[#FF1E27] transition leading-snug">
                    <Link href={`/blog/${art.slug}`}>{art.titleAr}</Link>
                  </h2>
                  <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                    {art.summaryAr}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/blog/${art.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#FF1E27] hover:text-[#FF3B44] transition"
                >
                  <span>قراءة المقال بالكامل</span>
                  <i className="fa-solid fa-arrow-left"></i>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
