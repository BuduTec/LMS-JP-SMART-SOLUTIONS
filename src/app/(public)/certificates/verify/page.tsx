'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Search, GraduationCap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function CertificateVerificationSearchPage() {
  const router = useRouter();
  const [certNumber, setCertNumber] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = certNumber.trim();
    if (trimmed) {
      router.push(`/certificates/verify/${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="min-h-screen bg-jplight/60 py-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-hero-gradient flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-jpcyan" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-jpdark">
              JP SMART SOLUTIONS ACADEMY
            </span>
          </Link>
          <div className="eyebrow">Credential Verification Registry</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-jpdark mt-2 tracking-tight">
            Verify an Engineering Certificate
          </h1>
          <p className="text-xs sm:text-sm text-jpmuted mt-1 max-w-md mx-auto">
            Validate the authenticity of practical engineering certificates issued to practicing engineers and students.
          </p>
        </div>

        <Card className="border border-[#D5E1ED] shadow-jphover bg-white p-6 sm:p-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="certNumber" className="text-xs font-bold text-jpdark">
                Certificate Registration Number
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-jpblue" />
                <Input
                  id="certNumber"
                  type="text"
                  required
                  value={certNumber}
                  onChange={(e) => setCertNumber(e.target.value)}
                  placeholder="e.g. JPSS-2026-XXXX"
                  className="pl-11 h-12 text-sm font-mono uppercase"
                />
              </div>
              <span className="text-[11px] text-jpmuted block">
                The certificate number is printed at the bottom of the digital credential.
              </span>
            </div>

            <Button
              type="submit"
              className="w-full btn-primary h-12 text-sm font-bold flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              <span>Verify Credential Status</span>
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
