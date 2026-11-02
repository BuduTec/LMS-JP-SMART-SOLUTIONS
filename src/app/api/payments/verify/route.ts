import { type NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json({ error: 'Payment reference is required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // 1. Fetch payment
    const { data: payment, error: pError } = await supabase
      .from('payments')
      .select('*, course:courses(title, price, currency)')
      .eq('payment_reference', reference)
      .single();

    if (pError || !payment) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (payment.status === 'successful') {
      return NextResponse.json({ success: true, message: 'Already verified' });
    }

    // 2. Paystack verification call
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (secretKey) {
      const psRes = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      const psData = await psRes.json();

      if (!psData.status || psData.data?.status !== 'success') {
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('id', payment.id);

        return NextResponse.json(
          { error: 'Payment verification failed with provider' },
          { status: 400 }
        );
      }
    }

    // 3. Update payment & create enrolment
    await supabase
      .from('payments')
      .update({
        status: 'successful',
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
      title: 'Enrolment Confirmed',
      body: `Your payment was verified. You now have full access to ${payment.course?.title || 'your course'}.`,
      link: `/student/courses/${payment.course_id}`,
    });

    return NextResponse.json({ success: true, courseId: payment.course_id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
