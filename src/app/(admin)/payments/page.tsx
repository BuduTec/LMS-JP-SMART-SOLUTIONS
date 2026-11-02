import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CreditCard, ExternalLink } from 'lucide-react';

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  const { data: payments } = await supabase
    .from('payments')
    .select(`
      *,
      student:profiles(full_name, email),
      course:courses(title)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Payments & Transactions</h1>
        <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
          Audited log of Paystack checkouts, amounts received, and transaction verification statuses.
        </p>
      </div>

      <div className="card-jp overflow-hidden border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-5">Reference</th>
              <th className="p-4">Student</th>
              <th className="p-4">Course</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right pr-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(payments || []).map((p: any) => (
              <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4 pl-5 font-mono text-jpblue font-semibold">
                  {p.payment_reference}
                </td>
                <td className="p-4">
                  <div className="font-bold text-jpdark">{p.student?.full_name || 'Student'}</div>
                  <div className="text-[11px] text-jpmuted">{p.student?.email}</div>
                </td>
                <td className="p-4 text-jpdark font-medium max-w-xs truncate">
                  {p.course?.title || 'Unknown Course'}
                </td>
                <td className="p-4 font-extrabold text-jpdark">
                  {formatCurrency(p.amount, p.currency)}
                </td>
                <td className="p-4 text-jpmuted">{formatDate(p.created_at)}</td>
                <td className="p-4 text-right pr-5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.status === 'successful'
                        ? 'bg-emerald-50 text-emerald-700'
                        : p.status === 'pending'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
