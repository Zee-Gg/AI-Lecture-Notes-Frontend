"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";
import { apiFetch } from "../lib/apiClient";
import { supabase } from "../lib/supabaseClient";
import { Course } from "../types/database";
import CourseCard from "../components/CourseCard";
import CreateCourseModal from "../components/CreateCourseModal";

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const fetchCourses = () => {
    return apiFetch<Course[]>("/api/courses").then((data) => {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-surface-alt px-6 py-10 sm:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white text-xs font-bold">
                AI
              </span>
              <span className="text-sm font-semibold text-text-primary tracking-tight">
                Lecture Notes Assistant
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-text-secondary hover:text-text-primary text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Log Out
            </button>
          </div>

          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-text-primary tracking-tight">
                Your Courses
              </h1>
              <p className="text-text-secondary mt-1">
                Every lecture, organized and ready to revise.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              + New Course
            </button>
          </div>

          {loading ? (
            <p className="text-text-secondary">Loading your courses...</p>
          ) : courses.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-border-dashed rounded-2xl">
              <p className="text-text-secondary text-lg">No courses yet.</p>
              <p className="text-text-muted text-sm mt-1">
                Create one to start uploading lectures.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} onDeleted={fetchCourses} />
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
