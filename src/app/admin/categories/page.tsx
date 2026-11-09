import React from 'react';
import { createClient, getSupabaseConfig } from '@/lib/supabase/server';
import { getStoreCategories, getStoreCourses } from '@/lib/admin-store';
import { createCategory } from '@/actions/admin';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FolderTree, Plus } from 'lucide-react';

export default async function AdminCategoriesPage() {
  const { isConfigured } = getSupabaseConfig();
  let categories = getStoreCategories();
  const courses = getStoreCourses();

  if (isConfigured) {
    const supabase = await createClient();
    const { data: dbCategories } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (dbCategories && dbCategories.length > 0) {
      categories = dbCategories;
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">
          Course Categories & Domains
        </h1>
        <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
          Organize engineering masterclasses into specialized technical disciplines.
        </p>
      </div>

      {/* Add Category Card */}
      <Card className="border border-slate-200 bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-jpdark flex items-center gap-2">
            <Plus className="h-4 w-4 text-jpblue" />
            <span>Create New Engineering Category</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g. Substation Automation"
                className="h-10 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="IEC 61850 & SCADA engineering courses"
                className="h-10 text-xs"
              />
            </div>

            <Button type="submit" className="btn-primary text-xs py-2 px-5 font-bold h-10">
              Add Category
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <div className="card-jp overflow-hidden border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-5">Category Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right pr-5">Courses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => {
              const count = courses.filter(
                (c) => c.category_id === cat.id || c.category?.slug === cat.slug
              ).length;
              return (
                <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 pl-5 font-bold text-jpdark flex items-center gap-2">
                    <FolderTree className="h-4 w-4 text-jpblue" />
                    <span>{cat.name}</span>
                  </td>
                  <td className="p-4 font-mono text-jpmuted">/{cat.slug}</td>
                  <td className="p-4 text-jpmuted max-w-md">{cat.description || '—'}</td>
                  <td className="p-4 text-right pr-5 font-bold text-jpdark">
                    {count} {count === 1 ? 'course' : 'courses'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
