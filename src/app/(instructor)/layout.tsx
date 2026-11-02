import { InstructorSidebar } from '@/components/layout/InstructorSidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function InstructorLayout({
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

  if (
    !profile ||
    (profile.role !== 'instructor' && profile.role !== 'admin' && profile.role !== 'super_admin')
  ) {
    redirect('/student/dashboard');
  }

  return (
    <div className="min-h-screen flex bg-jplight/50">
      <InstructorSidebar />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <header className="h-16 bg-white border-b border-[#E1EBF5] px-8 flex items-center justify-between">
          <div className="text-sm font-bold text-jpdark">Instructor Console</div>
          <div className="text-xs text-jpmuted font-medium">
            {profile.full_name || user.email}
          </div>
        </header>
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
