import { supabase } from '../lib/supabase';

export interface Secret {
  id: string;
  key: string;
  value: string;
  description?: string;
  created_at: string;
}

export class SupabaseService {
  /**
   * Pings Supabase to check if the connection is active.
   * Useful for "Connection Status" indicators.
   */
  static async checkConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('secrets').select('id').limit(1);
      if (error && error.code !== 'PGRST116') { // Ignore "no rows found"
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Fetches a secret by its key.
   * Note: This only works if RLS allows the anon/authenticated user to read it.
   */
  static async getSecretValue(key: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('key', key)
        .single();
      
      if (error || !data) return null;
      return data.value;
    } catch (err) {
      return null;
    }
  }
}
