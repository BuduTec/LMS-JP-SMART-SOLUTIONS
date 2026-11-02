import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    redirect('/student/dashboard');
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-jpdark">Administration Hub</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-jpblue border border-blue-200">
              {profile.role.toUpperCase()}
            </span>
          </div>
          <div className="text-xs text-jpmuted font-medium">
            {profile.full_name || user.email}
          </div>
        </header>
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
