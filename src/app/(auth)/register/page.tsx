'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { signUp } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Lock, Mail, User, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUp, null);

  return (
    <Card className="border border-[#D5E1ED] shadow-jphover bg-white">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-extrabold text-jpdark">Create Your Account</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Join Nigeria&apos;s leading engineering and power systems academy
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
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-jpmuted" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder="Engr. John Doe"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-jpmuted" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john.doe@example.com"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password (min 6 characters)</Label>
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

          <div className="flex items-start space-x-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              required
              className="mt-1 h-4 w-4 rounded border-[#D5E1ED] text-jpblue focus:ring-jpblue"
            />
            <label htmlFor="terms" className="text-xs text-jpmuted leading-snug cursor-pointer">
              I agree to the{' '}
              <Link href="/terms" target="_blank" className="text-jpblue font-semibold hover:underline">
                Terms of Service
              </Link>{' '}
              and acknowledge the{' '}
              <Link href="/privacy" target="_blank" className="text-jpblue font-semibold hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2"
          >
            <span>{isPending ? 'Registering Account...' : 'Create Student Account'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
      <CardFooter className="pt-0 text-center justify-center border-t border-[#EAF0F6] pt-4">
        <p className="text-xs text-jpmuted">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-jpblue hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
