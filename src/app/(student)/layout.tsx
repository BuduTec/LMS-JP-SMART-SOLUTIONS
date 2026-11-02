import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function StudentLayout({
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

  // Fetch platform settings to check if certificates are enabled
  const { data: settings } = await supabase
    .from('platform_settings')
    .select('certificates_enabled')
    .single();

  return (
    <div className="min-h-screen flex bg-jplight/50">
      <StudentSidebar certificatesEnabled={settings?.certificates_enabled ?? false} />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <header className="h-16 bg-white border-b border-[#E1EBF5] px-8 flex items-center justify-between">
          <div className="text-sm font-semibold text-jpdark">Student Portal</div>
          <div className="text-xs text-jpmuted">{user.email}</div>
        </header>
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
