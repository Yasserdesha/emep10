import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create standard client for public operations
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Create admin client for privileged backend API operations (if service key available)
const effectiveAdminKey = supabaseServiceKey || supabaseAnonKey;

export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && effectiveAdminKey
    ? createClient(supabaseUrl, effectiveAdminKey)
    : null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
