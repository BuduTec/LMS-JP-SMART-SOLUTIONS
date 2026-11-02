'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Stream } from '@cloudflare/stream-react';
import { Play, Pause, Volume2, VolumeX, Maximize, AlertCircle, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface VideoPlayerProps {
  lessonId: string;
  videoUid: string | null;
  initialPosition?: number;
  watermarkText?: string;
  courseId?: string;
}

export function VideoPlayer({
  lessonId,
  videoUid,
  initialPosition = 0,
  watermarkText = 'JP SMART SOLUTIONS',
  courseId,
}: VideoPlayerProps) {
  const [tokenData, setTokenData] = useState<{
    streamUrl?: string;
    videoUid?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<any>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch token on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchToken() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/video/token?lessonId=${lessonId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to authorize video playback');
        }

        if (isMounted) {
          setTokenData(data);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Error loading video player');
          setLoading(false);
        }
      }
    }

    fetchToken();

    return () => {
      isMounted = false;
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [lessonId]);

  // Periodic progress saving every 30s
  useEffect(() => {
    progressTimerRef.current = setInterval(() => {
      if (streamRef.current && typeof streamRef.current.currentTime === 'number') {
        const currentTime = streamRef.current.currentTime;
        const duration = streamRef.current.duration || 0;

        if (currentTime > 0) {
          fetch('/api/video/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lessonId,
              courseId,
              positionSeconds: currentTime,
              durationSeconds: duration,
            }),
          }).catch(() => {});
        }
      }
    }, 30000);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [lessonId, courseId]);

  if (loading) {
    return (
      <div className="w-full aspect-video bg-slate-950 flex flex-col items-center justify-center text-white space-y-3">
        <Skeleton className="w-full h-full bg-slate-900" />
      </div>
    );
  }

  if (error || !videoUid) {
    return (
      <div className="w-full aspect-video bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
        <AlertCircle className="h-10 w-10 text-amber-400" />
        <h3 className="text-base font-bold text-white">Video Stream Notice</h3>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed">
          {error || 'This lesson video is currently undergoing Cloudflare encoding or credentials are not yet configured.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-pill bg-white/10 hover:bg-white/20 text-white text-xs py-2 px-4 inline-flex items-center gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reload Stream</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-black group overflow-hidden select-none">
      {/* Cloudflare Stream Player */}
      <Stream
        controls
        responsive={true}
        src={videoUid}
        currentTime={initialPosition}
        className="w-full h-full"
      />

      {/* Dynamic Watermark Overlay for intellectual property protection */}
      <div className="absolute top-4 right-4 pointer-events-none z-30 opacity-40 hover:opacity-20 transition-opacity">
        <span className="font-mono text-[11px] font-bold text-white bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-sm tracking-wider">
          {watermarkText} • JP SMART SOLUTIONS
        </span>
      </div>

      <div className="absolute bottom-16 left-6 pointer-events-none z-30 opacity-25">
        <span className="font-mono text-[10px] text-white">
          LICENSED TO: {watermarkText}
        </span>
      </div>
    </div>
  );
}
