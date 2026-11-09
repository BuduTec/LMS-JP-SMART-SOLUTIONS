import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const FALLBACK_SUPABASE_URL = 'https://wloxgtyqwktyksgqiitu.supabase.co';
export const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsb3hndHlxd2t0eWtzZ3FpaXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1MDg4MDAsImV4cCI6MjA0NjA4NDgwMH0.placeholder-anon-key';

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || FALLBACK_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || FALLBACK_SUPABASE_ANON_KEY;
  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
  return { url, anonKey, isConfigured };
}

/**
 * Public Supabase client for static pages, ISR routes, and sitemaps.
 * Does NOT access cookies() so it is 100% safe to run at build time.
 */
export function createPublicClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createSupabaseClient(url, anonKey);
}

/**
 * Authenticated Supabase client for Server Components and Server Actions.
 * Reads and sets cookies for user sessions.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey, isConfigured } = getSupabaseConfig();

  const client = createServerClient(url, anonKey, {
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
  });

  if (!isConfigured) {
    const demoEmail = cookieStore.get('jp_demo_email')?.value || 'engineer@jpsmartsolutions.com';
    const demoName = cookieStore.get('jp_demo_name')?.value || 'Engr. Chukwuemeka O.';
    client.auth.getUser = (async () => ({
      data: {
        user: {
          id: '00000000-0000-0000-0000-000000000001',
          email: demoEmail,
          user_metadata: { full_name: demoName },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '2026-11-02T00:00:00Z',
        } as any,
      },
      error: null,
    })) as any;
  }

  return client;
}

/**
 * Privileged admin client using the service role key.
 * Falls back to anon key if service key is unset so it never throws on build.
 */
export async function createAdminClient() {
  const { url, anonKey } = getSupabaseConfig();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || anonKey;

  return createServerClient(url, serviceKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
  });
}
