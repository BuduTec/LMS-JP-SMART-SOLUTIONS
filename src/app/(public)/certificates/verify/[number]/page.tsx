import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import { ShieldCheck, XCircle, Award, Calendar, GraduationCap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SITE_CONFIG } from '@/lib/constants';

interface VerifyCertificatePageProps {
  params: Promise<{
    number: string;
  }>;
}

export default async function VerifyCertificatePage({ params }: VerifyCertificatePageProps) {
  const { number } = await params;
  const supabase = await createAdminClient();

  const { data: cert } = await supabase
    .from('certificates')
    .select(`
      *,
      student:profiles(full_name, email),
      course:courses(title, slug)
    `)
    .eq('certificate_number', number)
    .maybeSingle();

  const isValid = cert?.is_valid === true;

  return (
    <div className="min-h-screen bg-jplight/60 py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-hero-gradient flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-jpcyan" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-jpdark">
              JP SMART SOLUTIONS ACADEMY
            </span>
          </Link>
          <div className="eyebrow">Credential Verification Registry</div>
        </div>

        {isValid ? (
          <Card className="border-2 border-emerald-300 bg-white shadow-jphover overflow-hidden">
            <div className="p-8 bg-emerald-50/70 border-b border-emerald-200 text-center space-y-2">
              <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Official Credential Verified
              </span>
              <h1 className="text-2xl font-extrabold text-jpdark">Certificate of Completion</h1>
              <p className="text-xs text-jpmuted font-mono">#{cert.certificate_number}</p>
            </div>

            <CardContent className="p-8 space-y-6 text-sm">
              <div className="text-center space-y-1">
                <span className="text-xs text-jpmuted">Awarded To</span>
                <div className="text-xl font-extrabold text-jpdark">
                  {cert.student?.full_name || 'Verified Graduate'}
                </div>
              </div>

              <div className="text-center space-y-1">
                <span className="text-xs text-jpmuted">Course Completed</span>
                <div className="text-base font-bold text-jpblue">
                  {cert.course?.title}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-jpmuted block">Issuance Date</span>
                  <span className="font-semibold text-jpdark">
                    {new Date(cert.issued_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-jpmuted block">Issuing Authority</span>
                  <span className="font-semibold text-jpdark">{SITE_CONFIG.companyName}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-rose-200 bg-white shadow-jphover text-center p-8 space-y-4">
            <div className="h-14 w-14 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <XCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl font-extrabold text-jpdark">
              Invalid or Revoked Certificate
            </CardTitle>
            <p className="text-xs text-jpmuted max-w-sm mx-auto leading-relaxed">
              No active certificate was found for registration number <strong>{number}</strong>. This credential may have been revoked or never existed.
            </p>
            <div className="pt-2">
              <Link href="/" className="btn-primary text-xs py-2 px-5 font-bold">
                Return to Academy Homepage
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
