'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { apiFetch } from '../../lib/apiClient';
import { Lecture } from '../../types/database';
import StatusBadge from '../../components/StatusBadge';
import UploadLectureModal from '../../components/UploadLectureModal';
import CourseChat from '../../components/CourseChat';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import Link from 'next/link';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState<Lecture | null>(null);
  const [deletingLecture, setDeletingLecture] = useState(false);

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
      await apiFetch(`/api/lectures/${lectureToDelete.id}`, { method: 'DELETE' });
      setLectureToDelete(null);
      fetchLectures();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingLecture(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-surface-alt px-6 py-10 sm:px-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="text-sm text-text-muted hover:text-text-secondary">
            ← Back to courses
          </Link>

          <div className="flex items-center justify-between mt-4 mb-10">
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">
              Lectures
            </h1>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              + Upload Lecture
            </button>
          </div>

          {loading ? (
            <p className="text-text-secondary">Loading lectures...</p>
          ) : lectures.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-border-dashed rounded-2xl">
              <p className="text-text-secondary text-lg">No lectures uploaded yet.</p>
              <p className="text-text-muted text-sm mt-1">
                Upload your first recording to generate notes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lectures.map((lecture) => (
                <div
                  key={lecture.id}
                  className="flex items-center justify-between bg-surface border border-border rounded-xl px-5 py-4 hover:shadow-sm transition-shadow group"
                >
                  <Link href={`/lectures/${lecture.id}`} className="flex-1">
                    <h3 className="font-medium text-text-primary">{lecture.title}</h3>
                    <p className="text-text-muted text-sm mt-0.5">
                      {new Date(lecture.created_at).toLocaleDateString()}
                    </p>
                  </Link>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={lecture.status} />
                    <button
                      onClick={() => setLectureToDelete(lecture)}
                      className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-status-failed-text transition-opacity"
                      aria-label="Delete lecture"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Course-level Q&A chat — searches across every lecture in this course */}
          <div className="mt-10">
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