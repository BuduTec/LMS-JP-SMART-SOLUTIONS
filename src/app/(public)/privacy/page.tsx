import React from 'react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Privacy Policy | JP Smart Solutions Academy',
  description: 'Privacy Policy and data protection practices compliant with the Nigeria Data Protection Act (NDPA) and NDPR.',
};

export default function PrivacyPage() {
  return (
    <div className="py-12">
      <div className="container-jp max-w-4xl space-y-8">
        <div>
          <div className="eyebrow">Legal & Compliance</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-jpdark tracking-tight mt-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-jpmuted mt-1">
            Effective Date: November 2026 • Compliant with NDPA 2023 & NDPR
          </p>
        </div>

        <div className="card-jp p-8 sm:p-10 text-sm text-jpdark/80 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-jpdark">1. Overview</h2>
            <p>
              JP SMART SOLUTIONS LTD (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy outlines our procedures concerning the collection, usage, and safeguarding of personal information obtained through our online Learning Management System ({SITE_CONFIG.url}).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-jpdark">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Data:</strong> Full name, email address, phone number, and password hashes.</li>
              <li><strong>Billing & Payment Data:</strong> Transaction references, currency, and amount. Note: We do NOT store complete credit/debit card numbers; payment data is securely tokenized and handled directly by Paystack.</li>
              <li><strong>Learning Activity:</strong> Lesson completions, quiz answers, test scores, and video playback timestamps.</li>
              <li><strong>Device & Access Logs:</strong> IP address, browser type, and video streaming access tokens for anti-piracy validation.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-jpdark">3. Purpose of Processing</h2>
            <p>
              We process your data to administer your account, deliver video and curriculum content, record your academic progress, issue credentials, and prevent unauthorized distribution of proprietary engineering tutorials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-jpdark">4. Data Security</h2>
            <p>
              All traffic between your browser and our servers is encrypted using modern TLS encryption. Video assets are served via signed, short-lived tokens, and customer data is partitioned using database Row Level Security (RLS).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-jpdark">5. Contact Us</h2>
            <p>
              If you have any questions or data access requests under the Nigeria Data Protection Act, please contact our Data Protection Officer at: <strong>{SITE_CONFIG.contact.email}</strong> or visit our office at {SITE_CONFIG.contact.address}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
