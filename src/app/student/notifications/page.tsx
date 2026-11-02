import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Bell, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { markNotificationRead } from '@/actions/student';
import Link from 'next/link';
import { Notification } from '@/types';

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: notificationsData } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const notifications: Notification[] = (notificationsData as unknown as Notification[]) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Notification Centre</h1>
        <p className="text-xs sm:text-sm text-jpmuted mt-1">
          Stay updated on your course progress, assessment releases, and academy announcements.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((n) => {
            const markReadAction = markNotificationRead.bind(null, n.id);

            return (
              <div
                key={n.id}
                className={`card-jp p-5 border transition-colors flex items-start justify-between gap-4 ${
                  n.is_read
                    ? 'border-[#E1EBF5] bg-white'
                    : 'border-blue-200 bg-blue-50/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      n.is_read
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-jpblue-50 text-jpblue font-bold'
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-jpdark">{n.title}</h3>
                    <p className="text-xs text-jpmuted mt-1 leading-relaxed">{n.body}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {n.link && (
                    <Link
                      href={n.link}
                      className="text-xs font-bold text-jpblue hover:underline flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  {!n.is_read && (
                    <form action={markReadAction}>
                      <button
                        type="submit"
                        className="text-[11px] font-semibold text-slate-500 hover:text-jpblue p-1 rounded-md"
                      >
                        Mark as read
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="card-jp p-12 text-center space-y-3 border border-dashed border-[#D5E1ED]">
            <Bell className="h-8 w-8 text-jpmuted mx-auto" />
            <h3 className="text-sm font-bold text-jpdark">No notifications yet</h3>
            <p className="text-xs text-jpmuted max-w-sm mx-auto">
              You are all caught up! Updates regarding your courses and assessments will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
