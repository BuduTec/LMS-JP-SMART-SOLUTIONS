'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { initiatePayment } from '@/actions/payment';
import { formatCurrency } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, CreditCard, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (res.ok) {
          const data = await res.json();
          setCourse(data);
        } else {
          // Fallback course info
          setCourse({
            id: courseId,
            title: 'Technical Masterclass',
            price: 50000,
            currency: 'NGN',
          });
        }
      } catch {
        setCourse({
          id: courseId,
          title: 'Technical Masterclass',
          price: 50000,
          currency: 'NGN',
        });
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId]);

  const handlePaystackPayment = async () => {
    setInitiating(true);
    try {
      const initResult = await initiatePayment(courseId);

      if (initResult.error || !initResult.reference) {
        toast.error(initResult.error || 'Failed to initialize payment transaction');
        setInitiating(false);
        return;
      }

      // If in dev mode without Paystack public key or test mode
      if (!initResult.publicKey || !window.PaystackPop) {
        toast('Simulating local transaction verification...', { icon: '💳' });
        router.push(`/student/checkout/verify?ref=${encodeURIComponent(initResult.reference)}`);
        return;
      }

      const handler = window.PaystackPop.setup({
        key: initResult.publicKey,
        email: initResult.email,
        amount: Math.round(initResult.amount * 100), // amount in kobo
        currency: initResult.currency,
        ref: initResult.reference,
        callback: function (response: any) {
          toast.success('Payment completed! Verifying your enrolment...');
          router.push(`/student/checkout/verify?ref=${encodeURIComponent(response.reference)}`);
        },
        onClose: function () {
          toast('Checkout window closed.');
          setInitiating(false);
        },
      });

      handler.openIframe();
    } catch (err: any) {
      toast.error(err.message || 'Payment processing error');
      setInitiating(false);
    }
  };

  const defaultImage =
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <Script
        src="https://js.paystack.co/v1/inline.js"
        onLoad={() => setPaystackLoaded(true)}
      />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="eyebrow">Secure Checkout</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-jpdark tracking-tight">
          Complete Your Course Enrolment
        </h1>
        <p className="text-xs sm:text-sm text-jpmuted">
          Instant lifetime access granted upon Paystack payment verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Order Details (3 cols) */}
        <div className="md:col-span-3 space-y-6">
          <Card className="border border-[#D5E1ED]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-jpdark">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-center pb-4 border-b border-[#EAF0F6]">
                <div className="relative h-16 w-24 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                  <Image
                    src={course?.image_url || defaultImage}
                    alt={course?.title || 'Course'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-jpdark line-clamp-2">
                    {course?.title || 'Loading Course Details...'}
                  </h3>
                  <span className="text-xs text-jpmuted block mt-0.5">
                    100% Online • Self-Paced Masterclass
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-jpdark/80">
                <div className="flex justify-between">
                  <span>Course Tuition</span>
                  <span className="font-semibold">
                    {formatCurrency(course?.price, course?.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>VAT & Processing Fee</span>
                  <span className="font-semibold text-emerald-600">Free (0.00)</span>
                </div>
                <div className="pt-3 border-t border-[#EAF0F6] flex justify-between text-sm font-extrabold text-jpdark">
                  <span>Total Due</span>
                  <span>{formatCurrency(course?.price, course?.currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 rounded-2xl bg-jplight/80 border border-[#D5E1ED] flex items-start gap-3 text-xs text-jpmuted">
            <Lock className="h-4 w-4 text-jpblue shrink-0 mt-0.5" />
            <span>
              All payments are encrypted and processed by Paystack in compliance with PCI-DSS Level 1 specifications. We accept all Nigerian bank cards, transfers, and USSD.
            </span>
          </div>
        </div>

        {/* Payment Action (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-[#D5E1ED] shadow-jphover bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold text-jpdark">Select Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="p-3.5 rounded-xl border-2 border-jpblue bg-blue-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="h-4 w-4 text-jpblue" />
                  <span className="text-xs font-bold text-jpdark">Paystack Gateway</span>
                </div>
                <span className="h-2 w-2 rounded-full bg-jpblue" />
              </div>

              <div className="space-y-2 text-xs text-jpmuted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Debit & Credit Cards (Verve, Visa, Master)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Direct Nigerian Bank Transfer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Instant USSD Code & Apple Pay</span>
                </div>
              </div>

              <button
                onClick={handlePaystackPayment}
                disabled={initiating || loading}
                className="w-full btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <Lock className="h-4 w-4" />
                <span>
                  {initiating
                    ? 'Connecting to Gateway...'
                    : `Pay ${formatCurrency(course?.price, course?.currency)}`}
                </span>
              </button>

              <div className="text-center">
                <span className="text-[11px] text-jpmuted">
                  7-Day Refund Guarantee Applies
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
