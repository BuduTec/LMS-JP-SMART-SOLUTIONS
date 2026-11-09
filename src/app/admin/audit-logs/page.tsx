import React from 'react';
import { createClient, getSupabaseConfig } from '@/lib/supabase/server';
import { getStoreAuditLogs } from '@/lib/admin-store';

export default async function AdminAuditLogsPage() {
  const { isConfigured } = getSupabaseConfig();
  let logs: any[] = getStoreAuditLogs();

  if (isConfigured) {
    const supabase = await createClient();
    const { data: dbLogs } = await supabase
      .from('audit_logs')
      .select(`
        *,
        user:profiles(full_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (dbLogs && dbLogs.length > 0) {
      logs = dbLogs;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Security & Audit Logs</h1>
        <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
          Immutable event stream of administrative actions, course modifications, and enrolment grants.
        </p>
      </div>

      <div className="card-jp overflow-hidden border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-5">Timestamp</th>
              <th className="p-4">Action</th>
              <th className="p-4">Admin User</th>
              <th className="p-4">Resource</th>
              <th className="p-4 pr-5">Event Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(logs || []).map((log: any) => (
              <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4 pl-5 text-jpmuted whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="p-4">
                  <span className="font-mono text-jpblue font-bold px-2 py-0.5 rounded bg-blue-50 border border-blue-100">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 font-semibold text-jpdark">
                  {log.user?.full_name || log.user?.email || 'System'}
                </td>
                <td className="p-4 text-jpmuted">
                  {log.resource_type ? `${log.resource_type}:${log.resource_id?.substring(0, 6) || ''}` : '—'}
                </td>
                <td className="p-4 pr-5 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                  {log.details ? JSON.stringify(log.details) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
