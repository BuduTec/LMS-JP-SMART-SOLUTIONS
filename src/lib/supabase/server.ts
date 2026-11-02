import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Public Supabase client for static pages, ISR routes, and sitemaps.
 * Does NOT access cookies() so it is 100% safe to run at build time.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wloxgtyqwktyksgqiitu.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return createSupabaseClient(url, anonKey);
}

/**
 * Authenticated Supabase client for Server Components and Server Actions.
 * Reads and sets cookies for user sessions.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wloxgtyqwktyksgqiitu.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignored when called from Server Component
          }
        },
      },
    }
  );
}

/**
 * Privileged admin client using the service role key.
 * Falls back to anon key if service key is unset so it never throws on build.
 */
export async function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wloxgtyqwktyksgqiitu.supabase.co';
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return createServerClient(
    url,
    serviceKey,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}
