import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { MailCheck, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <Card className="border border-[#D5E1ED] shadow-jphover bg-white text-center">
      <CardHeader className="pb-4">
        <div className="h-16 w-16 rounded-full bg-jpblue-50 text-jpblue flex items-center justify-center mx-auto mb-2">
          <MailCheck className="h-8 w-8" />
        </div>
        <CardTitle className="text-2xl font-extrabold text-jpdark">Verify Your Email</CardTitle>
        <CardDescription className="text-xs sm:text-sm max-w-xs mx-auto">
          We&apos;ve dispatched a confirmation link to your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-xs sm:text-sm text-jpmuted leading-relaxed">
        <p>
          Please click the confirmation link in the email to activate your account and gain access to the student dashboard.
        </p>
        <div className="p-3.5 bg-jplight rounded-xl text-xs text-jpdark font-medium">
          Didn&apos;t receive it? Please check your spam or promotions folder.
        </div>
      </CardContent>
      <CardFooter className="justify-center border-t border-[#EAF0F6] pt-4">
        <Link
          href="/login"
          className="btn-primary text-xs py-2.5 px-6 font-bold flex items-center gap-1.5"
        >
          <span>Return to Sign In</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
