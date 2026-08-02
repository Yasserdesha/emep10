import fs from 'fs/promises';
import path from 'path';
import ClientPage from './ClientPage';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const jsonPath = path.join(process.cwd(), 'src/data/projects.json');
  const fileContent = await fs.readFile(jsonPath, 'utf8');
  const data = JSON.parse(fileContent);

  return (
    <ClientPage 
      initialProjects={data.projects} 
      brandLogos={data.brandLogos} 
    />
  );
}
