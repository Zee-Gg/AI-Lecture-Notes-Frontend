"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import { apiFetch } from "../../lib/apiClient";
import { Lecture } from "../../types/database";
import StatusBadge from "../../components/StatusBadge";
import UploadLectureModal from "../../components/UploadLectureModal";
import CourseChat from "../../components/CourseChat";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import Link from "next/link";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState<Lecture | null>(null);
  const [deletingLecture, setDeletingLecture] = useState(false);
  const [search, setSearch] = useState("");

  const fetchLectures = () => {
    return apiFetch<Lecture[]>(`/api/lectures/course/${id}`).then((data) => {
      setLectures(data);
    });
  };

  useEffect(() => {
    fetchLectures()
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUploaded = () => {
    fetchLectures().catch((err) => console.error(err));
  };

  const handleDeleteLecture = async () => {
    if (!lectureToDelete) return;
    setDeletingLecture(true);
    try {
      await apiFetch(`/api/lectures/${lectureToDelete.id}`, {
        method: "DELETE",
      });
      setLectureToDelete(null);
      fetchLectures();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingLecture(false);
    }
  };

  const doneCount = lectures.filter((l) => l.status === "done").length;
  const activeCount = lectures.filter(
    (l) => l.status === "pending" || l.status === "processing"
  ).length;
  const failedCount = lectures.filter((l) => l.status === "failed").length;

  const filteredLectures = lectures.filter((l) =>
    l.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-surface-alt px-6 py-10 sm:px-12">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors"
          >
            <span aria-hidden>←</span> Back to courses
          </Link>

          {/* Header */}
          <div className="relative overflow-hidden bg-surface border border-border rounded-2xl mt-4 mb-8 px-6 py-7 sm:px-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-accent-soft blur-2xl opacity-70"
            />
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 shrink-0 rounded-xl bg-accent flex items-center justify-center text-white text-xl shadow-sm">
                  🎓
                </span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                    Lectures
                  </h1>
                  {!loading && lectures.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-text-secondary">
                      <span>{lectures.length} total</span>
                      {doneCount > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-done-text" />
                          {doneCount} ready
                        </span>
                      )}
                      {activeCount > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          {activeCount} processing
                        </span>
                      )}
                      {failedCount > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-failed-text" />
                          {failedCount} failed
                        </span>
                      )}
                    </div>
                  )}
                  {!loading && lectures.length === 0 && (
                    <p className="text-text-secondary text-sm mt-1">
                      Upload a recording to get started.
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all shrink-0"
              >
                + Upload Lecture
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[68px] bg-surface border border-border rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : lectures.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-border-dashed rounded-2xl bg-surface/50">
              <span className="text-4xl">🎙️</span>
              <p className="text-text-secondary text-lg mt-3">
                No lectures uploaded yet.
              </p>
              <p className="text-text-muted text-sm mt-1">
                Upload your first recording to generate notes.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-5 bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                + Upload Lecture
              </button>
            </div>
          ) : (
            <>
              {lectures.length > 4 && (
                <div className="relative mb-4">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search lectures..."
                    className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              )}

              {filteredLectures.length === 0 ? (
                <p className="text-text-muted text-sm text-center py-10">
                  No lectures match &ldquo;{search}&rdquo;.
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredLectures.map((lecture) => (
                    <div
                      key={lecture.id}
                      className="relative overflow-hidden flex items-center justify-between gap-4 bg-surface border border-border rounded-xl px-5 py-4 hover:shadow-md hover:-translate-y-0.5 hover:border-accent/30 transition-all duration-200 group"
                    >
                      <Link
                        href={`/lectures/${lecture.id}`}
                        className="flex items-center gap-4 flex-1 min-w-0"
                      >
                        <span className="w-10 h-10 shrink-0 rounded-lg bg-accent-soft text-accent flex items-center justify-center text-base">
                          🎙️
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-medium text-text-primary truncate">
                            {lecture.title}
                          </h3>
                          <p className="text-text-muted text-sm mt-0.5">
                            {new Date(lecture.created_at).toLocaleDateString(
                              undefined,
                              { year: "numeric", month: "short", day: "numeric" }
                            )}
                          </p>
                        </div>
                      </Link>
                      <div className="flex items-center gap-3 shrink-0">
                        {lecture.status === "failed" && (
                          <button
                            onClick={async (e) => {
                              e.preventDefault();
                              try {
                                await apiFetch(
                                  `/api/lectures/${lecture.id}/retry`,
                                  {
                                    method: "POST",
                                  }
                                );
                                fetchLectures();
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="text-text-muted hover:text-accent transition-colors text-sm"
                            aria-label="Retry processing"
                          >
                            ↻ Retry
                          </button>
                        )}
                        <StatusBadge status={lecture.status} />
                        <button
                          onClick={() => setLectureToDelete(lecture)}
                          className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-status-failed-text transition-opacity"
                          aria-label="Delete lecture"
                        >
                          ✕
                        </button>
                      </div>

                      {(lecture.status === "pending" ||
                        lecture.status === "processing") && (
                        <span
                          aria-hidden
                          className="absolute bottom-0 left-0 h-0.5 w-full bg-accent-soft overflow-hidden"
                        >
                          <span className="block h-full w-1/3 bg-accent animate-loading-bar rounded-full" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Course-level Q&A chat — searches across every lecture in this course */}
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-accent-2-soft text-accent-2 flex items-center justify-center text-sm">
                💬
              </span>
              <h2 className="font-semibold text-text-primary">
                Course Assistant
              </h2>
            </div>
            <CourseChat courseId={id} />
          </div>
        </div>

        <UploadLectureModal
          courseId={id}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onUploaded={handleUploaded}
        />

        <ConfirmDeleteModal
          open={lectureToDelete !== null}
          title="Delete this lecture?"
          message={`This will permanently delete "${lectureToDelete?.title}" including its transcript, notes, and audio. This can't be undone.`}
          onCancel={() => setLectureToDelete(null)}
          onConfirm={handleDeleteLecture}
          deleting={deletingLecture}
        />
      </main>
    </ProtectedRoute>
  );
}
