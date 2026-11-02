'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { startAttempt, submitAssessment } from '@/actions/assessment';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TakeAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<any>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    async function initQuiz() {
      try {
        const attemptRes = await startAttempt(assessmentId);
        if (attemptRes.error || !attemptRes.attemptId) {
          toast.error(attemptRes.error || 'Failed to start quiz attempt');
          router.push('/student/assessments');
          return;
        }

        setAttemptId(attemptRes.attemptId);

        // Fetch questions
        const res = await fetch(`/api/assessments/${assessmentId}`);
        if (res.ok) {
          const data = await res.json();
          setAssessment(data);
          if (data.time_limit_minutes) {
            setTimeLeft(data.time_limit_minutes * 60);
          }
        }
      } catch (err: any) {
        toast.error('Error loading assessment');
      } finally {
        setLoading(false);
      }
    }

    initQuiz();
  }, [assessmentId, router]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev !== null && prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswers();
          return 0;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (questionId: string, optionId: string, isMultiple: boolean) => {
    setSelectedAnswers((prev) => {
      if (isMultiple) {
        const current = prev[questionId] || [];
        const updated = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [questionId]: updated };
      }
      return { ...prev, [questionId]: [optionId] };
    });
  };

  const handleSubmitAnswers = async () => {
    if (!attemptId) return;
    setSubmitting(true);
    try {
      const res = await submitAssessment(attemptId, assessmentId, selectedAnswers);
      if (res.success) {
        toast.success('Assessment submitted successfully!');
        router.push(`/student/assessments/${assessmentId}/results?attemptId=${attemptId}`);
      } else {
        toast.error('Submission failed. Please try again.');
        setSubmitting(false);
      }
    } catch {
      toast.error('An error occurred during submission');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="h-8 w-8 border-4 border-jpblue border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-jpmuted">Preparing assessment questions...</p>
      </div>
    );
  }

  const questions = assessment?.questions || [];
  const currentQ = questions[currentQuestionIndex];

  if (!currentQ) {
    return (
      <div className="card-jp p-10 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-jpdark">Assessment Under Construction</h2>
        <p className="text-xs text-jpmuted max-w-sm mx-auto">
          No questions have been added to this assessment yet. Check back soon.
        </p>
        <Button onClick={() => router.push('/student/assessments')} className="btn-primary text-xs py-2 px-5">
          Back to Assessments
        </Button>
      </div>
    );
  }

  const minutes = timeLeft !== null ? Math.floor(timeLeft / 60) : 0;
  const seconds = timeLeft !== null ? timeLeft % 60 : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Header Bar */}
      <div className="card-jp p-4 bg-white border border-[#D5E1ED] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase text-jpblue tracking-wider">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <h2 className="font-extrabold text-sm text-jpdark truncate max-w-sm">
            {assessment?.title}
          </h2>
        </div>

        {timeLeft !== null && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 font-mono text-xs font-bold border border-amber-200">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>
        )}
      </div>

      {/* Question Card */}
      <Card className="border border-[#D5E1ED] bg-white">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-jpmuted">
              Marks: {currentQ.marks || 1}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-jpdark leading-relaxed">
              {currentQ.question_text}
            </h3>
          </div>

          <div className="space-y-3">
            {(currentQ.options || []).map((opt: any) => {
              const isSelected = (selectedAnswers[currentQ.id] || []).includes(opt.id);
              const isMultiple = currentQ.question_type === 'multiple_answer';

              return (
                <div
                  key={opt.id}
                  onClick={() => handleOptionSelect(currentQ.id, opt.id, isMultiple)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'border-jpblue bg-blue-50/60 text-jpblue font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-jpdark'
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-${isMultiple ? 'md' : 'full'} border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-jpblue bg-jpblue text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <span className="text-[10px]">✓</span>}
                  </div>
                  <span className="text-xs sm:text-sm">{opt.option_text}</span>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-[#EAF0F6] flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              className="text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                type="button"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="btn-primary text-xs py-2 px-5 font-bold flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={submitting}
                onClick={handleSubmitAnswers}
                className="btn-cyan text-xs py-2 px-6 font-bold flex items-center gap-1.5"
              >
                <span>{submitting ? 'Submitting...' : 'Submit Assessment'}</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
