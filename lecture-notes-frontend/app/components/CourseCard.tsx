"use client";
import { useState } from "react";
import { Course } from "../types/database";
import Link from "next/link";
import EditableTitle from "./EditableTitle";
import { apiFetch } from "../lib/apiClient";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type Props = {
  course: Course;
  onDeleted: () => void;
};

export default function CourseCard({ course, onDeleted }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/api/courses/${course.id}`, { method: "DELETE" });
      onDeleted();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const handleRename = async (newName: string) => {
    await apiFetch(`/api/courses/${course.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: newName }),
    });
    onDeleted(); // reuse the existing refetch callback to refresh the list with the new name
  };

  return (
    <div className="relative group">
      <Link
        href={`/courses/${course.id}`}
        className="block bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center mb-4">
          <span className="text-accent font-semibold">
            {course.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <h3 className="font-semibold text-text-primary text-lg truncate pr-6">
          <EditableTitle value={course.name} onSave={handleRename} />
        </h3>
        <p className="text-text-muted text-sm mt-1">
          Created {new Date(course.created_at).toLocaleDateString()}
        </p>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          setConfirmOpen(true);
        }}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-text-muted hover:text-status-failed-text transition-opacity"
        aria-label="Delete course"
      >
        ✕
      </button>

      <ConfirmDeleteModal
        open={confirmOpen}
        title="Delete this course?"
        message={`This will permanently delete "${course.name}" and all its lectures, notes, and transcripts. This can't be undone.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  );
}
