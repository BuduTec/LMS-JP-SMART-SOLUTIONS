import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Award, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default async function StudentCertificatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Check platform settings
  const { data: settings } = await supabase
    .from('platform_settings')
    .select('certificates_enabled')
    .single();

  const certificatesEnabled = settings?.certificates_enabled ?? false;

  // Fetch student certificates
  const { data: certificates } = await supabase
    .from('certificates')
    .select(`
      *,
      course:courses(title, slug)
    `)
    .eq('student_id', user.id)
    .eq('is_valid', true);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Certificates & Credentials</h1>
        <p className="text-xs sm:text-sm text-jpmuted mt-1">
          Official digital certificates awarded upon 100% course completion and assessment pass.
        </p>
      </div>

      {!certificatesEnabled ? (
        <div className="card-jp p-10 bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-200 text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-jpblue-50 text-jpblue flex items-center justify-center mx-auto">
            <Award className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-jpdark">Certificate Issuance: Coming Soon</h2>
            <p className="text-xs sm:text-sm text-jpmuted max-w-md mx-auto leading-relaxed">
              Official digital credential verification is currently being upgraded for our upcoming cohort. Your course lesson and assessment completions are being recorded securely in the database.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/student/courses" className="btn-primary text-xs py-2 px-5 font-bold">
              Continue Course Lessons
            </Link>
          </div>
        </div>
      ) : certificates && certificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {certificates.map((cert: any) => (
            <div
              key={cert.id}
              className="card-jp p-6 border border-[#D5E1ED] bg-white space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Verified Certificate
                  </span>
                  <span className="text-xs font-mono text-jpmuted">#{cert.certificate_number}</span>
                </div>
                <h3 className="font-bold text-base text-jpdark mt-2">{cert.course?.title}</h3>
                <p className="text-xs text-jpmuted">
                  Issued on: {new Date(cert.issued_at).toLocaleDateString()}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EAF0F6]">
                <Link
                  href={`/certificates/verify/${cert.certificate_number}`}
                  target="_blank"
                  className="btn-outline w-full text-center text-xs py-2 font-bold block"
                >
                  View Public Verification
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-jp p-12 text-center space-y-3 border border-dashed border-[#D5E1ED]">
          <Award className="h-10 w-10 text-jpmuted mx-auto" />
          <h3 className="text-base font-bold text-jpdark">No certificates issued yet</h3>
          <p className="text-xs text-jpmuted max-w-sm mx-auto leading-relaxed">
            Certificates are automatically generated when you finish all modules in an enrolled course and pass the required assessment.
          </p>
        </div>
      )}
    </div>
  );
}
