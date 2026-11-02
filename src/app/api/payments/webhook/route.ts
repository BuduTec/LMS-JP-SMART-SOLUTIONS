import { type NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY;

    // Verify HMAC SHA512 signature
    if (secret && signature) {
      const hash = crypto
        .createHmac('sha512', secret)
        .update(body)
        .digest('hex');

      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(body);

    if (payload.event === 'charge.success') {
      const data = payload.data;
      const reference = data.reference;

      const supabase = await createAdminClient();

      const { data: payment } = await supabase
        .from('payments')
        .select('*, course:courses(title)')
        .eq('payment_reference', reference)
        .single();

      if (payment && payment.status !== 'successful') {
        await supabase
          .from('payments')
          .update({
            status: 'successful',
            paystack_transaction_id: String(data.id),
            verified_at: new Date().toISOString(),
          })
          .eq('id', payment.id);

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

        await supabase.from('notifications').insert({
          user_id: payment.student_id,
          title: 'Payment Successful',
          body: `Payment verified. Access granted to ${payment.course?.title || 'your course'}.`,
          link: `/student/courses/${payment.course_id}`,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
