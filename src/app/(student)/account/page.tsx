import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { updateProfile } from '@/actions/student';
import { updatePassword } from '@/actions/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Phone, Lock, Save, ShieldCheck } from 'lucide-react';

export default async function StudentAccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Account Settings</h1>
        <p className="text-xs sm:text-sm text-jpmuted mt-1">
          Manage your personal profile, contact information, and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-[#D5E1ED]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-jpdark">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateProfile as any} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Registered Email</Label>
                  <Input
                    id="email"
                    type="email"
                    disabled
                    value={user.email || ''}
                    className="bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                  <span className="text-[11px] text-jpmuted">
                    Your email address is managed through authentication security.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    defaultValue={profile?.full_name || ''}
                    placeholder="Engr. Chukwuemeka O."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone / WhatsApp</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={profile?.phone || ''}
                    placeholder="+234..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    defaultValue={profile?.bio || ''}
                    placeholder="Electrical Engineer with 5+ years experience in substation designs..."
                  />
                </div>

                <Button type="submit" className="btn-primary text-xs py-2 px-5 font-bold flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  <span>Save Profile</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="border border-[#D5E1ED]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-jpdark">Security & Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updatePassword as any} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>

                <Button type="submit" variant="secondary" className="btn-dark text-xs py-2 px-5 font-bold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Update Password</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Account Details & Status (1 col) */}
        <div className="space-y-6">
          <Card className="border border-[#D5E1ED]">
            <CardHeader>
              <CardTitle className="text-base font-bold text-jpdark">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-jpdark/80">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAF0F6]">
                <span className="text-jpmuted">Role</span>
                <span className="font-bold text-jpblue uppercase">{profile?.role || 'STUDENT'}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#EAF0F6]">
                <span className="text-jpmuted">Account Status</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-jpmuted">Member Since</span>
                <span className="font-medium">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
