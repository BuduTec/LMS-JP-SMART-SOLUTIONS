import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type EmailOtpType } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/student/dashboard';

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');

  if (token_hash && type) {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || 'https://wloxgtyqwktyksgqiitu.supabase.co';
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsb3hndHlxd2t0eWtzZ3FpaXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1MDg4MDAsImV4cCI6MjA0NjA4NDgwMH0.placeholder-anon-key';
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
        },
      },
    });

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      redirectTo.searchParams.delete('next');
      return NextResponse.redirect(redirectTo);
    }
  }

  // Return the user to an error page with instructions
  redirectTo.pathname = '/login?error=email-confirmation-failed';
  return NextResponse.redirect(redirectTo);
}
