import React from 'react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Terms & Conditions | JP Smart Solutions Academy',
  description: 'Terms and conditions governing the use of JP Smart Solutions Academy educational services.',
};

export default function TermsPage() {
  return (
    <div className="py-12">
      <div className="container-jp max-w-4xl space-y-8">
        <div>
          <div className="eyebrow">Terms of Service</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-jpdark tracking-tight mt-2">
            Terms & Conditions
          </h1>
          <p className="text-xs text-jpmuted mt-1">
            Last Updated: November 2026
          </p>
        </div>

        <div className="card-jp p-8 sm:p-10 text-sm text-jpdark/80 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-jpdark">1. Agreement to Terms</h2>
            <p>
              By accessing or enrolling in any course at JP Smart Solutions Academy, you agree to be bound by these Terms and Conditions and all applicable laws and regulations of the Federal Republic of Nigeria.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-jpdark">2. Intellectual Property & License</h2>
            <p>
              All video lessons, calculation sheets, single-line diagrams, project templates, and assessment materials are the proprietary intellectual property of JP SMART SOLUTIONS LTD. Enrolment grants a single, non-exclusive, non-transferable personal license to view the materials. Screen recording, unauthorized downloading, sharing login credentials, or reselling course files is strictly prohibited and subject to immediate revocation and legal action.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-jpdark">3. Dynamic Watermarking</h2>
            <p>
              To protect proprietary engineering intellectual property, video lesson streams dynamically display semi-transparent watermarks showing your masked account email. Tampering with or obscuring these markers violates your user license.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-jpdark">4. Account Conduct</h2>
            <p>
              You agree to provide accurate registration details and maintain the security of your password. We reserve the right to suspend or terminate accounts that breach academic integrity or system policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-jpdark">5. Governing Law</h2>
            <p>
              These terms are governed by the laws of Rivers State and the Federal Republic of Nigeria.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
