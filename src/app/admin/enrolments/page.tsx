import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { createManualEnrolment } from '@/actions/admin';
import { UserCheck, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function AdminEnrolmentsPage() {
  const supabase = await createClient();

  // Fetch enrolments
  const { data: enrolments } = await supabase
    .from('enrolments')
    .select(`
      *,
      student:profiles(id, full_name, email),
      course:courses(id, title)
    `)
    .order('enrolled_at', { ascending: false });

  // Fetch students and courses for manual enrolment
  const { data: students } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'student');

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title');

  async function handleManualSubmit(formData: FormData) {
    'use server';
    const studentId = formData.get('studentId') as string;
    const courseId = formData.get('courseId') as string;
    const notes = formData.get('notes') as string;
    if (studentId && courseId) {
      await createManualEnrolment(studentId, courseId, notes);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Enrolment Management</h1>
        <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
          View active course seat licences and manually assign students to technical masterclasses.
        </p>
      </div>

      {/* Manual Enrolment Box */}
      <Card className="border border-slate-200 bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-jpdark flex items-center gap-2">
            <Plus className="h-4 w-4 text-jpblue" />
            <span>Grant Manual Enrolment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleManualSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="space-y-1 sm:col-span-1">
              <Label htmlFor="studentId">Select Student</Label>
              <select
                id="studentId"
                name="studentId"
                required
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="">Select Student</option>
                {(students || []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name || s.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:col-span-1">
              <Label htmlFor="courseId">Select Course</Label>
              <select
                id="courseId"
                name="courseId"
                required
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="">Select Course</option>
                {(courses || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:col-span-1">
              <Label htmlFor="notes">Admin Notes</Label>
              <Input
                id="notes"
                name="notes"
                placeholder="e.g. Bank transfer verified"
                className="h-10 text-xs"
              />
            </div>

            <Button type="submit" className="btn-primary text-xs py-2 px-5 font-bold h-10">
              Grant Enrolment
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Enrolments Table */}
      <div className="card-jp overflow-hidden border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-5">Student</th>
              <th className="p-4">Enrolled Course</th>
              <th className="p-4">Enrolled Date</th>
              <th className="p-4">Notes</th>
              <th className="p-4 text-right pr-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(enrolments || []).map((e: any) => (
              <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4 pl-5">
                  <div className="font-bold text-jpdark">{e.student?.full_name || 'Student'}</div>
                  <div className="text-[11px] text-jpmuted">{e.student?.email}</div>
                </td>
                <td className="p-4 font-semibold text-jpdark">{e.course?.title}</td>
                <td className="p-4 text-jpmuted">{formatDate(e.enrolled_at)}</td>
                <td className="p-4 text-jpmuted italic">{e.notes || 'Online checkout'}</td>
                <td className="p-4 text-right pr-5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                    Active
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
