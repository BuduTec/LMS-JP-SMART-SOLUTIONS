import { InstructorSidebar } from '@/components/layout/InstructorSidebar';
import { createClient, getSupabaseConfig } from '@/lib/supabase/server';
import { resolveUserRole } from '@/lib/admin-store';
import { redirect } from 'next/navigation';

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConfigured } = getSupabaseConfig();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isConfigured) {
    redirect('/login?redirect=/instructor/dashboard');
  }

  let displayName = 'Engr. Lead Instructor';

  if (isConfigured && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    const resolvedRole = profile?.role || resolveUserRole(user.email);
    if (
      resolvedRole !== 'instructor' &&
      resolvedRole !== 'admin' &&
      resolvedRole !== 'super_admin'
    ) {
      redirect('/student/dashboard');
    }
    displayName = profile?.full_name || user.email || displayName;
  } else if (user) {
    displayName = user.user_metadata?.full_name || user.email || displayName;
  }

  return (
    <div className="min-h-screen flex bg-jplight/50">
      <InstructorSidebar />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <header className="h-16 bg-white border-b border-[#E1EBF5] px-8 flex items-center justify-between">
          <div className="text-sm font-bold text-jpdark">Instructor Console</div>
          <div className="text-xs text-jpmuted font-medium">{displayName}</div>
        </header>
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
