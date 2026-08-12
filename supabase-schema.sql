-- =========================================================
-- E-MEP Supabase Database Schema & Setup Script
-- Copy and paste this script into the Supabase SQL Editor
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 2. Create Security Policies
-- Allow public read access to everyone
CREATE POLICY "Allow public read access on projects"
  ON public.projects
  FOR SELECT
  USING (true);

-- Allow authenticated/service role full access to insert, update, delete
CREATE POLICY "Allow full admin access on projects"
  ON public.projects
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. Create Storage Bucket for Project Images (if using Supabase Storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Allow public read access to project images
CREATE POLICY "Public Access for Projects Bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'projects');

-- Storage Policy: Allow uploads for project images
CREATE POLICY "Public Upload for Projects Bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'projects');

-- Index for fast category & sorting queries
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
