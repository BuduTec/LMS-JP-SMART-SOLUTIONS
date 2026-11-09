import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { createClient, getSupabaseConfig } from '@/lib/supabase/server';
import { resolveUserRole } from '@/lib/admin-store';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default async function AdminLayout({
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
    redirect('/login?redirect=/admin/dashboard');
  }

  let role = 'super_admin';
  let displayName = 'Engr. Emmanuel Elubuduka';

  if (isConfigured && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    const resolvedRole = profile?.role || resolveUserRole(user.email);
    if (resolvedRole !== 'admin' && resolvedRole !== 'super_admin') {
      redirect('/student/dashboard');
    }
    role = resolvedRole;
    displayName = profile?.full_name || user.email || displayName;
  } else if (user) {
    displayName = user.user_metadata?.full_name || user.email || displayName;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-jpdark">Administration Hub</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-jpblue border border-blue-200">
              {role.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/student/dashboard"
              className="text-xs font-semibold text-jpblue hover:underline flex items-center gap-1"
            >
              <span>Student View</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <div className="text-xs text-jpmuted font-medium">{displayName}</div>
          </div>
        </header>
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
