'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyPayment } from '@/actions/payment';
import { CheckCircle2, AlertCircle, RefreshCw, PlayCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function VerifyPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('ref');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleVerify() {
      if (!reference) {
        setError('No transaction reference found');
        setLoading(false);
        return;
      }

      try {
        const result = await verifyPayment(reference);
        if (result.success && result.courseId) {
          setSuccess(true);
          setCourseId(result.courseId);
        } else {
          setError(result.error || 'Payment verification failed');
        }
      } catch (err: any) {
        setError(err.message || 'Error communicating with verification server');
      } finally {
        setLoading(false);
      }
    }

    handleVerify();
  }, [reference]);

  return (
    <Card className="border border-[#D5E1ED] shadow-jphover text-center">
      <CardHeader>
        {loading && (
          <div className="space-y-3">
            <RefreshCw className="h-12 w-12 text-jpblue animate-spin mx-auto" />
            <CardTitle className="text-xl font-extrabold text-jpdark">
              Verifying Your Payment
            </CardTitle>
            <p className="text-xs text-jpmuted">
              Please wait while we confirm your transaction with Paystack...
            </p>
          </div>
        )}

        {!loading && success && (
          <div className="space-y-3">
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl font-extrabold text-jpdark">
              Enrolment Confirmed!
            </CardTitle>
            <p className="text-xs text-jpmuted">
              Your payment was successfully verified. You now have full lifetime access to this course.
            </p>
          </div>
        )}

        {!loading && !success && (
          <div className="space-y-3">
            <div className="h-14 w-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl font-extrabold text-jpdark">
              Verification Unsuccessful
            </CardTitle>
            <p className="text-xs text-red-600 font-medium">
              {error || 'Unable to confirm transaction with payment provider'}
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        {!loading && success && courseId && (
          <div className="space-y-3">
            <Link
              href={`/student/courses/${courseId}`}
              className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Start Learning Now</span>
            </Link>
            <Link
              href="/student/dashboard"
              className="btn-outline w-full py-2.5 text-xs font-semibold block"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {!loading && !success && (
          <div className="space-y-3">
            <Link
              href="/student/dashboard"
              className="btn-primary w-full py-3 text-xs font-bold block"
            >
              Return to Dashboard
            </Link>
            <Link
              href="/contact"
              className="text-xs text-jpblue font-semibold hover:underline block"
            >
              Contact Support for Assistance
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CheckoutVerifyPage() {
  return (
    <div className="max-w-md mx-auto py-12">
      <Suspense
        fallback={
          <Card className="border border-[#D5E1ED] p-12 text-center bg-white">
            <div className="h-8 w-8 border-4 border-jpblue border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-jpmuted mt-3">Confirming transaction...</p>
          </Card>
        }
      >
        <VerifyPaymentContent />
      </Suspense>
    </div>
  );
}
