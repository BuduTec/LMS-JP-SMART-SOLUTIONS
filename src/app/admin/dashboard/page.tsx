import React from 'react';
import Link from 'next/link';
import { createClient, getSupabaseConfig } from '@/lib/supabase/server';
import { getAdminDashboardMetrics } from '@/lib/admin-store';
import {
  Users,
  BookOpen,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function AdminDashboardOverviewPage() {
  const { isConfigured } = getSupabaseConfig();
  const fallback = getAdminDashboardMetrics();

  let totalStudents = fallback.totalStudents;
  let activeStudents = fallback.activeStudents;
  let totalCourses = fallback.totalCourses;
  let publishedCourses = fallback.publishedCourses;
  let totalEnrolments = fallback.totalEnrolments;
  let totalRevenue = fallback.totalRevenue;
  let recentPayments: any[] = fallback.recentPayments;
  let recentStudents: any[] = fallback.recentStudents;

  if (isConfigured) {
    const supabase = await createClient();

    const { count: dbTotalStudents } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'student');

    const { count: dbActiveStudents } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'student')
      .eq('is_active', true);

    const { count: dbTotalCourses } = await supabase
      .from('courses')
      .select('id', { count: 'exact', head: true });

    const { count: dbPublishedCourses } = await supabase
      .from('courses')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published');

    const { count: dbTotalEnrolments } = await supabase
      .from('enrolments')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    const { data: payments } = await supabase
      .from('payments')
      .select('amount, status')
      .eq('status', 'successful');

    const { data: dbRecentPayments } = await supabase
      .from('payments')
      .select(`
        id,
        payment_reference,
        amount,
        currency,
        status,
        created_at,
        student:profiles(full_name, email),
        course:courses(title)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: dbRecentStudents } = await supabase
      .from('profiles')
      .select('id, full_name, email, created_at, is_active')
      .eq('role', 'student')
      .order('created_at', { ascending: false })
      .limit(5);

    if ((dbTotalCourses ?? 0) > 0) {
      totalStudents = dbTotalStudents || 0;
      activeStudents = dbActiveStudents || 0;
      totalCourses = dbTotalCourses || 0;
      publishedCourses = dbPublishedCourses || 0;
      totalEnrolments = dbTotalEnrolments || 0;
      totalRevenue = (payments || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);
      recentPayments = dbRecentPayments || [];
      recentStudents = dbRecentStudents || [];
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Executive Dashboard</h1>
          <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
            Real-time academy performance, enrolment activity, and verified financial revenue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/courses/new" className="btn-primary text-xs py-2 px-5 font-bold">
            + New Course
          </Link>
          <Link href="/admin/enrolments" className="btn-outline text-xs py-2 px-5 font-semibold">
            Manual Enrolment
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-jpmuted">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-jpblue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-jpdark">
              {totalStudents || 0}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              {activeStudents || 0} currently active
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-jpmuted">
              Course Catalog
            </CardTitle>
            <BookOpen className="h-4 w-4 text-jpblue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-jpdark">
              {totalCourses || 0}
            </div>
            <p className="text-[11px] text-jpmuted mt-1">
              {publishedCourses || 0} published & live
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-jpmuted">
              Active Enrolments
            </CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-jpdark">
              {totalEnrolments || 0}
            </div>
            <p className="text-[11px] text-jpmuted mt-1">Enrolled seat licenses</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-jpmuted">
              Verified Revenue
            </CardTitle>
            <CreditCard className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-jpdark truncate">
              {formatCurrency(totalRevenue, 'NGN')}
            </div>
            <p className="text-[11px] text-jpmuted mt-1">Paystack confirmed</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Payments & Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-jpdark">Recent Payments</h2>
            <Link href="/admin/payments" className="text-xs font-bold text-jpblue hover:underline">
              View all payments
            </Link>
          </div>

          <div className="card-jp overflow-hidden border border-slate-200 bg-white">
            {recentPayments && recentPayments.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 pl-4">Student</th>
                    <th className="p-3.5">Course</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentPayments.map((p: any) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 pl-4 font-semibold text-jpdark truncate max-w-[130px]">
                        {p.student?.full_name || p.student?.email || 'Student'}
                      </td>
                      <td className="p-3.5 text-jpmuted truncate max-w-[130px]">
                        {p.course?.title || 'Course'}
                      </td>
                      <td className="p-3.5 font-bold text-jpdark">
                        {formatCurrency(p.amount, p.currency)}
                      </td>
                      <td className="p-3.5 pr-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.status === 'successful'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-xs text-jpmuted">
                No payment transactions recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-jpdark">New Registrations</h2>
            <Link href="/admin/students" className="text-xs font-bold text-jpblue hover:underline">
              View all students
            </Link>
          </div>

          <div className="card-jp overflow-hidden border border-slate-200 bg-white">
            {recentStudents && recentStudents.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 pl-4">Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Joined</th>
                    <th className="p-3.5 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentStudents.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 pl-4 font-semibold text-jpdark truncate max-w-[120px]">
                        {s.full_name || 'Anonymous'}
                      </td>
                      <td className="p-3.5 text-jpmuted truncate max-w-[140px]">{s.email}</td>
                      <td className="p-3.5 text-jpmuted">{formatDate(s.created_at)}</td>
                      <td className="p-3.5 pr-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.is_active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {s.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-xs text-jpmuted">
                No registered students found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
