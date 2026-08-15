'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { apiFetch } from '../lib/apiClient';
import { Course } from '../types/database';
import CourseCard from '../components/CourseCard';
import CreateCourseModal from '../components/CreateCourseModal';

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchCourses = () => {
    return apiFetch<Course[]>('/api/courses').then((data) => {
      setCourses(data);
    });
  };

  useEffect(() => {
    fetchCourses()
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = () => {
    fetchCourses().catch((err) => console.error(err));
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FAF9F6] px-6 py-10 sm:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-[#1C1C1E] tracking-tight">
                Your Courses
              </h1>
              <p className="text-[#6B6B6B] mt-1">
                Every lecture, organized and ready to revise.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-[#E86A33] hover:bg-[#D65A28] text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              + New Course
            </button>
          </div>

          {loading ? (
            <p className="text-[#6B6B6B]">Loading your courses...</p>
          ) : courses.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-[#D9D5CE] rounded-2xl">
              <p className="text-[#6B6B6B] text-lg">No courses yet.</p>
              <p className="text-[#9A9A9A] text-sm mt-1">
                Create one to start uploading lectures.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>

        <CreateCourseModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
        />
      </main>
    </ProtectedRoute>
  );
}