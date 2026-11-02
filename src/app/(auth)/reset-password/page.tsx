'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { updatePassword } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Lock, ArrowRight } from 'lucide-react';

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, null);

  return (
    <Card className="border border-[#D5E1ED] shadow-jphover bg-white">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-extrabold text-jpdark">Set New Password</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Please enter and confirm your new secure password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-jpmuted" />
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-jpmuted" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2"
          >
            <span>{isPending ? 'Updating...' : 'Update Password'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
      <CardFooter className="pt-0 text-center justify-center border-t border-[#EAF0F6] pt-4">
        <Link href="/login" className="text-xs font-semibold text-jpblue hover:underline">
          Return to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
