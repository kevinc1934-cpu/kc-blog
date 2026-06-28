import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) return null;

  const key = serviceKey || anonKey;
  if (!key) return null;

  _client = createClient(url, key, {
    auth: { persistSession: false },
  });

  return _client;
}

export function isSupabaseConfigured(): boolean {
  return getSupabase() !== null;
}
