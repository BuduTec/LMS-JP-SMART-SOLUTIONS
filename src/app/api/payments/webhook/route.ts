import { type NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // PAYSTACK_WEBHOOK_SECRET must be set to the exact secret configured
    // in the Paystack dashboard Webhooks section (not the secret API key).
    const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('[webhook] PAYSTACK_WEBHOOK_SECRET env var is not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing x-paystack-signature header' }, { status: 401 });
    }

    // Verify HMAC-SHA512 — Paystack uses the secret key as the HMAC key
    const hash = crypto
      .createHmac('sha512', webhookSecret)
      .update(body)
      .digest('hex');

    // Timing-safe comparison prevents timing-based attacks
    const sigBuffer = Buffer.from(signature);
    const hashBuffer = Buffer.from(hash);
    if (
      sigBuffer.length !== hashBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, hashBuffer)
    ) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);

    if (payload.event === 'charge.success') {
      const data = payload.data;
      const reference = data.reference;

      const supabase = await createAdminClient();

      const { data: payment } = await supabase
        .from('payments')
        .select('id, status, student_id, course_id, course:courses(title)')
        .eq('payment_reference', reference)
        .maybeSingle();

      if (!payment) {
        // Unknown reference — not our transaction
        console.warn(`[webhook] No payment found for reference: ${reference}`);
        return NextResponse.json({ received: true });
      }

      // Idempotency guard: only process once
      if (payment.status === 'successful') {
        return NextResponse.json({ received: true });
      }

      await supabase
        .from('payments')
        .update({
          status: 'successful',
          paystack_transaction_id: String(data.id),
          verified_at: new Date().toISOString(),
        })
        .eq('id', payment.id);

      // Upsert enrolment to grant course access
      await supabase.from('enrolments').upsert(
        {
          student_id: payment.student_id,
          course_id: payment.course_id,
          payment_id: payment.id,
          is_active: true,
          enrolled_at: new Date().toISOString(),
        },
        { onConflict: 'student_id,course_id' }
      );

      const courseTitle = (payment.course as any)?.title || 'your course';
      await supabase.from('notifications').insert({
        user_id: payment.student_id,
        title: "Payment Successful — You're Enrolled!",
        body: `Your payment has been verified. You now have full access to "${courseTitle}".`,
        link: `/student/courses/${payment.course_id}`,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[webhook] Unhandled error:', err?.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
