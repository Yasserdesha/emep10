import fs from 'fs/promises';
import path from 'path';
import ClientPage from './ClientPage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Enable Next.js Incremental Static Regeneration (ISR) with 60s cache revalidation
export const revalidate = 60;

async function getInitialData() {
  const jsonPath = path.join(process.cwd(), 'src/data/projects.json');
  let localData = { projects: [], brandLogos: [] };
  try {
    const fileContent = await fs.readFile(jsonPath, 'utf8');
    localData = JSON.parse(fileContent);
  } catch (err) {
    console.error('Failed to read local projects.json:', err);
  }

  // Try Supabase first if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: dbProjects, error } = await supabase
        .from('projects')
        .select('*')
        .range(0, 1000)
        .order('id', { ascending: true });

      if (!error && dbProjects && dbProjects.length > 0) {
        const localProjects = (localData.projects || []) as any[];
        const formattedProjects = dbProjects.map((row: any) => {
          const localMatch = localProjects.find((p: any) => p.id === Number(row.id));
          const safeImage = (row.image && !row.image.includes('supabase.co'))
            ? row.image
            : (localMatch?.image || `/assets/projects/portfolio-2_page-00${String(Math.min(37, Math.max(4, Number(row.id) + 3))).padStart(2, '0')}.jpg`);

          return {
            id: Number(row.id),
            image: safeImage,
            titleEn: row.title_en || localMatch?.titleEn || '',
            titleAr: row.title_ar || localMatch?.titleAr || '',
            category: row.category || localMatch?.category || 'retail',
            catEn: row.cat_en || localMatch?.catEn || '',
            catAr: row.cat_ar || localMatch?.catAr || '',
            descEn: row.desc_en || localMatch?.descEn || '',
            descAr: row.desc_ar || localMatch?.descAr || '',
          };
        });

        return {
          projects: formattedProjects,
          brandLogos: localData.brandLogos,
        };
      }
    } catch (dbErr) {
      console.warn('Supabase fetch failed on page render, falling back to JSON:', dbErr);
    }
  }

  return localData;
}

export default async function Page() {
  const data = await getInitialData();

  return (
    <ClientPage 
      initialProjects={data.projects} 
      brandLogos={data.brandLogos} 
    />
  );
}
