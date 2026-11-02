import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Frequently Asked Questions | JP Smart Solutions Academy',
  description: 'Answers to common questions regarding enrolment, payments, ETAP software access, and course delivery.',
};

const FAQS = [
  {
    q: 'How are the courses delivered?',
    a: 'Courses are 100% online with high-definition, streamable video masterclasses powered by Cloudflare Stream. Once enrolled, you can access your dashboard anytime, replay lessons, and download all calculation sheets and ETAP single-line diagram models.',
  },
  {
    q: 'Do I need an ETAP software license to take the courses?',
    a: 'While having access to ETAP (student, demo, or professional edition) allows you to follow along practically with the simulation exercises, you will still benefit immensely from watching the exact step-by-step modelling demonstrations and analyzing the supplied study outputs.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all Nigerian bank cards (Mastercard, Visa, Verve), direct bank transfers, USSD, and Apple Pay through our secure Paystack payment gateway. All transactions are billed in Nigerian Naira (NGN).',
  },
  {
    q: 'How long do I have access to my enrolled courses?',
    a: 'Once you enrol in a course, you receive lifetime access to all included modules, videos, and future material updates.',
  },
  {
    q: 'Can our organization sponsor a group of engineers?',
    a: 'Yes. We provide corporate invoices and custom training packages for engineering teams, utilities, and EPC contractors. Please reach out through our Contact page or WhatsApp.',
  },
  {
    q: 'Will I receive a certificate upon completion?',
    a: 'When certificate issuance is enabled for your cohort, students who complete 100% of course lessons and pass the final assessment with a mark of 70% or higher are issued an official, verifiable digital certificate of completion.',
  },
];

export default function FaqPage() {
  return (
    <div className="py-12 space-y-12">
      <section className="container-jp">
        <div className="max-w-2xl space-y-3">
          <div className="eyebrow">Help & Clarity</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-jpdark tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-jpmuted leading-relaxed">
            Everything you need to know about training format, payments, and system requirements.
          </p>
        </div>

        <div className="mt-10 max-w-3xl space-y-4">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group card-jp p-6 transition-all duration-200 open:border-jpblue"
            >
              <summary className="font-bold text-base text-jpdark cursor-pointer list-none flex items-center justify-between">
                <span>{faq.q}</span>
                <span className="ml-4 text-jpblue font-bold text-lg group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm text-jpmuted leading-relaxed border-t border-[#EAF0F6] pt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-12 p-8 card-jp bg-jplight text-center max-w-2xl mx-auto space-y-3">
          <h3 className="font-bold text-base text-jpdark">Still have unanswered questions?</h3>
          <p className="text-xs text-jpmuted leading-relaxed">
            Our training advisors in Port Harcourt are ready to assist you.
          </p>
          <div className="pt-2">
            <Link href="/contact" className="btn-primary text-xs py-2.5 px-6">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
