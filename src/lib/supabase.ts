import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default fail-safe publishable credentials for permanent client & public database connection
const DEFAULT_SUPABASE_URL = 'https://dpptnkehkzolqrifbagx.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_pJMjANa_DTXVuyuus9wTwA_Ijgd4QmF';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Create standard client for public operations with persistent session & auto-retry configuration
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: { 'x-application-name': 'E-MEP-Platform' },
  },
});

// Create privileged admin client for server-side API operations
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const isSupabaseConfigured = (): boolean => {
  return true;
};

// Health Check Utility to verify active DB connection
export async function checkSupabaseHealth(): Promise<{ healthy: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const { error } = await supabase.from('projects').select('id').limit(1);
    const latencyMs = Date.now() - start;
    if (error) {
      return { healthy: false, latencyMs, error: error.message };
    }
    return { healthy: true, latencyMs };
  } catch (err: any) {
    return { healthy: false, latencyMs: Date.now() - start, error: err?.message || 'Connection failed' };
  }
}
