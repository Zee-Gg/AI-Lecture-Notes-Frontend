'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { apiFetch } from '../../lib/apiClient';
import { Lecture } from '../../types/database';
import StatusBadge from '../../components/StatusBadge';
import UploadLectureModal from '../../components/UploadLectureModal';
import Link from 'next/link';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

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

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FAF9F6] px-6 py-10 sm:px-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="text-sm text-[#9A9A9A] hover:text-[#6B6B6B]">
            ← Back to courses
          </Link>

          <div className="flex items-center justify-between mt-4 mb-10">
            <h1 className="text-3xl font-bold text-[#1C1C1E] tracking-tight">
              Lectures
            </h1>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-[#E86A33] hover:bg-[#D65A28] text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              + Upload Lecture
            </button>
          </div>

          {loading ? (
            <p className="text-[#6B6B6B]">Loading lectures...</p>
          ) : lectures.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-[#D9D5CE] rounded-2xl">
              <p className="text-[#6B6B6B] text-lg">No lectures uploaded yet.</p>
              <p className="text-[#9A9A9A] text-sm mt-1">
                Upload your first recording to generate notes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lectures.map((lecture) => (
                <Link
                  key={lecture.id}
                  href={`/lectures/${lecture.id}`}
                  className="flex items-center justify-between bg-white border border-[#EDEAE3] rounded-xl px-5 py-4 hover:shadow-sm transition-shadow"
                >
                  <div>
                    <h3 className="font-medium text-[#1C1C1E]">{lecture.title}</h3>
                    <p className="text-[#9A9A9A] text-sm mt-0.5">
                      {new Date(lecture.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={lecture.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <UploadLectureModal
          courseId={id}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onUploaded={handleUploaded}
        />
      </main>
    </ProtectedRoute>
  );
}