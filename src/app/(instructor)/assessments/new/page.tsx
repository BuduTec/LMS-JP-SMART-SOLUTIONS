import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createAssessment } from '@/actions/instructor';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';

export default async function NewAssessmentPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase.from('courses').select('id, title');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/instructor/assessments" className="text-xs font-bold text-jpblue flex items-center gap-1 hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Assessments</span>
      </Link>

      <Card className="border border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-extrabold text-jpdark">Create Technical Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAssessment as any} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="courseId">Associated Course</Label>
              <select
                id="courseId"
                name="courseId"
                required
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="">Select Course</option>
                {(courses || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title">Assessment Title</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="e.g. ETAP SLD & Load Flow Verification Quiz"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Instructions & Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Read all calculation questions carefully before submitting..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="passMark">Pass Mark (%)</Label>
                <Input
                  id="passMark"
                  name="passMark"
                  type="number"
                  defaultValue="70"
                  min="50"
                  max="100"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="timeLimit">Time Limit (mins)</Label>
                <Input
                  id="timeLimit"
                  name="timeLimit"
                  type="number"
                  placeholder="e.g. 30 (or blank)"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="maxAttempts">Max Attempts</Label>
                <Input
                  id="maxAttempts"
                  name="maxAttempts"
                  type="number"
                  defaultValue="3"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="btn-primary text-xs py-2.5 px-6 font-bold flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Save Assessment</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
