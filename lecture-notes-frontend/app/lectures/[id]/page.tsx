"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import { apiFetch } from "../../lib/apiClient";
import { Lecture, Notes } from "../../types/database";
import StatusBadge from "../../components/StatusBadge";
import NotesSection from "../../components/NotesSection";
import EditableTitle from "../../components/EditableTitle";
import { useLecturePolling } from "../../hooks/useLecturePolling";
import Link from "next/link";

export default function LectureDetail() {
  const { id } = useParams<{ id: string }>();

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [lectureLoading, setLectureLoading] = useState(true);
  const [lectureError, setLectureError] = useState<string | null>(null);

  const [notes, setNotes] = useState<Notes | null>(null);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);

  const [chunkCount, setChunkCount] = useState<number | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (lecture?.status === "done") {
      apiFetch<{ count: number }>(`/api/lectures/${id}/chunk-count`)
        .then((data) => setChunkCount(data.count))
        .catch(() => {});
    }
  }, [lecture?.status, id]);

  // Fetch the lecture itself
  const handleRetry = async () => {
    setRetrying(true);
    try {
      await apiFetch(`/api/lectures/${id}/retry`, { method: "POST" });
      // Refetch lecture so UI reflects the new "pending" status and polling kicks back in
      const updated = await apiFetch<Lecture>(`/api/lectures/${id}`);
      setLecture(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setRetrying(false);
    }
  };
  // Fetch notes once the lecture is done
  useEffect(() => {
    if (!id || lecture?.status !== "done") return;

    setNotesLoading(true);
    setNotesError(null);

    apiFetch<Notes>(`/api/notes/lecture/${id}`)
      .then((data) => setNotes(data))
      .catch((err) => {
        console.error(err);
        setNotesError(
          err instanceof Error ? err.message : "Notes could not be loaded",
        );
      })
      .finally(() => setNotesLoading(false));
  }, [lecture?.status, id]);

  const handleLectureUpdate = useCallback((updated: Lecture) => {
    setLecture(updated);
  }, []);

  const isProcessing =
    lecture?.status === "pending" || lecture?.status === "processing";
  useLecturePolling(id, handleLectureUpdate, isProcessing);

  const handleRenameLecture = async (newTitle: string) => {
    const updated = await apiFetch<Lecture>(`/api/lectures/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title: newTitle }),
    });
    setLecture(updated);
  };

  if (lectureLoading) {
    return (
      <main className="min-h-screen bg-surface-alt flex items-center justify-center">
        <p className="text-text-secondary">Loading lecture...</p>
      </main>
    );
  }

  if (lectureError) {
    return (
      <main className="min-h-screen bg-surface-alt flex items-center justify-center">
        <p className="text-error">{lectureError}</p>
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
          <Link
            href={`/courses/${lecture.course_id}`}
            className="text-sm text-text-muted hover:text-text-secondary"
          >
            ← Back to course
          </Link>

          <div className="flex items-center justify-between mt-4 mb-8">
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">
              <EditableTitle
                value={lecture.title}
                onSave={handleRenameLecture}
              />
            </h1>
            <StatusBadge status={lecture.status} />
          </div>

          {isProcessing && (
            <div className="bg-accent-soft border border-accent/20 rounded-2xl p-6 text-center">
              <p className="text-accent font-medium">
                {lecture.status === "pending"
                  ? "Queued for processing..."
                  : "Transcribing your lecture..."}
              </p>
              <p className="text-text-muted text-sm mt-1">
                This usually takes a couple of minutes. This page updates
                automatically.
              </p>
            </div>
          )}

          {lecture.status === "failed" && (
            <div className="bg-status-failed-bg border border-status-failed-text/20 rounded-2xl p-6 text-center">
              <p className="text-status-failed-text font-medium">
                Transcription failed.
              </p>
              <p className="text-text-muted text-sm mt-1 mb-4">
                This can happen with network hiccups or provider limits. You can
                retry without re-uploading.
              </p>
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2 rounded-xl transition-colors disabled:opacity-60"
              >
                {retrying ? "Retrying..." : "Retry Processing"}
              </button>
            </div>
          )}
          {lecture.status === "done" && (
            <div className="space-y-5">
              {notesLoading && (
                <p className="text-text-secondary">Loading notes...</p>
              )}

              {notesError && (
                <div className="bg-status-failed-bg border border-status-failed-text/20 rounded-2xl p-6">
                  <p className="text-status-failed-text font-medium">
                    {notesError}
                  </p>
                  <p className="text-text-muted text-sm mt-1">
                    The transcript is still available below.
                  </p>
                </div>
              )}

              {notes && (
                <>
                  <NotesSection
                    title="Key Concepts"
                    icon="💡"
                    accentClass="bg-accent-soft text-accent"
                  >
                    {notes.concepts.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {notes.concepts.map((c, i) => (
                          <span
                            key={i}
                            className="bg-surface-alt border border-border text-text-secondary text-sm px-3 py-1.5 rounded-full"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-text-muted text-sm">
                        No key concepts detected.
                      </p>
                    )}
                  </NotesSection>

                  <NotesSection
                    title="Definitions"
                    icon="📖"
                    accentClass="bg-status-done-bg text-status-done-text"
                  >
                    {notes.definitions.length > 0 ? (
                      <div className="space-y-3">
                        {notes.definitions.map((d, i) => (
                          <div key={i}>
                            <p
                              className="font-medium text-text-primary text-sm"
                              dir="auto"
                            >
                              {d.term}
                            </p>
                            <p
                              className="text-text-secondary text-sm mt-0.5"
                              dir="auto"
                            >
                              {d.definition}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-text-muted text-sm">
                        No definitions detected.
                      </p>
                    )}
                  </NotesSection>

                  {notes.formulas.length > 0 && (
                    <NotesSection
                      title="Formulas"
                      icon="∑"
                      accentClass="bg-status-pending-bg text-status-pending-text"
                    >
                      <div className="space-y-2">
                        {notes.formulas.map((f, i) => (
                          <p
                            key={i}
                            className="font-mono text-sm bg-surface-alt border border-border rounded-lg px-4 py-2.5 text-text-primary"
                          >
                            {f}
                          </p>
                        ))}
                      </div>
                    </NotesSection>
                  )}

                  <NotesSection
                    title="Teacher Emphasized"
                    icon="⭐"
                    accentClass="bg-status-failed-bg text-status-failed-text"
                  >
                    {notes.emphasized_points.length > 0 ? (
                      <ul className="space-y-2">
                        {notes.emphasized_points.map((p, i) => (
                          <li
                            key={i}
                            className="text-text-secondary text-sm flex gap-2"
                          >
                            <span className="text-accent">•</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-text-muted text-sm">
                        No emphasized points detected.
                      </p>
                    )}
                  </NotesSection>
                </>
              )}
              <details className="bg-surface border border-border rounded-2xl p-6">
                <summary className="font-semibold text-text-primary cursor-pointer">
                  Full Transcript
                </summary>
                <div className="mt-4 space-y-3">
                  {lecture.transcript_segments &&
                  lecture.transcript_segments.length > 0 ? (
                    lecture.transcript_segments.map((seg, i) => (
                      <p
                        key={i}
                        className="text-text-secondary text-sm leading-relaxed"
                      >
                        {seg.text}
                      </p>
                    ))
                  ) : (
                    <p className="text-text-secondary text-sm whitespace-pre-wrap leading-relaxed">
                      {lecture.transcript_text || "No transcript available."}
                    </p>
                  )}
                </div>
              </details>
              {chunkCount !== null && (
                <p className="text-text-muted text-xs text-center">
                  Indexed as {chunkCount} searchable segments
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
