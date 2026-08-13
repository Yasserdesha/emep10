-- =========================================================
-- E-MEP Supabase Database Initial Schema & Setup Migration
-- =========================================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  image TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  category TEXT NOT NULL,
  cat_en TEXT NOT NULL,
  cat_ar TEXT NOT NULL,
  desc_en TEXT NOT NULL,
  desc_ar TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Security Policies for Projects
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on projects') THEN
    CREATE POLICY "Allow public read access on projects" ON public.projects FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow full admin access on projects') THEN
    CREATE POLICY "Allow full admin access on projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 2. Create Articles Table for SEO Blog
CREATE TABLE IF NOT EXISTS public.articles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  summary_ar TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  image TEXT NOT NULL,
  author TEXT DEFAULT 'E-MEP Engineering Team',
  read_time_min INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for Articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Security Policies for Articles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on articles') THEN
    CREATE POLICY "Allow public read access on articles" ON public.articles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow full admin access on articles') THEN
    CREATE POLICY "Allow full admin access on articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 3. Create Storage Bucket for Project & Article Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for Projects Bucket') THEN
    CREATE POLICY "Public Access for Projects Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'projects');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Upload for Projects Bucket') THEN
    CREATE POLICY "Public Upload for Projects Bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'projects');
  END IF;
END $$;

-- 4. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
