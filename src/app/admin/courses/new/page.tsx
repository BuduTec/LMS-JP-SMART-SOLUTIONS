import React from 'react';
import Link from 'next/link';
import { createClient, getSupabaseConfig } from '@/lib/supabase/server';
import { getStoreCategories } from '@/lib/admin-store';
import { createCourse } from '@/actions/admin';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';

export default async function NewCoursePage() {
  const { isConfigured } = getSupabaseConfig();
  let categories = getStoreCategories();

  if (isConfigured) {
    const supabase = await createClient();
    const { data: dbCategories } = await supabase.from('categories').select('*').order('sort_order');
    if (dbCategories && dbCategories.length > 0) {
      categories = dbCategories;
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-xs">
        <Link href="/admin/courses" className="text-jpblue font-bold flex items-center gap-1 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Courses</span>
        </Link>
      </div>

      <Card className="border border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-extrabold text-jpdark">Create New Engineering Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCourse as any} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="e.g. Advanced ETAP Arc Flash & Short Circuit Studies"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shortDescription">Short Description (for cards and previews)</Label>
              <Input
                id="shortDescription"
                name="shortDescription"
                placeholder="Hands-on training covering ETAP calculation methodologies..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Detailed curriculum overview, industrial applications, learning outcomes..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="categoryId">Category</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="">Select Category</option>
                  {(categories || []).map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="price">Tuition Fee (NGN)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="1000"
                  placeholder="e.g. 75000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                <select
                  id="difficultyLevel"
                  name="difficultyLevel"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mode">Delivery Mode</Label>
                <Input id="mode" name="mode" defaultValue="Online" />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="btn-primary text-xs py-2.5 px-6 font-bold flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Save Course as Draft</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
