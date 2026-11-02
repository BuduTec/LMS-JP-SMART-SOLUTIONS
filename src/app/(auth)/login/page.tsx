'use client';

import React, { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/student/dashboard';
  const errorParam = searchParams.get('error');

  const [state, formAction, isPending] = useActionState(signIn, null);

  useEffect(() => {
    if (errorParam) {
      toast.error('Authentication session expired or invalid. Please sign in.');
    }
  }, [errorParam]);

  return (
    <Card className="border border-[#D5E1ED] shadow-jphover bg-white">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-extrabold text-jpdark">Welcome Back</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Sign in to your JP Smart Solutions Academy account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirectUrl} />

          {state?.error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-jpmuted" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-jpblue font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>
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

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="h-4 w-4 rounded border-[#D5E1ED] text-jpblue focus:ring-jpblue"
            />
            <label htmlFor="remember" className="text-xs text-jpmuted font-medium cursor-pointer">
              Remember me on this browser
            </label>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2"
          >
            <span>{isPending ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
      <CardFooter className="pt-0 text-center justify-center border-t border-[#EAF0F6] pt-4">
        <p className="text-xs text-jpmuted">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-bold text-jpblue hover:underline">
            Create account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
