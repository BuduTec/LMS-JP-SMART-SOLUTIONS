'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Your message has been received! Our team will reply shortly.');
  };

  return (
    <div className="py-12 space-y-12">
      <section className="container-jp">
        <div className="max-w-2xl space-y-3">
          <div className="eyebrow">Contact & Advisory</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-jpdark tracking-tight">
            Get in touch with our training coordinators
          </h1>
          <p className="text-sm sm:text-base text-jpmuted leading-relaxed">
            Have questions about course curriculum, corporate group discounts, or ETAP licensing requirements? Reach out directly.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-6">
            <div className="card-jp p-6 space-y-4">
              <h3 className="font-bold text-base text-jpdark">Head Office</h3>
              <div className="space-y-3 text-xs sm:text-sm text-jpdark/80">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-jpblue shrink-0 mt-0.5" />
                  <span>{SITE_CONFIG.contact.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-jpblue shrink-0" />
                  <a href={`tel:${SITE_CONFIG.contact.phoneRaw}`} className="hover:text-jpblue">
                    {SITE_CONFIG.contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-jpblue shrink-0" />
                  <a href={`mailto:${SITE_CONFIG.contact.email}`} className="hover:text-jpblue">
                    {SITE_CONFIG.contact.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="card-jp p-6 bg-emerald-50 border-emerald-200 space-y-3">
              <h4 className="font-bold text-sm text-emerald-950">Instant WhatsApp Support</h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Need immediate course guidance or payment confirmation? Chat directly with an academy advisor.
              </p>
              <a
                href={SITE_CONFIG.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 inline-flex items-center gap-1.5"
              >
                <span>Open WhatsApp</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card-jp p-8 border border-[#D5E1ED]">
              {submitted ? (
                <div className="text-center py-12 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold text-xl">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-jpdark">Message Dispatched</h3>
                  <p className="text-sm text-jpmuted max-w-md mx-auto">
                    Thank you for reaching out to JP Smart Solutions Academy. A representative will contact you via email or phone within 24 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-jpdark">Your Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Engr. Chukwuemeka O."
                        className="w-full h-11 px-3.5 rounded-xl border border-[#D5E1ED] text-sm focus:outline-none focus:ring-2 focus:ring-jpblue"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-jpdark">Email Address</label>
                      <input
                        required
                        type="email"
                        placeholder="you@company.com"
                        className="w-full h-11 px-3.5 rounded-xl border border-[#D5E1ED] text-sm focus:outline-none focus:ring-2 focus:ring-jpblue"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-jpdark">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="+234..."
                        className="w-full h-11 px-3.5 rounded-xl border border-[#D5E1ED] text-sm focus:outline-none focus:ring-2 focus:ring-jpblue"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-jpdark">Course of Interest</label>
                      <select className="w-full h-11 px-3.5 rounded-xl border border-[#D5E1ED] text-sm focus:outline-none focus:ring-2 focus:ring-jpblue bg-white">
                        <option>General Inquiry</option>
                        <option>ETAP Software & SLD Modelling</option>
                        <option>Power System Analysis</option>
                        <option>Power System Protection</option>
                        <option>Solar PV System Design</option>
                        <option>Corporate Training for Organization</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-jpdark">Your Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please let us know how we can assist you..."
                      className="w-full p-3.5 rounded-xl border border-[#D5E1ED] text-sm focus:outline-none focus:ring-2 focus:ring-jpblue"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
