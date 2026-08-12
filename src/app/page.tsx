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
        .order('id', { ascending: true });

      if (!error && dbProjects && dbProjects.length > 0) {
        const formattedProjects = dbProjects.map((row: any) => ({
          id: Number(row.id),
          image: row.image,
          titleEn: row.title_en,
          titleAr: row.title_ar,
          category: row.category,
          catEn: row.cat_en,
          catAr: row.cat_ar,
          descEn: row.desc_en,
          descAr: row.desc_ar,
        }));

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
