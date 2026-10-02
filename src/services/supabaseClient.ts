import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Local storage keys for user-configured credentials if .env is not present
const SUPABASE_URL_KEY = 'tracer76_supabase_url';
const SUPABASE_ANON_KEY = 'tracer76_supabase_anon_key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  // Check environment variables first
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    return {
      url: envUrl,
      anonKey: envKey,
      isConfigured: true
    };
  }

  // Check localStorage
  const savedUrl = localStorage.getItem(SUPABASE_URL_KEY) || '';
  const savedKey = localStorage.getItem(SUPABASE_ANON_KEY) || '';

  return {
    url: savedUrl,
    anonKey: savedKey,
    isConfigured: !!(savedUrl && savedKey)
  };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  localStorage.setItem(SUPABASE_URL_KEY, url.trim());
  localStorage.setItem(SUPABASE_ANON_KEY, anonKey.trim());
  // Reset client instance
  clientInstance = null;
}

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (clientInstance) return clientInstance;

  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;

  try {
    clientInstance = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
    return clientInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Tests connection to Supabase database
 */
export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string; latencyMs: number }> {
  const targetUrl = url || getSupabaseConfig().url;
  const targetKey = anonKey || getSupabaseConfig().anonKey;

  if (!targetUrl || !targetKey) {
    return { success: false, message: 'URL and Anon Key are required.', latencyMs: 0 };
  }

  const start = performance.now();
  try {
    const testClient = createClient(targetUrl, targetKey);
    // Ping public table or auth
    const { error } = await testClient.from('reports').select('id').limit(1);
    const latencyMs = Math.round(performance.now() - start);

    if (error && error.code !== 'PGRST116' && !error.message.includes('relation "reports" does not exist')) {
      // If error is table not created yet, connection is still valid!
      if (error.message.includes('does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase! (Database tables need to be created via SQL Editor).',
          latencyMs
        };
      }
      return { success: false, message: error.message, latencyMs };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase PostgreSQL database!',
      latencyMs
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Connection failed. Please verify Project URL and Anon Key.',
      latencyMs: Math.round(performance.now() - start)
    };
  }
}
