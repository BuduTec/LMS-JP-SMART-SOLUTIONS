import React from 'react';
import { createClient, getSupabaseConfig } from '@/lib/supabase/server';
import { getStorePlatformSettings } from '@/lib/admin-store';
import { updatePlatformSettings } from '@/actions/admin';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, HelpCircle, FileCheck, MessageSquare, Video, Tag } from 'lucide-react';

export default async function AdminFeatureFlagsPage() {
  const { isConfigured } = getSupabaseConfig();
  let settings: any = getStorePlatformSettings();

  if (isConfigured) {
    const supabase = await createClient();
    const { data: dbSettings } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (dbSettings) {
      settings = dbSettings;
    }
  }

  const features = [
    {
      key: 'certificates_enabled',
      name: 'Certificates of Completion',
      desc: 'Allows students to generate and download verified digital certificates after 100% completion.',
      icon: Award,
      enabled: settings?.certificates_enabled ?? false,
    },
    {
      key: 'quizzes_enabled',
      name: 'Technical Quizzes & Assessments',
      desc: 'Enables timed quizzes and grading for enrolled engineering masterclasses.',
      icon: HelpCircle,
      enabled: settings?.quizzes_enabled ?? true,
    },
    {
      key: 'assignments_enabled',
      name: 'Student File Submissions',
      desc: 'Allows students to upload calculation files and SLD models for manual instructor grading.',
      icon: FileCheck,
      enabled: settings?.assignments_enabled ?? false,
    },
    {
      key: 'discussions_enabled',
      name: 'Discussion Forums',
      desc: 'Allows students and instructors to ask questions directly below video lessons.',
      icon: MessageSquare,
      enabled: settings?.discussions_enabled ?? false,
    },
    {
      key: 'live_classes_enabled',
      name: 'Live Virtual Masterclasses',
      desc: 'Enables Zoom / live stream scheduling inside student portals.',
      icon: Video,
      enabled: settings?.live_classes_enabled ?? false,
    },
    {
      key: 'coupons_enabled',
      name: 'Discount Coupons',
      desc: 'Enables coupon codes for checkout promotion campaigns.',
      icon: Tag,
      enabled: settings?.coupons_enabled ?? false,
    },
  ];

  async function handleToggle(key: string, currentValue: boolean) {
    'use server';
    await updatePlatformSettings({ [key]: !currentValue });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Feature Control Centre</h1>
        <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
          Toggle optional academy features on and off without code redeployment.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((f) => {
          const Icon = f.icon;
          const toggleAction = handleToggle.bind(null, f.key, f.enabled);

          return (
            <Card key={f.key} className="border border-slate-200 bg-white flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      f.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {f.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <CardTitle className="text-sm font-bold text-jpdark mt-3">{f.name}</CardTitle>
                <p className="text-xs text-jpmuted leading-relaxed">{f.desc}</p>
              </CardHeader>
              <CardContent className="pt-2">
                <form action={toggleAction}>
                  <Button
                    type="submit"
                    variant={f.enabled ? 'outline' : 'default'}
                    className={`w-full text-xs py-2 font-bold ${
                      f.enabled ? 'border-slate-300' : 'btn-primary'
                    }`}
                  >
                    {f.enabled ? 'Turn Off Feature' : 'Enable Feature'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
