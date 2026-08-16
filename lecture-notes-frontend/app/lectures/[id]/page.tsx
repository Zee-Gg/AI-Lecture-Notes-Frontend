'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { apiFetch } from '../../lib/apiClient';
import { Lecture } from '../../types/database';
import StatusBadge from '../../components/StatusBadge';
import { useLecturePolling } from '../../hooks/useLecturePolling';
import Link from 'next/link';

export default function LectureDetail() {
  const { id } = useParams<{ id: string }>();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Lecture>(`/api/lectures/${id}`)
      .then((data) => setLecture(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = useCallback((updated: Lecture) => {
    setLecture(updated);
  }, []);

  const isProcessing = lecture?.status === 'pending' || lecture?.status === 'processing';
  useLecturePolling(id, handleUpdate, isProcessing);

  if (loading) {
    return (
      <main className="min-h-screen bg-surface-alt flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </main>
    );
  }

  if (!lecture) {
    return (
      <main className="min-h-screen bg-surface-alt flex items-center justify-center">
        <p className="text-text-secondary">Lecture not found.</p>
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-surface-alt px-6 py-10 sm:px-12">
        <div className="max-w-3xl mx-auto">
          <Link href={`/courses/${lecture.course_id}`} className="text-sm text-text-muted hover:text-text-secondary">
            ← Back to course
          </Link>

          <div className="flex items-center justify-between mt-4 mb-8">
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">
              {lecture.title}
            </h1>
            <StatusBadge status={lecture.status} />
          </div>

          {isProcessing && (
            <div className="bg-accent-soft border border-accent/20 rounded-2xl p-6 text-center">
              <p className="text-accent font-medium">
                {lecture.status === 'pending' ? 'Queued for processing...' : 'Transcribing your lecture...'}
              </p>
              <p className="text-text-muted text-sm mt-1">
                This usually takes a couple of minutes. This page updates automatically.
              </p>
            </div>
          )}

          {lecture.status === 'failed' && (
            <div className="bg-status-failed-bg border border-status-failed-text/20 rounded-2xl p-6 text-center">
              <p className="text-status-failed-text font-medium">Transcription failed.</p>
              <p className="text-text-muted text-sm mt-1">
                Try re-uploading the audio file, or check the file format.
              </p>
            </div>
          )}

          {lecture.status === 'done' && lecture.transcript_text && (
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-text-primary mb-3">Transcript</h2>
              <p className="text-text-secondary text-sm whitespace-pre-wrap leading-relaxed">
                {lecture.transcript_text}
              </p>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}