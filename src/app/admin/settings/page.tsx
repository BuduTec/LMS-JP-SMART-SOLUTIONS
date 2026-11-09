import React from 'react';
import { createClient, getSupabaseConfig } from '@/lib/supabase/server';
import { getStorePlatformSettings } from '@/lib/admin-store';
import { updatePlatformSettings } from '@/actions/admin';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, ShieldAlert, Sliders } from 'lucide-react';
import Link from 'next/link';

export default async function AdminSettingsPage() {
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

  async function handleSaveSettings(formData: FormData) {
    'use server';
    const academyName = formData.get('academyName') as string;
    const supportEmail = formData.get('supportEmail') as string;
    const supportPhone = formData.get('supportPhone') as string;
    const maintenanceMode = formData.get('maintenanceMode') === 'on';

    await updatePlatformSettings({
      academy_name: academyName,
      support_email: supportEmail,
      support_phone: supportPhone,
      maintenance_mode: maintenanceMode,
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Platform Configuration</h1>
          <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
            Manage global academy parameters and maintenance flags.
          </p>
        </div>
        <Link
          href="/admin/settings/features"
          className="btn-outline text-xs py-2 px-4 font-bold flex items-center gap-1.5"
        >
          <Sliders className="h-3.5 w-3.5 text-jpblue" />
          <span>Feature Flags Centre</span>
        </Link>
      </div>

      <Card className="border border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-base font-bold text-jpdark">General System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSaveSettings} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="academyName">Academy Brand Name</Label>
              <Input
                id="academyName"
                name="academyName"
                defaultValue={settings?.academy_name || 'JP Smart Solutions Academy'}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  name="supportEmail"
                  type="email"
                  defaultValue={settings?.support_email || 'support@jpsmartsolutions.com'}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input
                  id="supportPhone"
                  name="supportPhone"
                  defaultValue={settings?.support_phone || '+234 906 737 4854'}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-950">Maintenance Mode</span>
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    id="maintenanceMode"
                    defaultChecked={settings?.maintenance_mode}
                    className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  When enabled, non-admin visitors will see a maintenance screen.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="btn-primary text-xs py-2 px-6 font-bold flex items-center gap-1.5">
                <Save className="h-4 w-4" />
                <span>Save Platform Settings</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
