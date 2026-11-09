import { createBrowserClient } from '@supabase/ssr';

const FALLBACK_SUPABASE_URL = 'https://wloxgtyqwktyksgqiitu.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsb3hndHlxd2t0eWtzZ3FpaXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1MDg4MDAsImV4cCI6MjA0NjA4NDgwMH0.placeholder-anon-key';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || FALLBACK_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || FALLBACK_SUPABASE_ANON_KEY;

  return createBrowserClient(url, anonKey);
}
