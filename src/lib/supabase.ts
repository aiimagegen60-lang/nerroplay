import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Defensive check to prevent crash if variables are missing
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// Create client only if configured, or use a dummy client that warns but doesn't crash
export const supabase: SupabaseClient = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { 
      auth: { 
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => {}
      },
      from: () => ({ select: () => ({ order: () => ({ limit: () => ({ data: null, error: new Error('Supabase not configured') }) }) }) })
    } as any;

export function getSupabase(): SupabaseClient {
  return supabase;
}
