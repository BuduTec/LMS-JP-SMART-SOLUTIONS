import React from 'react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Refund & Cancellation Policy | JP Smart Solutions Academy',
  description: 'Refund and cancellation terms for training courses at JP Smart Solutions Academy.',
};

export default function RefundsPage() {
  return (
    <div className="py-12">
      <div className="container-jp max-w-4xl space-y-8">
        <div>
          <div className="eyebrow">Customer Protection</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-jpdark tracking-tight mt-2">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-jpmuted mt-1">
            Last Updated: November 2026
          </p>
        </div>

        <div className="card-jp p-8 sm:p-10 text-sm text-jpdark/80 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-jpdark">1. Digital Content Delivery</h2>
            <p>
              JP Smart Solutions Academy offers digital engineering video courses, downloadable calculation spreadsheets, and software model files. Because digital assets and downloadable resources are unlocked immediately upon payment verification, specific conditions apply to refunds.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-jpdark">2. Eligibility for Refund</h2>
            <p>
              You are eligible to request a full refund within <strong>7 days</strong> of purchase under the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You have watched less than 20% of the total course video content.</li>
              <li>You have not downloaded proprietary course resources (ETAP project files, calculation workbooks).</li>
              <li>You have not attempted or submitted any graded assessment.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-jpdark">3. Non-Refundable Scenarios</h2>
            <p>
              Refunds will NOT be granted if:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>More than 7 days have elapsed since the date of transaction.</li>
              <li>A certificate of completion has already been issued.</li>
              <li>Your account was suspended due to a breach of our intellectual property or sharing policies.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-jpdark">4. How to Request a Refund</h2>
            <p>
              Send an email to <strong>{SITE_CONFIG.contact.supportEmail}</strong> with your full name, registered email address, payment reference, and reason for the request. Eligible refunds are processed back to the original source of payment within 5 to 10 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
